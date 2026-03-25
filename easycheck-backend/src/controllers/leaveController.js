import db from "../config/db.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const uploadLeave = multer({ storage });

/* ฟังก์ชันแปลงรูปภาพจาก Database เป็น Base64 เพื่อส่งไปแสดงผลที่ React */
const bufferToBase64 = (buffer) => {
  if (!buffer) return null;
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};

// 1. ส่งคำขอลางาน (POST /leave/request)
export const fileLeaveRequest = async (req, res) => {
  try {
    const { userId, leaveStart, leaveEnd, leaveReasons, otherReasonText } = req.body;
    const file = req.file; 

    if (!userId || !leaveStart || !leaveEnd || !leaveReasons) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    // สำคัญ: เนื่องจาก leaveReasons จาก FormData มักจะมาเป็น String JSON 
    // เราควรเก็บเป็น String หรือแปลงให้เรียบร้อยก่อนลง DB
    const reasonsStr = typeof leaveReasons === 'string' ? leaveReasons : JSON.stringify(leaveReasons);

    const [result] = await db.execute(
      "INSERT INTO leave_requests (user_id, leave_start, leave_end, leave_reasons, other_reason, evidence_file, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, leaveStart, leaveEnd, reasonsStr, otherReasonText || null, file ? file.buffer : null, 'pending']
    );

    res.json({ message: "ยื่นคำขอลางานสำเร็จ", id: result.insertId });
  } catch (err) {
    console.error("Error in fileLeaveRequest:", err);
    res.status(500).json({ message: err.message });
  }
};

// 2. ดูประวัติการลา (GET /leave/history)
export const getLeaveHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "ต้องระบุ userId" });

    const [rows] = await db.execute(
      "SELECT id, user_id, leave_start, leave_end, leave_reasons, other_reason, status, evidence_file, reject_reason, created_at FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    // แปลงข้อมูลก่อนส่งกลับไปที่หน้าบ้าน (เช่น แปลงรูปภาพ)
    const formattedData = rows.map(item => ({
      ...item,
      // แปลง Buffer เป็น Base64 เพื่อให้แท็ก <img src={...} /> ใน React ทำงานได้
      evidenceFile: bufferToBase64(item.evidence_file)
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Error in getLeaveHistory:", err);
    res.status(500).json({ message: err.message });
  }
};