
import pool from '../config/db.js'

// ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด (กรองเฉพาะสาขาของ admin ที่ login)
export const getAllEmployees = async (req, res) => {
  try {
    const userId = req.user.id

    // ดึง branch_id ของ admin ที่ login
    const [[currentUser]] = await pool.query(
      `SELECT branch_id FROM Users WHERE id = ?`,
      [userId]
    )

    // กรองพนักงานเฉพาะสาขาเดียวกันกับ admin เสมอ
    const [rows] = await pool.query(
      `SELECT u.id, u.id_employee, u.firstname, u.lastname, u.email, u.phone,
       u.position, u.department, b.name AS branch, u.joindate, u.avatar
       FROM Users u
       LEFT JOIN branch b ON u.branch_id = b.id
       WHERE u.branch_id = ?`,
      [currentUser.branch_id]
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
