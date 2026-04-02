import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '../config/db.js'
import pool from '../config/db.js'
import nodemailer from 'nodemailer'

dotenv.config() // พอสั่ง config() ปุ๊บ ทุกอย่างที่เขียนในไฟล์ .env จะถูกเก็บใส่ process.env


// 🐻🐻 LOGIN
export const login = async (req, res) => {
    const { id_employee, password } = req.body // req.body คือสิ่งที่ฟ้อนเอนส่งมาให้
    const JWT_SECRET = process.env.JWT_SECRET // ดึง JWT_SECRET ใน .env มา
    
    console.log("-------------------------------")
    console.log("1. Backend ได้รับข้อมูล:", { id_employee, password })

    try {
        // ไปดึงข้อมูลใน user และ join ตาราง roles เพื่อดึง level มาแสดง
        const [users] = await db.query(
            `SELECT Users.*, Roles.role
            FROM Users 
            JOIN Roles ON Users.role_id = Roles.role_id 
            WHERE Users.id_employee = ?`, 
            [id_employee]
        )

        if (users.length === 0) {
            console.log("❌ 2. หา ID นี้ไม่เจอใน Database:", id_employee)
            return res.status(404).json({ message: 'Login failed' }) // แก้ให้เป็น Login failed ทั้งคู่ตาม logic ที่เหมาะสม
        }
        
        // result
        const user = users[0]
        console.log("3. เจอ User ใน DB ชื่อ:", user.firstname + user.lastname)
        console.log("4. hash password คือ:", user.password)

        
        // ใช้ bcrypt.compare เพื่อเช็คว่ารหัสที่ส่งมา ตรงกับรหัสที่บดไว้ใน DB ไหม
        const isMatch = await bcrypt.compare(password, user.password)
        console.log("5. ผลการเทียบรหัส (isMatch):", isMatch)


        if (!isMatch) {
            console.log("❌ 6. รหัสผ่านไม่ตรงกันจ้า!");
            return res.status(401).json({ message: 'Login failed' }) // แก้ให้เป็น Login failed ทั้งคู่ตาม logic ที่เหมาะสม
        }

        // สร้าง Token ให้พนักงาน
        const token = jwt.sign (
            {id: user.id, id_employee: user.id_employee, role: user.role},
            JWT_SECRET, {expiresIn: '30m'})


        // สร้าง Refresh Token (ตั๋วใบยาว)
        const refreshToken = jwt.sign(
            { id: user.id, id_employee: user.id_employee },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        console.log("✅ 7. Login สำเร็จ! กำลังส่ง Token กลับไป...")
        res.status(200).json({
            message: 'Login successful',
            token: token,
            refreshToken: refreshToken,
            role: user.role,
            id_employee: user.id_employee,
            firstname: user.firstname,
            lastname: user.lastname
        })

    } catch (error) {
        console.error("🔥 เกิด Error:", error)
        res.status(500).json({ message: 'Internal server error นางงอแง' })
    }
}


// 🐻🐻 LOGOUT
export const logout = (req, res) => {
    console.log(`${req.user.firstname} is logging out...`)
    
    res.status(200).json({ message: 'Logout successful' })
}


// 🐻🐻 FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    
    const { email } = req.body

    try {
        // เช็คว่ามี email นี้จริงไหม
        const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email])
        if (users.length === 0) {
            return res.status(404).json({ message: 'Email not found' })
        }

        const userId = users[0].id // เอาข้อมูลทุกอย่างใน db ของ id นี้ออกมา

        // สร้าง token ให้พนักงาน แต่เพราะว่ามันเป็นเรื่อง password ความปลอดภัยเลยให้อายุของนางแค่ 15 นาที
        const resetToken = jwt.sign(
            { id: userId, action: 'reset_password' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        )


        // คำสั่งยิงไปเมล
        // nodemailer.createTransport คือการตั้งค่าชุดคำสั่งให้ส่งไปทาง email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, 
            subject: 'Reset Your Password - Easy Check',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    
                    <h2 style="color: #4A90E2;">Reset Your Password</h2>
                        
                        <p>You requested to reset your password for <b>Easy Check</b>.</p>
                        <p>Click the button below to proceed. This link will expire in 15 minutes.</p>
                        
                        <a href="http://localhost:5173/easycheck/resetpassword/${resetToken}" 
                        style="display: inline-block; background-color: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Password
                        </a>

                        <p style="margin-top: 20px; font-size: 12px; color: #888;">
                            If you didn't request this, please ignore this email.
                        </p>
                </div>
            `
        }

        // ยิงลิ้ง reset password ไปที่อีเมล
        await transporter.sendMail(mailOptions)


        res.status(200).json({
            message: 'Reset token sent successfully to your email',
            resetToken: resetToken // เอาไปใช้ต่อใน reset password
        })
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
}


// 🐻🐻 RESET PASSWORD
export const resetPassword = async (req, res) => {

    // ดึงข้อมูลมา
    const { token } = req.params // ดึงจาก URL ex. /resetpassword/abc123... ตาม path ฟ้อนเอน
    const { newPassword } = req.body

    try {
        // เช็คว่า token ที่ได้มาของจริงมั้ย ก็คือเอาไปเทียบกับ JWT_SECRET เพราะ token มีสารตั้งต้นเป็น JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // เอารหัสใหม่มาเข้ารหัส
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // อัพเดตรหัสผ่านใหม่ลง db (ซึ่ง decoded.id ก็จะทำให้เปลี่ยนรหัสถูกคน)
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id])

        res.status(200).json({ message: 'Password reset successful' })

    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token', error: err.message })
    }
}

// 🐻🐻 REFRESH TOKEN
export const refreshToken = async (req, res) => {
    // รับ refreshToken จากฟ้อนเอนมา
    const { refreshToken } = req.body

    // check ว่ามีการส่ง token มามั้ย
    if (!refreshToken) {
        return res.status(401).json({ message: "Missing refresh token" })
    }

    try {
        // มา check (verify) ว่า token นี้หมดอายุรึยังแล้วเอาไปเทียบกับ JWT_SECRET เพราะ token มีสารตั้งต้นเป็น JWT_SECRET ว่าถูกต้องไหม
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)

        
        // ก็คือให้ไปหาที่ db ไปเอา id ของพนักงานคนนั้นมาเก็บไว้ใน 'user'
        const [users] = await db.query(
            `SELECT Users.*, Roles.role 
            FROM Users 
            JOIN Roles ON Users.role_id = Roles.role_id 
            WHERE Users.id = ?`, 
            [decoded.id] // join ตารางเพื่อเอาชื่อ role มาใส่ใน token ใหม่
        )
        const user = users[0]
        
        if (!user) {
            return res.status(403).json({ message: "User not found" })
        }

        // สร้าง token ใหม่ (ระยะสั้น)
        const newAccessToken = jwt.sign( // jwt.sign(...) คือคำสั่งให้ JWT สร้างสตริงยาว ๆ มาชุดนึง โดยเอาข้อมูลที่เราส่งไปมาเข้ารหัสและประทับตราด้วย JWT_SECRET
            { id: user.id, id_employee: user.id_employee, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        )

        // สร้าง token ต่ออายุ (ระยะยาว)
        const newRefreshToken = jwt.sign(
            { id: user.id, id_employee: user.id_employee },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        // เอา token ใหม่ส่งกลับไปฟ้อนเอนในนาม accessToken
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        // ถ้า token พังหรือหมดอายุจริง ๆ ก็ให้นางไป login ใหม่
        return res.status(403).json({ message: "Invalid or expired refresh token" })
    }
}