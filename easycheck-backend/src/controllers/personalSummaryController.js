
import pool from '../config/db.js'

// ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด
export const getAllEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, id_employee, firstname, lastname, email, phone, position, department, branch, joindate, avatar
       FROM Users`
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
