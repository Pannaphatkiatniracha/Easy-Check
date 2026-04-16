
import pool from '../config/db.js'

// ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด (กรองเฉพาะสาขาของ admin ที่ login)
export const getAllEmployees = async (req, res) => {
  try {
    const branch_id = req.user.branch_id
    if (!branch_id) return res.status(400).json({ success: false, message: 'Admin token missing branch_id' })

    const [rows] = await pool.query(
      `SELECT u.id, u.id_employee, u.firstname, u.lastname, u.email, u.phone,
       u.position, u.department, b.name AS branch, u.joindate, u.avatar
       FROM Users u
       LEFT JOIN branch b ON u.branch_id = b.id
       WHERE u.role_id IN (1, 2)
       AND u.branch_id = ?`,
      [branch_id]
    )

    res.json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ฟังก์ชันสำหรับแก้ไขข้อมูลพนักงาน
export const updateEmployee = async (req, res) => {
  const { id } = req.params
  const { phone, email, position, department } = req.body
  try {
    await pool.query(
      `UPDATE Users SET phone = ?, email = ?, position = ?, department = ? WHERE id = ?`,
      [phone, email, position, department, id]
    )
    res.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ฟังก์ชันสำหรับลบพนักงาน
export const deleteEmployee = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(`DELETE FROM Users WHERE id = ?`, [id])
    res.json({ success: true, message: 'ลบพนักงานสำเร็จ' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
