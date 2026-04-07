import pool from '../config/db.js'


//ส่งการแจ้งเตือน
export const getDepartments = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT DISTINCT department FROM Users WHERE department IS NOT NULL ORDER BY department`
        )
        res.json(rows.map(row => ({ name: row.department })))
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}

export const getEmployees = async (req, res) => {
    const { department } = req.query
    try {
        let query = `SELECT id, id_employee, firstname, lastname, position, department, avatar FROM Users WHERE role_id = 1`
        let params = []
        if (department) {
            query += ` AND department = ?`
            params.push(department)
        }
        const [rows] = await pool.execute(query, params)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}

export const sendNotification = async (req, res) => {
    const { departments, employees, message } = req.body
    try {
        // mock logic
        console.log('Sending notification:', { departments, employees, message })
        res.json({ success: true, message: 'Notification sent successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}