import multer from "multer";

import path from "path";
import fs from "fs";
import pool from "../config/db.js";

import db from '../config/db.js'


// ─── Multer Setup ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/attendance/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `attendance-${req.user.id}-${unique}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  file.mimetype.startsWith("image/")
    ? cb(null, true)
    : cb(new Error("ต้องเป็นไฟล์รูปภาพเท่านั้น"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcTimeStatus = (currentTimeStr, shiftTimeStr, type) => {
  const [ch, cm] = currentTimeStr.split(":").map(Number);
  const [sh, sm] = shiftTimeStr.split(":").map(Number);

  const currentMins = ch * 60 + cm;
  const shiftMins = sh * 60 + sm;

  if (type === "checkin") return currentMins > shiftMins ? "late" : "ontime";
  if (type === "checkout") return currentMins < shiftMins ? "early" : "normal";
  return "normal";
};

const getUserShift = async (userId) => {
  const [rows] = await pool.query(
    `SELECT s.shift_id, s.start_time, s.end_time
     FROM user_shifts us
     JOIN shifts s ON us.shift_id = s.shift_id
     WHERE us.id = ?
     LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
};

const hasLatLngColumns = async () => {
  try {
    const [columns] = await pool.query(`SHOW COLUMNS FROM attendance`);
    const names = columns.map((c) => c.Field);
    return names.includes("lat") && names.includes("lng");
  } catch {
    return false;
  }
};

// ─── POST /attendance/check-in ────────────────────────────────────────────────
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lat, lng } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "กรุณาถ่ายรูปก่อนเช็คอิน" });
    }

    const shift = await getUserShift(userId);
    if (!shift) {
      return res.status(400).json({
        message: "ยังไม่ได้รับการกำหนดกะ กรุณาติดต่อหัวหน้า",
      });
    }

    const [existing] = await pool.query(
      `SELECT id
       FROM attendance
       WHERE id_employee = ?
         AND type = 'checkin'
         AND DATE(created_at) = CURDATE()`,
      [userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "คุณเช็คอินวันนี้ไปแล้ว" });
    }

    const now = new Date();
    const currentTimeStr = now.toTimeString().split(" ")[0];
    const status = calcTimeStatus(currentTimeStr, shift.start_time, "checkin");
    const photoPath = req.file.path;

    const canSaveLatLng = await hasLatLngColumns();
    let result;

    if (canSaveLatLng) {
      const [insertResult] = await pool.query(
        `INSERT INTO attendance
          (id_employee, type, status, photo, approval_status, lat, lng, created_at)
         VALUES (?, 'checkin', ?, ?, 'pending', ?, ?, NOW())`,
        [userId, status, photoPath, lat || null, lng || null]
      );
      result = insertResult;
    } else {
      const [insertResult] = await pool.query(
        `INSERT INTO attendance
          (id_employee, type, status, photo, approval_status, created_at)
         VALUES (?, 'checkin', ?, ?, 'pending', NOW())`,
        [userId, status, photoPath]
      );
      result = insertResult;
    }

    return res.json({
      message: "เช็คอินสำเร็จ",
      status,
      attendanceId: result.insertId,
      shift: {
        start: shift.start_time.slice(0, 5),
        end: shift.end_time.slice(0, 5),
      },
    });
  } catch (err) {
    console.error("checkIn error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ─── POST /attendance/check-out ───────────────────────────────────────────────
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reason, lat, lng } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "กรุณาถ่ายรูปก่อนเช็คเอาท์" });
    }

    const [checkin] = await pool.query(
      `SELECT id
       FROM attendance
       WHERE id_employee = ?
         AND type = 'checkin'
         AND DATE(created_at) = CURDATE()`,
      [userId]
    );

    if (checkin.length === 0) {
      return res.status(400).json({ message: "ยังไม่ได้เช็คอินวันนี้" });
    }

    const [existingOut] = await pool.query(
      `SELECT id
       FROM attendance
       WHERE id_employee = ?
         AND type = 'checkout'
         AND DATE(created_at) = CURDATE()`,
      [userId]
    );

    if (existingOut.length > 0) {
      return res.status(400).json({ message: "คุณเช็คเอาท์วันนี้ไปแล้ว" });
    }

    const shift = await getUserShift(userId);
    if (!shift) {
      return res.status(400).json({ message: "ไม่พบกะของคุณ" });
    }

    const now = new Date();
    const currentTimeStr = now.toTimeString().split(" ")[0];
    const status = calcTimeStatus(currentTimeStr, shift.end_time, "checkout");
    const photoPath = req.file.path;

    const approvalStatus = status === "early" ? "pending" : "approved";
    const canSaveLatLng = await hasLatLngColumns();

    if (canSaveLatLng) {
      await pool.query(
        `INSERT INTO attendance
          (id_employee, type, status, photo, approval_status, reject_reason, lat, lng, created_at)
         VALUES (?, 'checkout', ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          status,
          photoPath,
          approvalStatus,
          reason || null,
          lat || null,
          lng || null,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO attendance
          (id_employee, type, status, photo, approval_status, reject_reason, created_at)
         VALUES (?, 'checkout', ?, ?, ?, ?, NOW())`,
        [userId, status, photoPath, approvalStatus, reason || null]
      );
    }

    return res.json({
      message: "เช็คเอาท์สำเร็จ",
      status,
      approvalStatus,
      note:
        status === "early"
          ? "บันทึกการออกก่อนเวลาเรียบร้อย ระบบส่งให้หัวหน้าตรวจสอบแล้ว"
          : null,
    });
  } catch (err) {
    console.error("checkOut error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ─── GET /attendance/history ──────────────────────────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT a.id, a.type, a.status, a.photo, a.approval_status,
              a.reject_reason, a.created_at,
              s.start_time AS shift_start, s.end_time AS shift_end
       FROM attendance a
       LEFT JOIN user_shifts us ON us.id = a.id_employee
       LEFT JOIN shifts s ON s.shift_id = us.shift_id
       WHERE a.id_employee = ?
       ORDER BY a.created_at DESC
       LIMIT 60`,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─── GET /attendance/pending ──────────────────────────────────────────────────
export const getPending = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.id_employee, a.type, a.status,
              a.photo, a.approval_status, a.reject_reason, a.created_at,
              u.firstname, u.lastname, u.id_employee AS emp_code,
              u.avatar, u.position, u.department
       FROM attendance a
       JOIN users u ON u.id = a.id_employee
       WHERE a.approval_status = 'pending'
       ORDER BY a.created_at DESC`
    );

    const formatted = rows.map((r) => ({
      id: r.id,
      userId: r.emp_code,
      name: `${r.firstname} ${r.lastname}`,
      type: r.type,
      status: r.status,
      displayTime: new Date(r.created_at).toLocaleTimeString("th-TH"),
      checkPhoto: r.photo ? `http://localhost:5000/${r.photo}` : null,
      avatar: r.avatar ? `http://localhost:5000/${r.avatar}` : null,
      reason: r.reject_reason,
      position: r.position,
      department: r.department,
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─── PUT /attendance/:id/approve ──────────────────────────────────────────────
export const approveAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE attendance
       SET approval_status = 'approved',
           reject_reason = NULL
       WHERE id = ?`,
      [id]
    );

    return res.json({ message: "อนุมัติเรียบร้อย" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─── PUT /attendance/:id/reject ───────────────────────────────────────────────
export const rejectAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason?.trim()) {
      return res.status(400).json({ message: "กรุณาระบุเหตุผล" });
    }

    await pool.query(
      `UPDATE attendance
       SET approval_status = 'rejected',
           reject_reason = ?
       WHERE id = ?`,
      [reason, id]
    );

    return res.json({ message: "ปฏิเสธเรียบร้อย" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─── GET /attendance/shift/me ─────────────────────────────────────────────────
export const getMyShift = async (req, res) => {
  try {
    const shift = await getUserShift(req.user.id);

    if (!shift) {
      return res.status(404).json({ message: "ยังไม่มีกะ" });
    }

    return res.json(shift);
  } catch (err) {
    console.error("getMyShift error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ----------------------------------------------------------------------

// 🐸🐸 ATTENDANCE-SUMMARY
export const getAttendanceHistory = async (req, res) => {
  
  // ตอนฟ้อนเอน req มาก็เก็บ id ไปด้วยเลย
  const { userId } = req.query
  
  if (!userId) return res.status(400).json({ message: "userId is required" })

    try {
        const [rows] = await db.query(
          // อันนี้มันจะเอาแค่ status กับวันที่
            `SELECT status, DATE_FORMAT(created_at, '%Y-%m-%d') as date 
            FROM attendance 
            WHERE id_employee = ? 
            ORDER BY created_at DESC`, 
            [userId]
        )

        const attendanceData = {
            onTimes: rows.filter(r => r.status === 'on-time').map(r => r.date), // ดึงเฉพาะแถวที่ตรงกับ status แล้วเอาออกมาแค่ date
            lates: rows.filter(r => r.status === 'late').map(r => r.date),
            leaves: rows.filter(r => r.status === 'leave').map(r => r.date)
        }

        res.json(attendanceData)
    } 
    
    catch (err) {
        res.status(500).json({ message: "Database Error", error: err.message })
    }
}


// 🐸🐸 WORK-HOURS TRACKER (คำนวณชั่วโมงทำงานรายสัปดาห์)
export const getWeeklyHours = async (req, res) => {

  // ตอนฟ้อนเอน req มาก็เก็บ id ไปด้วยเลย
  const { userId } = req.query

  if (!userId) return res.status(400).json({ message: "userId is required" })

    try {
        const [rows] = await db.query(
            `SELECT type, created_at, DAYNAME(created_at) as day 
             FROM attendance 
             WHERE id_employee = ? 
             AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
             ORDER BY created_at ASC`, 
            [userId]
        )

        const hoursData = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 }
        const tempLog = {}

        rows.forEach(row => {
            const day = row.day
            if (!tempLog[day]) tempLog[day] = { in: null, out: null }

            if (row.type === 'in') {
                tempLog[day].in = new Date(row.created_at)
            } else if (row.type === 'out') {
                tempLog[day].out = new Date(row.created_at)
            }

            if (tempLog[day].in && tempLog[day].out) {
                const diffMs = tempLog[day].out - tempLog[day].in
                const diffHrs = diffMs / (1000 * 60 * 60);
                hoursData[day] = parseFloat(diffHrs.toFixed(1))
            }
        })

        res.json(hoursData)
    } catch (err) {
        res.status(500).json({ message: "Error calculating hours", error: err.message })
    }
}


// 🐸🐸 GET CURRENT STATUS (เช็คว่าวันนี้ทำอะไรไปแล้วบ้าง)
export const getCurrentStatus = async (req, res) => {
    const { userId } = req.query
    try {
        const [rows] = await db.query(
            `SELECT type, status, created_at 
            FROM attendance 
            WHERE id_employee = ? AND DATE(created_at) = CURDATE() 
            ORDER BY created_at DESC LIMIT 1`,
            [userId]
        )

        res.json(rows[0] || { message: "no-activity" })
    } 
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}