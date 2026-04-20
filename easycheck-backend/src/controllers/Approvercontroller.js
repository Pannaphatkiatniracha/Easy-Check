import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/attendance/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // ใช้ id_employee จาก token เพื่อตั้งชื่อไฟล์
    cb(null, `attendance-${req.user.id_employee}-${unique}${path.extname(file.originalname)}`);
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

//  Helpers 
const calcTimeStatus = (currentTimeStr, shiftTimeStr, type) => {
  const [ch, cm] = currentTimeStr.split(":").map(Number);
  const [sh, sm] = shiftTimeStr.split(":").map(Number);
  const currentMins = ch * 60 + cm;
  const shiftMins = sh * 60 + sm;

  if (type === "checkin") return currentMins > shiftMins ? "late" : "ontime";
  if (type === "checkout") return currentMins < shiftMins ? "early" : "normal";
  return "normal";
};

// ดึงกะงานปัจจุบันของ User เพื่อเอามาเช็คสาย/ออกก่อนเวลา
const getUserShift = async (primaryId) => {
  const [rows] = await pool.query(
    `SELECT s.shift_id, s.start_time, s.end_time
     FROM User_shifts us
     JOIN Shifts s ON us.shift_id = s.shift_id
     WHERE us.id = ? 
     LIMIT 1`,
    [primaryId]
  );
  return rows[0] || null;
};

const hasLatLngColumns = async () => {
  try {
    const [columns] = await pool.query(`SHOW COLUMNS FROM attendance`);
    const names = columns.map((c) => c.Field);
    return names.includes("lat") || names.includes("check_in_lat"); 
  } catch {
    return false;
  }
};

