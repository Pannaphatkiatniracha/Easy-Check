import pool from '../config/db.js' // ท่อที่เชื่อมไป db

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