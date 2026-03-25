import multer from "multer";
import db from "../config/db.js";

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
    const {
      userId,
      leaveStart,
      leaveEnd,
      leaveReasons,
      otherReasonText,
    } = req.body;

    const file = req.file;

    if (!userId || !leaveStart || !leaveEnd || !leaveReasons) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    const reasons = JSON.parse(leaveReasons);

    await db.execute(
      `INSERT INTO leave_requests 
      (user_id, leave_start, leave_end, reasons, other_reason, evidence, status, created_at)
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
      `SELECT id, leave_start, leave_end, reasons, other_reason, status, created_at
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
    const [rows] = await db.execute(`
      SELECT 
        l.id,
        l.user_id as userId,
        u.name,
        u.avatar,
        l.leave_start,
        l.leave_end,
        l.reasons,
        l.other_reason,
        l.evidence,
        l.status
      FROM leave_requests l
      LEFT JOIN users u ON l.user_id = u.userid
      WHERE l.status = 'pending'
      ORDER BY l.created_at DESC
    `);

    const formatted = rows.map((r) => ({
      id: r.id,
      name: r.name,
      employeeId: r.userId,
      profile: r.avatar,
      leaveStart: r.leave_start,
      leaveEnd: r.leave_end,
      reasons: JSON.parse(r.reasons),
      otherReason: r.other_reason,
      evidencePreview: bufferToBase64(r.evidence),
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ✅ approve
// =======================
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      "UPDATE leave_requests SET status = 'approved' WHERE id = ?",
      [id]
    );

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