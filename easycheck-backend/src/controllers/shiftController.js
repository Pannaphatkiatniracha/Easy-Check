import pool from "../config/db.js";

// ดึง shift ทั้งหมด
export const getShifts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT shift_id, start_time, end_time FROM Shifts ORDER BY start_time"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// user + shift ปัจจุบัน (กรองตามสาขา)
export const getUsersWithShifts = async (req, res) => {
  try {
    const { branch_id } = req.query;

    let query = `
      SELECT u.id, u.id_employee, u.firstname, u.lastname,
             u.position, u.department, u.branch_id, u.avatar, u.role_id,
             us.shift_id
      FROM Users u
      LEFT JOIN User_shifts us ON u.id = us.id
    `;
    const params = [];

    // เพิ่มเงื่อนไขการกรองสาขา
    if (branch_id) {
      query += ` WHERE u.branch_id = ?`;
      params.push(branch_id);
    }

    query += ` ORDER BY u.department, u.firstname`;

    const [rows] = await pool.query(query, params);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// assign / update shift
export const assignShift = async (req, res) => {
  try {
    const { userId, shiftId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId จำเป็น" });
    }

    const [users] = await pool.query(
      "SELECT id, role_id FROM Users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "ไม่พบพนักงาน" });
    }

    const user = users[0];

    // รองรับกรณีอยากถอดกะพนักงาน
    if (shiftId === null || shiftId === "") {
      await pool.query("DELETE FROM User_shifts WHERE id = ?", [userId]);
      return res.json({ message: "ยกเลิกกะเรียบร้อยแล้ว" });
    }

    const [exists] = await pool.query(
      "SELECT id FROM User_shifts WHERE id = ? LIMIT 1",
      [userId]
    );

    if (exists.length > 0) {
      await pool.query(
        "UPDATE User_shifts SET shift_id = ?, role_id = ? WHERE id = ?",
        [shiftId, user.role_id, userId]
      );
      return res.json({ message: "อัปเดตกะแล้ว" });
    } else {
      await pool.query(
        "INSERT INTO User_shifts (id, shift_id, role_id) VALUES (?, ?, ?)",
        [userId, shiftId, user.role_id]
      );
      return res.json({ message: "เพิ่มกะแล้ว" });
    }
  } catch (err) {
    console.error("assignShift error:", err);
    res.status(500).json({ message: err.message });
  }
};