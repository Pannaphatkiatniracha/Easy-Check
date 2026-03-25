
import pool from '../config/db.js'

// ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด (ส่งออกไปให้ Router นำไปใช้งานต่อ)
export const getAllEmployees = async (req, res) => {
  try {
    // รันคำสั่ง SQL เพื่อดึงข้อมูลจากตาราง users 
    // หมายเหตุ: มีการเลือกเฉพาะฟิลด์ที่จำเป็น และจงใจไม่ดึงฟิลด์ `password` มาด้วยเพื่อความปลอดภัย
    const [rows] = await pool.query(
      `SELECT id, employee_id, full_name, email, phone, position, department, branch, join_date, avatar
       FROM users`
    )
    // หาก Query สำเร็จ จะส่งข้อมูลกลับไปให้ Frontend ในรูปแบบ JSON โดยแนบข้อมูลพนักงานไปกับคีย์ data
    res.json({ success: true, data: rows })
  } catch (err) {
    // หากระบบฐานข้อมูลมีปัญหา หรือเกิด Error ใดๆ ให้ตอบกลับด้วย Status 500 (Internal Server Error)
    res.status(500).json({ success: false, message: err.message })
  }
}
