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

// ดึง users พร้อม shift ปัจจุบัน — ใช้ Users.shift_id เป็น source of truth
export const getUsersWithShifts = async (req, res) => {
  try {
    const { branch_id } = req.query;

    //  ดึง shift_id จาก Users โดยตรง (ไม่ JOIN User_shifts แล้ว)
    let query = `
      SELECT
        u.id,
        u.id_employee,
        u.firstname,
        u.lastname,
        u.position,
        u.department,
        u.branch_id,
        u.avatar,
        u.role_id,
        u.shift_id
      FROM Users u
    `;
    const params = [];

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

// assign / ยกเลิกกะ — อัปเดต Users.shift_id เป็น source of truth
// และ sync User_shifts ไว้ด้วยเพื่อ backward compatibility
export const assignShift = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { userId, shiftId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId จำเป็น" });
    }

    const [users] = await conn.query(
      "SELECT id, role_id FROM Users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "ไม่พบพนักงาน" });
    }

    const user = users[0];
    const newShiftId = shiftId === null || shiftId === "" ? null : Number(shiftId);

    await conn.beginTransaction();

    //  อัปเดต Users.shift_id (source of truth)
    await conn.query("UPDATE Users SET shift_id = ? WHERE id = ?", [
      newShiftId,
      userId,
    ]);

    // Sync User_shifts ให้ตรงกัน
    if (newShiftId === null) {
      // ถอดกะ → ลบออกจาก User_shifts
      await conn.query("DELETE FROM User_shifts WHERE id = ?", [userId]);
    } else {
      const [exists] = await conn.query(
        "SELECT id FROM User_shifts WHERE id = ? LIMIT 1",
        [userId]
      );

      if (exists.length > 0) {
        await conn.query(
          "UPDATE User_shifts SET shift_id = ?, role_id = ? WHERE id = ?",
          [newShiftId, user.role_id, userId]
        );
      } else {
        await conn.query(
          "INSERT INTO User_shifts (id, shift_id, role_id) VALUES (?, ?, ?)",
          [userId, newShiftId, user.role_id]
        );
      }
    }

    await conn.commit();

    res.json({
      message: newShiftId === null ? "ยกเลิกกะเรียบร้อยแล้ว" : "อัปเดตกะแล้ว",
      shift_id: newShiftId,
    });
  } catch (err) {
    await conn.rollback();
    console.error("assignShift error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};