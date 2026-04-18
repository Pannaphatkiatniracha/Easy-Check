import pool from '../config/db.js'

// ---------- ดึงสถานที่ทั้งหมด (สำหรับหน้า Admin) ----------
export const getAllLocations = async (req, res) => {
  try {
    const { branch_id } = req.query

    let sql = `SELECT g.*, b.name AS branch_name
               FROM gps_locations g
               JOIN branch b ON g.branch_id = b.id`
    const params = []

    if (branch_id && branch_id !== 'undefined') {
      sql += ` WHERE g.branch_id = ?`
      params.push(branch_id)
    }

    sql += ` ORDER BY g.id`

    const [rows] = await pool.execute(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- ดึงสถานที่ที่เปิดใช้งาน กรองตาม branch_id (สำหรับ Check-in / Check-out) ----------
export const getActiveLocationsByBranch = async (req, res) => {
  try {
    const { branch_id } = req.query  // ✅ ใช้แค่ branch_id — ตัด role_id logic ที่ผิดออก

    if (!branch_id || branch_id === 'undefined') {
      return res.status(400).json({ message: 'กรุณาระบุ branch_id' })
    }

    // ✅ กรองตาม branch_id เสมอ ทุก role ต้องเช็คอินที่สาขาตัวเองเท่านั้น
    const [rows] = await pool.execute(
      `SELECT id, name, address, lat, lng, radius
       FROM gps_locations
       WHERE branch_id = ? AND active = 1`,
      [branch_id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบพิกัดสำหรับสาขานี้' })
    }

    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- เพิ่มสถานที่ใหม่ ----------
export const createLocation = async (req, res) => {
  try {
    const { name, address, lat, lng, radius, branch_id } = req.body

    if (!name || !lat || !lng || !radius || !branch_id) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })
    }

    const [result] = await pool.execute(
      `INSERT INTO gps_locations (name, address, lat, lng, radius, branch_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, address || null, lat, lng, radius, branch_id]
    )

    res.status(201).json({ message: 'เพิ่มสถานที่สำเร็จ', id: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- แก้ไขสถานที่ ----------
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params
    const { name, address, lat, lng, radius, branch_id } = req.body

    if (!name || !lat || !lng || !radius || !branch_id) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })
    }

    const [result] = await pool.execute(
      `UPDATE gps_locations
       SET name = ?, address = ?, lat = ?, lng = ?, radius = ?, branch_id = ?
       WHERE id = ?`,
      [name, address || null, lat, lng, radius, branch_id, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบสถานที่' })
    }

    res.json({ message: 'แก้ไขสถานที่สำเร็จ' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- ลบสถานที่ ----------
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.execute(
      'DELETE FROM gps_locations WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบสถานที่' })
    }

    res.json({ message: 'ลบสถานที่สำเร็จ' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- เปิด/ปิดสถานที่ (Toggle active) ----------
export const toggleLocation = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await pool.execute(
      'SELECT active FROM gps_locations WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบสถานที่' })
    }

    const newActive = rows[0].active === 1 ? 0 : 1

    await pool.execute(
      'UPDATE gps_locations SET active = ? WHERE id = ?',
      [newActive, id]
    )

    res.json({
      message: newActive === 1 ? 'เปิดใช้งานสำเร็จ' : 'ปิดใช้งานสำเร็จ',
      active: newActive
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- ดึงสาขาทั้งหมด (สำหรับ dropdown ใน SetGPS) ----------
export const getAllBranches = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name FROM branch ORDER BY id'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}