import db from '../config/db.js' // ท่อที่เชื่อมไป db
import bcrypt from 'bcrypt'


// 🐰🐰 ดึงข้อมูลออกมาโชว์
export const getProfile = async (req, res) => {
    try {
        // ดึงข้อมูล id จาก req.user (หน้า authMiddleware)
        const userId = req.user.id

        // ดึง db
        const [rows] = await db.execute(
            `SELECT Users.*, Roles.role, branch.name, 
                    Shifts.start_time, Shifts.end_time
            FROM Users 
            JOIN Roles ON Users.role_id = Roles.role_id 
            LEFT JOIN branch ON Users.branch_id = branch.id
            LEFT JOIN Shifts ON Users.shift_id = Shifts.shift_id
            WHERE Users.id = ?`, 
            [userId] // userId ก็คือ '?'
        )

        // ตรง [rows] อะคือดึงมาเป็น array ดังนั้นถ้า === 0 ก็คือไม่เจอข้อมูลในตาราง
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        // กรณีเจอ
        res.json(rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}


// 🐰🐰 แก้ไขข้อมูล
export const updateProfile = async (req, res) => {
    try {
        // // ดึงข้อมูล id จาก req.user (หน้า authMiddleware)
        const userId = req.user.id

        // รับข้อมูลจากฟ้อนเอนที่ axios.put มา (bodyData)
        const { firstname, lastname, phone, email, gender, branch_id, shift_id } = req.body

        // เขียนคำสั่ง sql ให้ไปอัพเดตค่าที่ db
        const sql = `
            UPDATE users 
            SET firstname = ?, lastname = ?, phone = ?, email = ?, gender = ?, branch_id = ?, shift_id = ?
            WHERE id = ?
        `
        
        // ตรงนี้คือสั่งรันคำสั่ง sql ด้วย db.execute
        const [result] = await db.execute(sql, [
            firstname, // '?' จับคู่เรียงกันตามข้อมูล
            lastname,
            phone, 
            email, 
            gender, 
            branch_id,
            shift_id,
            userId
        ])

        // ตามระบบ db ถ้า affectedRows เป็น 0 แปลว่า ไม่มีข้อมูลแถวไหนเปลี่ยนเลย/ไม่มีการแก้ไข หรือ หา id ไม่เจอ
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({ 
            success: true, 
            message: "Profile updated successfully" 
        })

    } catch (err) {
        console.error('Update Profile Error:', err)
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: err.message 
        })
    }
}

// 🐰🐰 เปลี่ยน password
export const changePassword = async (req, res) => {
    try {
        // ดึงข้อมูล id จาก req.user (หน้า authMiddleware)
        const userId = req.user.id
        const { currentPassword, newPassword } = req.body // รับรหัส current,new

        // ไปเอา hashpass ของ id คนนี้มา
        const [users] = await db.execute('SELECT password FROM users WHERE id = ?'
            , [userId])
        

        // กรณีหา user ไม่เจอ
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        const user = users[0] // ดึงหยิบคนนี้


        // เช็คว่ารหัสผ่านปัจจุบันตรงกับใน db มั้ย
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" })
        }

        // hash รหัสผ่านใหม่
        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword, salt) // รหัสผ่านใหม่ที่ hash แล้ว

        // อัพเดตข้อมูลลง db
        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedNewPassword, userId]
        )


        // result.affectedRows === 0 คือเช็คว่ามีการแก้ไขข้อมูลจริงๆ ไหม 
        // ถ้าเป็น 0 แปลว่าอัพเดตล้มเหลว
        if (result.affectedRows === 0) {
            return res.status(500).json({ message: "Failed to update password" })
        }

        res.json({ 
            success: true, 
            message: "Password changed successfully" 
        })

    } catch (err) {
        console.error('Change Password Error:', err)
        res.status(500).json({ message: "Internal Server Error", error: err.message })
    }
}

// 🐰🐰 เปลี่ยน avatar
export const uploadAvatar = async (req, res) => {
    try {
        // เช็คว่ามีไฟล์มาถึงเรามั้ย ตรงนี้ปกติเป็น req.body แต่ด้วยความเป็นรูป multer นางเลยใช้เป็น req.file
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        // ดึง id มาเพราะเราจะได้รู้ว่าจะไปเปลี่ยนรูปให้ user คนไหน
        const userId = req.user.id // ตรงนี้เอามาจาก vertifyToken
        
        // multer มันจะตั้งชื่อไฟล์รูปภาพให้เราใหม่โดยอัตโนมัติเพราะกันมัน replace กันก็ต้องเอามาเตรียมไว้ด้วย
        const fileName = req.file.filename

        // อัพเดตชื่อไฟล์ลง db คือเราเก็บแค่ชื่อไฟล์ แล้วอาไปต่อเป็น URL ในหน้าบ้าน
        const sql = "UPDATE users SET avatar = ? WHERE id = ?"
        await db.query(sql, [fileName, userId]) // await db.query(...) เป็นคำสั่งให้มันไปทำงานใน mysql จริง ๆ

        res.status(200).json({
            message: "Avatar updated successfully",
            avatar: fileName // ส่งชื่อไฟล์กลับไปให้ฟ้อนเอน
        })

    } catch (error) {
        console.error("Upload Error:", error)
        res.status(500).json({ message: "Server error during upload" })
    }
}

// 🐰🐰 ดึงข้อมูลมาโชว์ (ทุกคน)
export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT Users.*, Roles.role, branch.name,
                    Shifts.start_time, Shifts.end_time
            FROM Users 
            JOIN Roles ON Users.role_id = Roles.role_id
            LEFT JOIN branch ON Users.branch_id = branch.id
            LEFT JOIN Shifts ON Users.shift_id = Shifts.shift_id`
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "No users found" })
        }

        res.json(rows)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}