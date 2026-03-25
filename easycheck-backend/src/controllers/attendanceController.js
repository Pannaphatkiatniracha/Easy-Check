import multer from "multer";
import db from "../config/db.js"; 

const storage = multer.memoryStorage();
export const upload = multer({ storage });

/*ฟังก์ชันแปลงรูปภาพจากฐานข้อมูลเป็น Base64*/
const bufferToBase64 = (buffer) => {
  if (!buffer) return null;
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
};

/*  เช็คอิน  */
export const checkIn = [
  upload.single("photo"),
  async (req, res) => {
    try {
      const { lat, lng, userId } = req.body; 
      const photo = req.file;

      if (!lat || !lng || !photo || !userId) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน (ขาดพิกัด, รูป หรือ ID ผู้ใช้)" });
      }

      const now = new Date();
      const workStart = new Date();
      workStart.setHours(9, 0, 0, 0); // เข้างาน 9 โมง
      const status = now > workStart ? "late" : "ontime";

      const [result] = await db.execute(
        "INSERT INTO attendance (user_id, type, lat, lng, status, photo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, "checkin", lat, lng, status, photo.buffer, now]
      );

      res.json({ message: "เช็คอินสำเร็จ", status, id: result.insertId });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

/*  เช็คเอาท์  */
export const checkOut = [
  upload.single("photo"),
  async (req, res) => {
    try {
      const { lat, lng, userId } = req.body;
      const photo = req.file;

      if (!lat || !lng || !photo || !userId) return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });

      const now = new Date();
      const workEnd = new Date();
      workEnd.setHours(18, 0, 0, 0); // เลิกงาน 6 โมงเย็น
      const status = now < workEnd ? "early" : "normal";

      await db.execute(
        "INSERT INTO attendance (user_id, type, lat, lng, status, photo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, "checkout", lat, lng, status, photo.buffer, now]
      );

      res.json({ message: "เช็คเอาท์สำเร็จ", status });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

/* ดึงรายการประวัติ (สำหรับหน้า Approve) */
export const getHistory = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.id, a.user_id as userId, u.name, u.avatar, a.type, a.status, 
             a.created_at as checkTime, a.photo, a.approval_status, a.reject_reason 
      FROM attendance a
      LEFT JOIN users u ON a.user_id = u.userid
      ORDER BY a.created_at DESC
    `);

    const formattedData = rows.map(item => ({
      ...item,
      displayTime: new Date(item.checkTime).toLocaleString('th-TH', { 
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
      }),
      checkPhoto: bufferToBase64(item.photo),
      photo: null 
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 4. อนุมัติ หรือ ปฏิเสธ  */
export const approveAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body; 
    
    await db.execute(
      "UPDATE attendance SET approval_status = ?, reject_reason = ? WHERE id = ?",
      [status, reason || null, id]
    );

    res.json({ message: "อัปเดตสถานะเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* --- 5. เช็คสถานะรายวัน --- */
export const getStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "ต้องระบุ userId" });

    const [rows] = await db.execute(
      "SELECT type, status FROM attendance WHERE user_id = ? AND DATE(created_at) = CURDATE()",
      [userId]
    );

    const checkInRecord = rows.find((i) => i.type === "checkin");
    const checkOutRecord = rows.find((i) => i.type === "checkout");

    res.json({
      checkIn: checkInRecord?.status || null,
      checkOut: checkOutRecord?.status || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};