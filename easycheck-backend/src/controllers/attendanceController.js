import multer from "multer";
import db from '../config/db.js'

// ---------- upload ----------
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ---------- check in ----------
export const checkIn = async (req, res) => {
  try {
    const { lat, lng, userId } = req.body;

    if (!lat || !lng || !userId || !req.file) {
      return res.status(400).json({
        message: "ข้อมูลไม่ครบ",
      });
    }

    res.json({
      message: "เช็คอินสำเร็จ",
      status: "ontime",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- check out ----------
export const checkOut = async (req, res) => {
  try {
    const { lat, lng, userId } = req.body;

    if (!lat || !lng || !userId || !req.file) {
      return res.status(400).json({
        message: "ข้อมูลไม่ครบ",
      });
    }

    res.json({
      message: "เช็คเอาท์สำเร็จ",
      status: "normal",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- history ----------
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "ไม่พบ userId" });
    }

    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- approve ----------
export const approveAttendance = async (req, res) => {
  try {
    res.json({ message: "อนุมัติเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- reject ----------
export const rejectAttendance = async (req, res) => {
  try {
    res.json({ message: "ปฏิเสธเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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