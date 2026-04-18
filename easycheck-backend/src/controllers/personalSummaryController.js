
import pool from '../config/db.js'

// ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด (กรองเฉพาะสาขาของ admin ที่ login)
export const getAllEmployees = async (req, res) => {
  try {
    const branch_id = req.user.branch_id
    if (!branch_id) return res.status(400).json({ success: false, message: 'Admin token missing branch_id' })

    const [rows] = await pool.query(
      `SELECT u.id, u.id_employee, u.firstname, u.lastname, u.email, u.phone,
       u.position, u.department, b.name AS branch, u.joindate, u.avatar
       FROM Users u
       LEFT JOIN branch b ON u.branch_id = b.id
       WHERE u.role_id IN (1, 2)
       AND u.branch_id = ?`,
      [branch_id]
    )

    res.json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ฟังก์ชันสำหรับแก้ไขข้อมูลพนักงาน
export const updateEmployee = async (req, res) => {
  const { id } = req.params
  const { phone, email, position, department } = req.body
  try {
    await pool.query(
      `UPDATE Users SET phone = ?, email = ?, position = ?, department = ? WHERE id = ?`,
      [phone, email, position, department, id]
    )
    res.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ฟังก์ชันสำหรับลบพนักงาน
export const deleteEmployee = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(`DELETE FROM Users WHERE id = ?`, [id])
    res.json({ success: true, message: 'ลบพนักงานสำเร็จ' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// ดึงสถิติการทำงานรายเดือนและโควตาวันลาของพนักงานคนนั้น
export const getEmployeeStats = async (req, res) => {
  try {
    const { id } = req.params

    // หา id_employee จาก numeric id
    const [[user]] = await pool.query('SELECT id_employee FROM Users WHERE id = ?', [id])
    if (!user) return res.status(404).json({ success: false, message: 'ไม่พบพนักงาน' })
    const id_employee = user.id_employee

    // 1. สถิติการเข้างานเดือนนี้
    const [[att]] = await pool.query(
      `SELECT
         COUNT(*) AS present,
         SUM(CASE WHEN check_in_status = 'late' THEN 1 ELSE 0 END) AS late
       FROM attendance
       WHERE id_employee = ?
         AND MONTH(work_date) = MONTH(CURDATE())
         AND YEAR(work_date)  = YEAR(CURDATE())`,
      [id_employee]
    )

    // 2. วันลาที่อนุมัติแล้วเดือนนี้ (ใช้คำนวณวันขาด)
    const [[leaveMonth]] = await pool.query(
      `SELECT COALESCE(SUM(leave_days), 0) AS total
       FROM leave_requests
       WHERE id_employee = ?
         AND status = 'approved'
         AND MONTH(leave_start) = MONTH(CURDATE())
         AND YEAR(leave_start)  = YEAR(CURDATE())`,
      [id_employee]
    )

    // นับวันทำการ (จันทร์-ศุกร์) ตั้งแต่ต้นเดือนถึงวันนี้
    const today = new Date()
    const cur = new Date(today.getFullYear(), today.getMonth(), 1)
    let workingDays = 0
    while (cur <= today) {
      const d = cur.getDay()
      if (d !== 0 && d !== 6) workingDays++
      cur.setDate(cur.getDate() + 1)
    }

    const present = Number(att.present || 0)
    const late    = Number(att.late || 0)
    const leaveDays = Number(leaveMonth.total || 0)
    const absent  = Math.max(0, workingDays - present - leaveDays)
    const attendanceRate = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0

    // 3. โควตาการลาจาก leave_policy
    const [policies] = await pool.query(
      'SELECT leave_code, max_days_per_year FROM leave_policy WHERE active = 1'
    )
    const policyMap = {}
    policies.forEach(p => { policyMap[p.leave_code] = p.max_days_per_year })

    // 4. วันลาที่ใช้ไปแล้วปีนี้ แยกตามประเภท
    const [leaveRows] = await pool.query(
      `SELECT leave_reasons, leave_days
       FROM leave_requests
       WHERE id_employee = ?
         AND status IN ('pending', 'approved')
         AND YEAR(leave_start) = YEAR(CURDATE())`,
      [id_employee]
    )
    const usedMap = {}
    leaveRows.forEach(row => {
      let reasons = row.leave_reasons
      if (typeof reasons === 'string') {
        try { reasons = JSON.parse(reasons) } catch { reasons = [] }
      }
      if (!Array.isArray(reasons)) reasons = []
      reasons.forEach(r => { usedMap[r] = (usedMap[r] || 0) + Number(row.leave_days || 0) })
    })

    const leaveBalance = {
      sick:      Math.max(0, (policyMap['SICK']       || 0) - (usedMap['Sick Leave']       || 0)),
      personal:  Math.max(0, (policyMap['PERSONAL']  || 0) - (usedMap['Personal Leave']  || 0)),
      vacation:  Math.max(0, (policyMap['VACATION']   || 0) - (usedMap['Vacation Leave']   || 0)),
      maternity: Math.max(0, (policyMap['MATERNITY']  || 0) - (usedMap['Maternity Leave']  || 0)),
      wedding:   Math.max(0, (policyMap['WEDDING']    || 0) - (usedMap['Wedding Leave']    || 0)),
      religious: Math.max(0, (policyMap['RELIGIOUS']  || 0) - (usedMap['Religious Leave']  || 0)),
      other:     Math.max(0, (policyMap['OTHER']      || 0) - (usedMap['Other']            || 0)),
    }

    res.json({
      success: true,
      data: { workStats: { present, late, absent }, attendanceRate, leaveBalance }
    })

  } catch (err) {
    console.error('getEmployeeStats error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}
