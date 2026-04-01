import multer from "multer";
import db from "../config/db.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

// 🔥 พิกัดบริษัท (ของจริง)
const OFFICE_LAT = 13.756222;
const OFFICE_LNG = 100.418917;
const RADIUS_METERS = 300; // แนะนำ 300m กัน GPS เพี้ยน

// 📏 คำนวณระยะ (Haversine)
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- CHECK IN ---
export const checkIn = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const photo = req.file;

    const userId = req.user.id; // 🔥 ใช้จาก JWT

    if (!lat || !lng || !photo) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    // 🔥 เช็คระยะ
    const distance = getDistanceFromLatLonInMeters(
      parseFloat(lat),
      parseFloat(lng),
      OFFICE_LAT,
      OFFICE_LNG
    );

    if (distance > RADIUS_METERS) {
      return res.status(403).json({
        message: `อยู่นอกบริษัท (ห่าง ${Math.round(distance)} เมตร)`
      });
    }

    const now = new Date();

    // 🔥 ดึง shift
    const [shift] = await db.execute(
      "SELECT start_time FROM shifts WHERE id_employee = ?",
      [userId]
    );

    const startTime = shift.length ? shift[0].start_time : "09:00:00";
    const workStart = new Date();
    const [h, m, s] = startTime.split(":");
    workStart.setHours(h, m, s, 0);

    const status = now > workStart ? "late" : "ontime";

    const [result] = await db.execute(
      `INSERT INTO attendance 
      (id_employee, type, status, photo, approval_status, created_at)
      VALUES (?, ?, ?, ?, 'pending', ?)`,
      [userId, "checkin", status, photo.buffer, now]
    );

    res.json({
      message: "เช็คอินสำเร็จ",
      status,
      distance: Math.round(distance),
      id: result.insertId
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- CHECK OUT ---
export const checkOut = async (req, res) => {
  try {
    const { lat, lng, reason } = req.body;
    const photo = req.file;
    const userId = req.user.id;

    if (!lat || !lng || !photo) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    const distance = getDistanceFromLatLonInMeters(
      parseFloat(lat),
      parseFloat(lng),
      OFFICE_LAT,
      OFFICE_LNG
    );

    if (distance > RADIUS_METERS) {
      return res.status(403).json({
        message: `อยู่นอกบริษัท (ห่าง ${Math.round(distance)} เมตร)`
      });
    }

    const now = new Date();

    // 🔥 ดึง shift
    const [shift] = await db.execute(
      "SELECT end_time FROM shifts WHERE id_employee = ?",
      [userId]
    );

    const endTime = shift.length ? shift[0].end_time : "18:00:00";
    const workEnd = new Date();
    const [h, m, s] = endTime.split(":");
    workEnd.setHours(h, m, s, 0);

    const status = now < workEnd ? "early" : "normal";

    await db.execute(
      `INSERT INTO attendance 
      (id_employee, type, status, photo, approval_status, reject_reason, created_at)
      VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
      [userId, "checkout", status, photo.buffer, reason || null, now]
    );

    res.json({
      message: "เช็คเอาท์สำเร็จ",
      status,
      distance: Math.round(distance)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- HISTORY ---
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT id, type, status, approval_status, created_at
       FROM attendance
       WHERE id_employee = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};