//  POST /attendance/check-in 
export const checkIn = async (req, res) => {
  try {
    const empId = req.user.id_employee; 
    const primaryId = req.user.id;      
    const { lat, lng } = req.body;

    if (!req.file) return res.status(400).json({ message: "กรุณาถ่ายรูปก่อนเช็คอิน" });

    // ดึงกะงานปัจจุบันมาตรวจสอบ
    const shift = await getUserShift(primaryId);
    if (!shift) return res.status(400).json({ message: "ยังไม่ได้รับการกำหนดกะ กรุณาติดต่อหัวหน้า" });

    const [existing] = await pool.query(
      `SELECT id FROM attendance WHERE id_employee = ? AND work_date = CURDATE()`,
      [empId]
    );

    if (existing.length > 0) return res.status(400).json({ message: "คุณเช็คอินวันนี้ไปแล้ว" });
    
    const now = new Date();
    const currentTimeStr = now.toTimeString().split(" ")[0];
    const status = calcTimeStatus(currentTimeStr, shift.start_time, "checkin");
    const photoPath = req.file.path;
    const canSaveLatLng = await hasLatLngColumns();
    
    let result;
    
    //  เพิ่มการบันทึก shift.shift_id ลงในฐานข้อมูล attendance
    if (canSaveLatLng) {
      const [insertResult] = await pool.query(
        `INSERT INTO attendance (id_employee, shift_id, work_date, check_in_status, check_in_photo, approval_status, check_in_lat, check_in_lng, check_in_time)
         VALUES (?, ?, CURDATE(), ?, ?, 'pending', ?, ?, NOW())`,
        [empId, shift.shift_id, status, photoPath, lat || null, lng || null]
      );
      result = insertResult;
    } else {
      const [insertResult] = await pool.query(
        `INSERT INTO attendance (id_employee, shift_id, work_date, check_in_status, check_in_photo, approval_status, check_in_time)
         VALUES (?, ?, CURDATE(), ?, ?, 'pending', NOW())`,
        [empId, shift.shift_id, status, photoPath]
      );
      result = insertResult;
    }

    return res.json({
      message: "เช็คอินสำเร็จ",
      status,
      attendanceId: result.insertId,
      shift: { start: shift.start_time.slice(0, 5), end: shift.end_time.slice(0, 5) },
    });
  } catch (err) {
    console.error("checkIn error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// POST /attendance/check-out 
export const checkOut = async (req, res) => {
  try {
    const empId = req.user.id_employee;
    const primaryId = req.user.id;
    const { reason, lat, lng } = req.body;

    if (!req.file) return res.status(400).json({ message: "กรุณาถ่ายรูปก่อนเช็คเอาท์" });

    const [todayRecord] = await pool.query(
      `SELECT id, check_out_time FROM attendance WHERE id_employee = ? AND work_date = CURDATE()`,
      [empId]
    );
    if (todayRecord.length === 0) return res.status(400).json({ message: "ยังไม่ได้เช็คอินวันนี้" });
    if (todayRecord[0].check_out_time !== null) return res.status(400).json({ message: "คุณเช็คเอาท์วันนี้ไปแล้ว" });

    const shift = await getUserShift(primaryId);
    if (!shift) return res.status(400).json({ message: "ไม่พบกะของคุณ" });

    const now = new Date();
    const currentTimeStr = now.toTimeString().split(" ")[0];
    const status = calcTimeStatus(currentTimeStr, shift.end_time, "checkout");
    const photoPath = req.file.path;
    const approvalStatus = status === "early" ? "pending" : "approved";
    const canSaveLatLng = await hasLatLngColumns();

    if (canSaveLatLng) {
      await pool.query(
        `UPDATE attendance 
         SET check_out_status = ?, check_out_photo = ?, approval_status = ?, early_leave_reason = ?, check_out_lat = ?, check_out_lng = ?, check_out_time = NOW()
         WHERE id = ?`,
        [status, photoPath, approvalStatus, reason || null, lat || null, lng || null, todayRecord[0].id]
      );
    } else {
      await pool.query(
        `UPDATE attendance 
         SET check_out_status = ?, check_out_photo = ?, approval_status = ?, early_leave_reason = ?, check_out_time = NOW()
         WHERE id = ?`,
        [status, photoPath, approvalStatus, reason || null, todayRecord[0].id]
      );
    }

    return res.json({
      message: "เช็คเอาท์สำเร็จ",
      status,
      approvalStatus,
      note: status === "early" ? "บันทึกการออกก่อนเวลาเรียบร้อย ระบบส่งให้หัวหน้าตรวจสอบแล้ว" : null,
    });
  } catch (err) {
    console.error("checkOut error:", err);
    return res.status(500).json({ message: err.message });
  }
};

//  GET /attendance/history 
export const getHistory = async (req, res) => {
  try {
    const empId = req.user.id_employee;
    
    //  โค้ดใหม่: ตอน Join ให้ดึงกะงานจากตาราง attendance (a.shift_id) โดยตรงเลย
    const [rows] = await pool.query(
      `SELECT a.id, 'checkin' AS type, a.check_in_status AS status, a.check_in_photo AS photo, 
              a.approval_status, NULL AS reject_reason, a.check_in_time AS created_at,
              s.start_time AS shift_start, s.end_time AS shift_end
       FROM attendance a
       LEFT JOIN Shifts s ON s.shift_id = a.shift_id
       WHERE a.id_employee = ? AND a.check_in_time IS NOT NULL
       
       UNION ALL
       
       SELECT a.id, 'checkout' AS type, a.check_out_status AS status, a.check_out_photo AS photo, 
              a.approval_status, a.early_leave_reason AS reject_reason, a.check_out_time AS created_at,
              s.start_time AS shift_start, s.end_time AS shift_end
       FROM attendance a
       LEFT JOIN Shifts s ON s.shift_id = a.shift_id
       WHERE a.id_employee = ? AND a.check_out_time IS NOT NULL
       
       ORDER BY created_at DESC LIMIT 60`,
      [empId, empId]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//  GET /attendance/pending 
export const getPending = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.id_employee, 
              CASE WHEN a.check_out_status = 'early' THEN 'checkout' ELSE 'checkin' END AS type, 
              CASE WHEN a.check_out_status = 'early' THEN a.check_out_status ELSE a.check_in_status END AS status, 
              CASE WHEN a.check_out_status = 'early' THEN a.check_out_photo ELSE a.check_in_photo END AS photo, 
              a.approval_status, a.early_leave_reason AS reject_reason, 
              CASE WHEN a.check_out_status = 'early' THEN a.check_out_time ELSE a.check_in_time END AS created_at,
              u.firstname, u.lastname, u.id_employee AS emp_code, u.avatar, u.position, u.department
       FROM attendance a
       JOIN Users u ON u.id_employee = a.id_employee
       WHERE a.approval_status = 'pending'
       ORDER BY created_at DESC`
    );
    
    const formatted = rows.map((r) => ({
      id: r.id,
      userId: r.emp_code,
      name: `${r.firstname} ${r.lastname}`,
      type: r.type,
      status: r.status,
      displayTime: r.created_at ? new Date(r.created_at).toLocaleTimeString("th-TH") : "-",
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

// PUT /attendance/:id/approve 
export const approveAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE attendance SET approval_status = 'approved', reject_reason = NULL, early_leave_reason = NULL WHERE id = ?", [id]);
    return res.json({ message: "อนุมัติเรียบร้อย" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//  PUT /attendance/:id/reject 
export const rejectAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason?.trim()) return res.status(400).json({ message: "กรุณาระบุเหตุผล" });
    await pool.query("UPDATE attendance SET approval_status = 'rejected', reject_reason = ? WHERE id = ?", [reason, id]);
    return res.json({ message: "ปฏิเสธเรียบร้อย" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//  GET /attendance/shift/me 
export const getMyShift = async (req, res) => {
  try {
    const primaryId = req.user.id; 
    const shift = await getUserShift(primaryId);
    if (!shift) return res.status(404).json({ message: "ยังไม่มีกะ" });
    return res.json(shift);
  } catch (err) {
    console.error("getMyShift error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// 🐸🐸 ATTENDANCE-SUMMARY
export const getAttendanceHistory = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });
  
  try {
    const [rows] = await pool.query(
      `SELECT check_in_status AS status, DATE_FORMAT(work_date, '%Y-%m-%d') as date 
       FROM attendance WHERE id_employee = ? ORDER BY work_date DESC`,
      [userId]
    );

    const attendanceData = {
      onTimes: rows.filter(r => r.status === 'ontime' || r.status === 'on-time' || r.status === 'on_time').map(r => r.date),
      lates: rows.filter(r => r.status === 'late').map(r => r.date),
      leaves: rows.filter(r => r.status === 'leave').map(r => r.date)
    };
    res.json(attendanceData);
  } catch (err) {
    res.status(500).json({ message: "Database Error", error: err.message });
  }
}

// 🐸🐸 WORK-HOURS TRACKER
export const getWeeklyHours = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });
  try {
    const [rows] = await pool.query(
      `SELECT check_in_time, check_out_time, DAYNAME(work_date) as day 
       FROM attendance WHERE id_employee = ? 
       AND YEARWEEK(work_date, 1) = YEARWEEK(CURDATE(), 1) ORDER BY work_date ASC`,
      [userId]
    );

    const hoursData = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 };
    rows.forEach(row => {
      const day = row.day;
      if (row.check_in_time && row.check_out_time && hoursData.hasOwnProperty(day)) {
        const diffMs = new Date(row.check_out_time) - new Date(row.check_in_time);
        hoursData[day] = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1));
      }
    });
    res.json(hoursData);
  } catch (err) {
    res.status(500).json({ message: "Error calculating hours", error: err.message });
  }
}

// 🐸🐸 GET CURRENT STATUS
export const getCurrentStatus = async (req, res) => {
  const { userId } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT check_in_time, check_out_time, check_in_status, check_out_status 
       FROM attendance WHERE id_employee = ? AND work_date = CURDATE() LIMIT 1`,
      [userId]
    );

    let result = { message: "no-activity" };
    if (rows.length > 0) {
      const row = rows[0];
      if (row.check_out_time) {
        result = { type: 'checkout', status: row.check_out_status, created_at: row.check_out_time };
      } else if (row.check_in_time) {
        result = { type: 'checkin', status: row.check_in_status, created_at: row.check_in_time };
      }
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}