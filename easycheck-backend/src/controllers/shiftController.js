import pool from "../config/db.js";

// ดึง shift ทั้งหมด
export const getShifts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT shift_id, start_time, end_time FROM shifts ORDER BY start_time"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// user + shift ปัจจุบัน
export const getUsersWithShifts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.id_employee, u.firstname, u.lastname,
             u.position, u.department, u.branch, u.avatar, u.role_id,
             us.shift_id
      FROM users u
      LEFT JOIN user_shifts us ON u.id = us.id
      ORDER BY u.department, u.firstname
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// assign / update shift
export const assignShift = async (req, res) => {
  try {
    const { userId, shiftId } = req.body;

    if (!userId || !shiftId) {
      return res.status(400).json({ message: "userId และ shiftId จำเป็น" });
    }

    const [users] = await pool.query(
      "SELECT id, role_id FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "ไม่พบพนักงาน" });
    }

    const user = users[0];

    const [exists] = await pool.query(
      "SELECT id FROM user_shifts WHERE id = ? LIMIT 1",
      [userId]
    );

    if (exists.length > 0) {
      await pool.query(
        "UPDATE user_shifts SET shift_id = ?, role_id = ? WHERE id = ?",
        [shiftId, user.role_id, userId]
      );
      return res.json({ message: "อัปเดตกะแล้ว" });
    } else {
      await pool.query(
        "INSERT INTO user_shifts (id, shift_id, role_id) VALUES (?, ?, ?)",
        [userId, shiftId, user.role_id]
      );
      return res.json({ message: "เพิ่มกะแล้ว" });
    }
  } catch (err) {
    console.error("assignShift error:", err);
    res.status(500).json({ message: err.message });
  }
};