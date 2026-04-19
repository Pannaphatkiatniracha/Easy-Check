import pool from '../config/db.js'


//ส่งการแจ้งเตือน
export const getDepartments = async (req, res) => {
    try {
        const adminBranch = req.user.branch_id

        let query = `SELECT DISTINCT department FROM Users WHERE department IS NOT NULL`
        let params = []

        // ถ้าไม่ใช่ superadmin → กรองตามสาขา
        if (adminBranch) {
            query += ` AND branch_id = ?`
            params.push(adminBranch)
        }

        query += ` ORDER BY department`

        const [rows] = await pool.execute(query, params)
        res.json(rows.map(row => ({ id: row.department, name: row.department })))
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
}

export const getEmployees = async (req, res) => {
    const { department } = req.query
    const adminBranch = req.user.branch_id

    try {
        let query = `SELECT id, id_employee, firstname, lastname, position, department, avatar FROM Users WHERE role_id IN (1, 2)`
        let params = []

        // กรองตามสาขาของ admin
        if (adminBranch) {
            query += ` AND branch_id = ?`
            params.push(adminBranch)
        }

        // กรองตามแผนก (ถ้าเลือก)
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
    let targetUsers = employees || []

    if (departments && departments.length > 0) {
      let query = `SELECT id FROM Users WHERE role_id IN (1, 2)`
      let params = [...departments]
      query += ` AND department IN (${departments.map(() => '?').join(',')})`

      const adminBranch = req.user.branch_id
      if (adminBranch) {
        query += ` AND branch_id = ?`
        params.push(adminBranch)
      }

      const [rows] = await pool.execute(query, params)
      targetUsers = rows.map(row => row.id)
    }

    if (targetUsers.length === 0) {
      return res.status(400).json({ message: "No employees found" })
    }

    for (const userId of targetUsers) {
      await pool.execute(
        `INSERT INTO notifications (id_employee, type, title, message, is_read) VALUES (?, 'default', 'แจ้งเตือนจากผู้ดูแล', ?, 0)`,
        [userId, message]
      )
      await pool.execute(
        `INSERT INTO group_notifications (id_employee, type, title, message, is_read) VALUES (?, 'default', 'แจ้งเตือนจากผู้ดูแล', ?, 0)`,
        [userId, message]
      )
    }

    res.json({ success: true, message: 'Notification sent successfully' })
  } catch (err) {
    console.error('ERROR:', err)
    res.status(500).json({ message: "Server Error" })
  }
}

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id  // แก้จาก id_employee → id (int) ใช้ตามuser
    const [rows] = await pool.execute(
      `SELECT * FROM group_notifications WHERE id_employee = ? ORDER BY created_at DESC`,  // แก้จาก sent_at → created_at ใช้ตาม user
      [userId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" })
  }
}