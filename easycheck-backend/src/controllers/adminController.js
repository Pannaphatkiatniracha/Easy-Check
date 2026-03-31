import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//admin login
export const loginAdmin = async (req, res) => {
    try {
        console.log("BODY:", req.body)
        const { id_employee, password } = req.body

        // หา admin ใน db
        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE id_employee = ? AND position IN ('admin','superadmin')",
            [id_employee]
        )

        if (rows.length === 0) {
            return res.status(401).json({ message: "Admin not found" })
        }

        const admin = rows[0]

        // เช็ค password
        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Password incorrect" })
        }

        // สร้าง token (เปลี่ยน role -> position)
        const token = jwt.sign(
            { id: admin.id, position: admin.position },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            success: true,
            token,
            user: {
                id: admin.id,
                full_name: admin.full_name,
                position: admin.position
            }
        })

    } catch (err) {
        console.error("Admin Login Error:", err)
        res.status(500).json({ message: "Server Error" })
    }
}



//เช็คว่า admin login อยู่รึ
export const getAdmin = async (req, res) => {

    try {

        const adminId = req.user.id

        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE id = ?",
            [adminId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" })
        }

        res.json(rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }

}



// forgot password
export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body

        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE email = ? AND position IN ('admin','superadmin')",
            [email]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" })
        }

        res.json({
            success: true,
            message: "Reset password feature coming soon"
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }

}