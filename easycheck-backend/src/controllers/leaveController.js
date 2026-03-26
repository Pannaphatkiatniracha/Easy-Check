import multer from "multer";
import db from "../config/db.js";

// ตั้งค่า Multer สำหรับรับไฟล์
const storage = multer.memoryStorage();
export const upload = multer({ storage });

const bufferToBase64 = (buffer) => {
  if (!buffer) return null;
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};

// =======================
// ✅ ส่งคำขอลางาน
// =======================
export const createLeaveRequest = async (req, res) => {
  try {
    const { userId, leaveStart, leaveEnd, leaveReasons, otherReasonText } = req.body;
    const file = req.file;

    if (!userId || !leaveStart || !leaveEnd || !leaveReasons) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    const reasons = JSON.parse(leaveReasons);

    await db.execute(
      `INSERT INTO leave_requests 
      (user_id, leave_start, leave_end, leave_reasons, other_reason, evidence_file, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        userId,
        leaveStart,
        leaveEnd,
        JSON.stringify(reasons),
        otherReasonText || null,
        file ? file.buffer : null,
      ]
    );

    res.json({ message: "ส่งคำขอลางานสำเร็จ" });
  } catch (err) {
    console.error("Error creating leave request:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ✅ ประวัติการลา
// =======================
export const getLeaveHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const [rows] = await db.execute(
      `SELECT id, leave_start, leave_end, leave_reasons, other_reason, status, created_at
       FROM leave_requests
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ✅ pending (สำหรับ manager)
// =======================
export const getPendingLeaves = async (req, res) => {
  try {
    // 1. ดึงข้อมูลการลาทั้งหมด
    const [leaves] = await db.execute(`
      SELECT * FROM leave_requests WHERE status = 'pending' ORDER BY created_at DESC
    `);

    // 2. ดึงข้อมูลพนักงานทั้งหมด (แยกดึงเพื่อแก้ปัญหาชื่อคอลัมน์ไม่ตรงใน SQL JOIN)
    const [users] = await db.execute(`SELECT * FROM users`);

    const formatted = leaves.map((l) => {
      // จับคู่ user_id จากการลา กับ employee_id ในตาราง users
      const user = users.find(u => u.employee_id === l.user_id || u.userid === l.user_id) || {};
      
      // จัดการชื่อ (เช็คอัตโนมัติว่า DB คุณมีคอลัมน์ชื่อแบบไหน)
      let fullName = l.user_id; // ตั้งต้นด้วยรหัสพนักงาน
      if (user.first_name && user.last_name) {
          fullName = `${user.first_name} ${user.last_name}`;
      } else if (user.name) {
          fullName = user.name;
      } else if (user.first_name) {
          fullName = user.first_name;
      }

      return {
        id: l.id,
        name: fullName,
        employeeId: l.user_id,
        profile: user.avatar || null,
        leaveStart: l.leave_start,
        leaveEnd: l.leave_end,
        reasons: l.leave_reasons ? JSON.parse(l.leave_reasons) : [],
        otherReason: l.other_reason,
        evidencePreview: bufferToBase64(l.evidence_file),
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching pending leaves:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ✅ approve
// =======================
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("UPDATE leave_requests SET status = 'approved' WHERE id = ?", [id]);
    res.json({ message: "อนุมัติการลาเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ✅ reject
// =======================
export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await db.execute(
      "UPDATE leave_requests SET status = 'rejected', reject_reason = ? WHERE id = ?",
      [reason || "ไม่ระบุเหตุผล", id]
    );
    res.json({ message: "ไม่อนุมัติการลาเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};