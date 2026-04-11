import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '../config/db.js'
import nodemailer from 'nodemailer'

dotenv.config()


// 🐻🐻 LOGIN
export const login = async (req, res) => {
    const { id_employee, password } = req.body
    const JWT_SECRET = process.env.JWT_SECRET

    console.log("-------------------------------")
    console.log("1. Backend ได้รับข้อมูล:", { id_employee, password })

    try {
        if (!id_employee || !password) {
            return res.status(400).json({ message: 'กรุณากรอก Employee ID และ Password' })
        }

        const [users] = await db.query(
            `SELECT Users.*, Roles.role
             FROM Users
             JOIN Roles ON Users.role_id = Roles.role_id
             WHERE Users.id_employee = ?`,
            [id_employee]
        )

        if (users.length === 0) {
            console.log("❌ 2. หา ID นี้ไม่เจอใน Database:", id_employee)
            return res.status(404).json({ message: 'Login failed' })
        }

        const user = users[0]
        console.log("3. เจอ User ใน DB ชื่อ:", `${user.firstname}${user.lastname}`)
        console.log("4. hash password คือ:", user.password)

        const isMatch = await bcrypt.compare(password, user.password)
        console.log("5. ผลการเทียบรหัส (isMatch):", isMatch)

        if (!isMatch) {
            console.log("❌ 6. รหัสผ่านไม่ตรงกันจ้า!")
            return res.status(401).json({ message: 'Login failed' })
        }

        const token = jwt.sign(
            { id: user.id, id_employee: user.id_employee, role: user.role },
            JWT_SECRET,
            { expiresIn: '30m' }
        )

        const refreshToken = jwt.sign(
            { id: user.id, id_employee: user.id_employee },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        console.log("✅ 7. Login สำเร็จ! กำลังส่ง Token กลับไป...")

        return res.status(200).json({
            message: 'Login successful',
            token,
            refreshToken,
            role: user.role,

            // สำคัญมาก: frontend จะอ่าน response.data.user
            user: {
                id: user.id,
                id_employee: user.id_employee,
                firstname: user.firstname,
                lastname: user.lastname,
                role_id: user.role_id,
                email: user.email,
                department: user.department,
                position: user.position,
                avatar: user.avatar,
                shift_id: user.shift_id,
                branch_id: user.branch_id
            }
        })

    } catch (error) {
        console.error("🔥 เกิด Error:", error)
        return res.status(500).json({ message: 'Internal server error นางงอแง' })
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
        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email])
        if (users.length === 0) {
            return res.status(404).json({ message: 'Email not found' })
        }

        const userId = users[0].id

        const resetToken = jwt.sign(
            { id: userId, action: 'reset_password' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )

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

        await transporter.sendMail(mailOptions)

        return res.status(200).json({
            message: 'Reset token sent successfully to your email',
            resetToken
        })
    } catch (err) {
        return res.status(500).json({ message: 'Server Error', error: err.message })
    }
}


// 🐻🐻 RESET PASSWORD
export const resetPassword = async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id])

        return res.status(200).json({ message: 'Password reset successful' })
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token', error: err.message })
    }
}


// 🐻🐻 REFRESH TOKEN
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(401).json({ message: "Missing refresh token" })
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)

        const [users] = await db.query(
            `SELECT Users.*, Roles.role 
             FROM Users 
             JOIN Roles ON Users.role_id = Roles.role_id 
             WHERE Users.id = ?`,
            [decoded.id]
        )

        const user = users[0]

        if (!user) {
            return res.status(403).json({ message: "User not found" })
        }

        const newAccessToken = jwt.sign(
            { id: user.id, id_employee: user.id_employee, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        )

        const newRefreshToken = jwt.sign(
            { id: user.id, id_employee: user.id_employee },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                id_employee: user.id_employee,
                firstname: user.firstname,
                lastname: user.lastname,
                role_id: user.role_id,
                email: user.email,
                department: user.department,
                position: user.position,
                avatar: user.avatar,
                shift_id: user.shift_id,
                branch_id: user.branch_id
            }
        })

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" })
    }
}