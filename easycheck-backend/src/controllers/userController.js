import pool from '../config/db.js' // ท่อที่เชื่อมไป db


// 🐰🐰 ดึงข้อมูลออกมาโชว์
export const getProfile = async (req, res) => {
    try {
        // ดึงข้อมูล id จาก req.user (หน้า authMiddleware)
        const userId = req.user.id

        // ดึง db
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?', 
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
        const { full_name, phone, email, gender, branch } = req.body

        // เขียนคำสั่ง sql ให้ไปอัพเดตค่าที่ db
        const sql = `
            UPDATE users 
            SET full_name = ?, phone = ?, email = ?, gender = ?, branch = ? 
            WHERE id = ?
        `
        
        // ตรงนี้คือสั่งรันคำสั่ง sql ด้วย pool.execute
        const [result] = await pool.execute(sql, [
            full_name, // '?' จับคู่เรียงกันตามข้อมูล
            phone, 
            email, 
            gender, 
            branch,
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