import multer from "multer";
import db from "../config/db.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

const bufferToBase64 = (buffer) => {
  if (!buffer) return null;
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};

// --- [เช็คอิน] ---
export const checkIn = async (req, res) => {
  try {
    const { lat, lng, userId } = req.body;
    const photo = req.file;

    if (!lat || !lng || !photo || !userId) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน (ต้องมีพิกัด, รูปถ่าย และ ID)" });
    }

    const now = new Date();
    const workStart = new Date();
    workStart.setHours(9, 0, 0, 0); 
    const status = now > workStart ? "late" : "ontime";

    const [result] = await db.execute(
      "INSERT INTO attendance (user_id, type, lat, lng, status, photo, approval_status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)",
      [userId, "checkin", lat, lng, status, photo.buffer, now]
    );

    res.json({ message: "เช็คอินสำเร็จ", status, id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

// --- [เช็คเอาท์] ---
export const checkOut = async (req, res) => {
  try {
    const { lat, lng, userId, reason } = req.body;
    const photo = req.file;

    if (!lat || !lng || !photo || !userId) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    const now = new Date();
    const workEnd = new Date();
    workEnd.setHours(18, 0, 0, 0); 
    const status = now < workEnd ? "early" : "normal";

    await db.execute(
      "INSERT INTO attendance (user_id, type, lat, lng, status, photo, approval_status, reject_reason, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)",
      [userId, "checkout", lat, lng, status, photo.buffer, reason || null, now]
    );

    res.json({ message: "เช็คเอาท์สำเร็จ", status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- [ประวัติการเช็คอิน/เอาท์] ---
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "ไม่พบรหัสผู้ใช้" });

    const [rows] = await db.execute(
      "SELECT id, type, status, approval_status, created_at FROM attendance WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- [ดึงรายการรออนุมัติสำหรับ Manager] ---
export const getPendingApprovals = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.id, a.user_id as userId, u.name, a.type, a.status, 
             a.created_at as checkTime, a.photo, a.approval_status, a.reject_reason 
      FROM attendance a
      LEFT JOIN users u ON a.user_id = u.userid
      WHERE a.approval_status = 'pending' 
      ORDER BY a.created_at DESC
    `);

    const formattedData = rows.map(item => ({
      ...item,
      displayTime: new Date(item.checkTime).toLocaleString('th-TH'),
      checkPhoto: bufferToBase64(item.photo)
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- [อนุมัติ / ปฏิเสธ] ---
export const approveAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("UPDATE attendance SET approval_status = 'approved' WHERE id = ?", [id]);
    res.json({ message: "อนุมัติเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await db.execute(
      "UPDATE attendance SET approval_status = 'rejected', reject_reason = ? WHERE id = ?",
      [reason || "ไม่ระบุเหตุผล", id]
    );
    res.json({ message: "ปฏิเสธการเช็คอินเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};