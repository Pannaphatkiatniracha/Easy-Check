// approverController.js — Backend สำหรับ Approver จัดการกะพนักงาน

// ─── GET /approver/users-with-shifts ──────────────────────────────────────────
// ดึงพนักงานทุกคน พร้อมกะปัจจุบัน (ถ้ามี)
export const getUsersWithShifts = async (req, res) => {
  const db = req.app.get("db");
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.id_employee, u.firstname, u.lastname,
              u.position, u.department, u.branch, u.avatar,
              us.shift_id AS current_shift_id
       FROM users u
       LEFT JOIN user_shifts us ON us.id = u.id
       WHERE u.role_id = (SELECT id FROM roles WHERE name = 'user')
       ORDER BY u.department, u.firstname`
    );
    // หมายเหตุ: ปรับ role_id condition ให้ตรงกับ DB จริง
    // ถ้า roles ไม่มีตาราง name ให้เปลี่ยน WHERE เป็น u.role_id = 1 (แล้วแต่ค่า)
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /approver/shifts ─────────────────────────────────────────────────────
// ดึงกะทั้งหมด
export const getAllShifts = async (req, res) => {
  const db = req.app.get("db");
  try {
    const [rows] = await db.query("SELECT * FROM shifts ORDER BY start_time");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /approver/assign-shift ──────────────────────────────────────────────
// กำหนด (หรืออัปเดต) กะให้พนักงาน
// Body: { userId, shiftId }
export const assignShift = async (req, res) => {
  const db = req.app.get("db");
  try {
    const { userId, shiftId } = req.body;

    if (!userId || !shiftId) {
      return res.status(400).json({ message: "userId และ shiftId จำเป็น" });
    }

    // ดึง role_id ของ user มาด้วย (ต้องเก็บใน user_shifts)
    const [[user]] = await db.query("SELECT role_id FROM users WHERE id = ?", [userId]);
    if (!user) return res.status(404).json({ message: "ไม่พบพนักงาน" });

    // UPSERT — ถ้ามีอยู่แล้วให้อัปเดต ถ้าไม่มีให้ insert
    await db.query(
      `INSERT INTO user_shifts (id, shift_id, role_id)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE shift_id = VALUES(shift_id)`,
      [userId, shiftId, user.role_id]
    );

    res.json({ message: "กำหนดกะสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// เพิ่มฟังก์ชันใหม่ ─── GET /approver/shift-details ──────────────────────
// ฟังก์ชันใหม่ที่ดึงรายละเอียดของกะที่กำหนดให้พนักงาน
export const getShiftDetails = async (req, res) => {
  const db = req.app.get("db");
  try {
    const userId = req.params.userId;

    // ดึงข้อมูลกะที่พนักงานคนนั้นๆ ได้รับการกำหนด
    const [rows] = await db.query(
      `SELECT s.shift_id, s.start_time, s.end_time
       FROM user_shifts us
       JOIN shifts s ON s.shift_id = us.shift_id
       WHERE us.id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกะสำหรับพนักงานนี้" });
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};