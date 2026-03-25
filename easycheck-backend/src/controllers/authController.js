import db from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config() // พอสั่ง config() ปุ๊บ ทุกอย่างที่เขียนในไฟล์ .env จะถูกเก็บใส่ process.env


// 🐻🐻 LOGIN
export const login = async (req, res) => {
    const { employee_id, password } = req.body // req.body คือสิ่งที่ฟ้อนเอนส่งมาให้
    const JWT_SECRET = process.env.JWT_SECRET // ดึง JWT_SECRET ใน .env มา
    
    console.log("-------------------------------")
    console.log("1. Backend ได้รับข้อมูล:", { employee_id, password })

    try {
        const [users] = await db.query('SELECT * FROM users WHERE employee_id = ?', [employee_id])

        if (users.length === 0) {
            console.log("❌ 2. หา ID นี้ไม่เจอใน Database:", employee_id)
            return res.status(404).json({ message: 'Employee ID not found' })
        }
        
        // result
        const user = users[0]
        console.log("3. เจอ User ใน DB ชื่อ:", user.full_name)
        console.log("4. hash password คือ:", user.password)

        
        // ใช้ bcrypt.compare เพื่อเช็คว่ารหัสที่ส่งมา ตรงกับรหัสที่บดไว้ใน DB ไหม
        const isMatch = await bcrypt.compare(password, user.password)
        console.log("5. ผลการเทียบรหัส (isMatch):", isMatch)


        if (!isMatch) {
            console.log("❌ 6. รหัสผ่านไม่ตรงกันจ้า!");
            return res.status(401).json({ message: 'Incorrect password' })
        }

        // สร้าง Token ให้พนักงาน
        const token = jwt.sign (
            {id: user.id, role: user.role,full_name: user.full_name},
            JWT_SECRET, {expiresIn: '30m'})

        console.log("✅ 7. Login สำเร็จ! กำลังส่ง Token กลับไป...")
        res.status(200).json({
            message: 'Login successful',
            token: token,
            role: user.role,
            full_name: user.full_name
        })

    } catch (error) {
        console.error("🔥 เกิด Error:", error)
        res.status(500).json({ message: 'Internal server error นางงอแง' })
    }
}


// 🐻🐻 LOGOUT
export const logout = (req, res) => {
    console.log(`${req.user.full_name} is logging out...`)
    
    res.status(200).json({ message: 'Logout successful' })
}