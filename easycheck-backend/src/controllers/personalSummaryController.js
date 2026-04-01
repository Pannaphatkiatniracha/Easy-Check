
import pool from '../config/db.js'

// ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด 
export const getAllEmployees = async (req, res) => {
  try {
    // รันคำสั่ง SQL เพื่อดึงข้อมูลจากตาราง users 
    const [rows] = await pool.query(
      `SELECT id, id_employee, firstname, lastname, email, phone, position, department, branch, joindate, avatar
       FROM Users`
    )
    // หาก Query สำเร็จ จะส่งข้อมูลกลับไปให้ Frontend ในรูปแบบ JSON โดยแนบข้อมูลพนักงานไปกับคีย์ data
    res.json({ success: true, data: rows })
  } catch (err) {
    
    res.status(500).json({ success: false, message: err.message })
  }
}
