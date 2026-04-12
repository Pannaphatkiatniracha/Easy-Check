import pool from '../config/db.js'

// ---------- ดึงสถานที่ทั้งหมด (สำหรับหน้า Admin) ----------
export const getAllLocations = async (req, res) => {
  try {
    // ดึงข้อมูลจากตาราง gps_locations แล้ว JOIN กับตาราง branch
    // เพื่อให้ได้ชื่อสาขา (branch_name) ติดมาด้วย แทนที่จะได้แค่ branch_id
    const [rows] = await pool.execute(
      `SELECT g.*, b.name AS branch_name
       FROM gps_locations g
       JOIN branch b ON g.branch_id = b.id
       ORDER BY g.branch_id, g.id`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- ดึงสถานที่ที่เปิดใช้งาน ตามสาขา (สำหรับ Check-in) ----------
export const getActiveLocationsByBranch = async (req, res) => {
  try {
    // รับค่า branch_id จาก query string เช่น /gps-locations/active?branch_id=1
    const { branch_id } = req.query

    // ถ้าไม่ส่ง branch_id มา → ตอบกลับ error
    if (!branch_id) {
      return res.status(400).json({ message: 'กรุณาระบุ branch_id' })
    }

    // ดึงเฉพาะสถานที่ที่ active = 1 (เปิดใช้งาน) ของสาขานั้น
    // ส่งแค่ข้อมูลที่จำเป็นสำหรับ validate GPS (id, name, lat, lng, radius)
    const [rows] = await pool.execute(
      `SELECT id, name, address, lat, lng, radius
       FROM gps_locations
       WHERE branch_id = ? AND active = 1`,
      [branch_id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- เพิ่มสถานที่ใหม่ ----------
export const createLocation = async (req, res) => {
  try {
    // รับข้อมูลจาก request body ที่ Admin กรอกใน SetGPS
    const { name, address, lat, lng, radius, branch_id } = req.body

    // ตรวจสอบว่าข้อมูลจำเป็นครบหรือไม่ (address ไม่บังคับ)
    if (!name || !lat || !lng || !radius || !branch_id) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })
    }

    // บันทึกลง DB → active จะเป็น 1 (เปิด) อัตโนมัติตาม default ของตาราง
    const [result] = await pool.execute(
      `INSERT INTO gps_locations (name, address, lat, lng, radius, branch_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, address || null, lat, lng, radius, branch_id]
    )

    // ส่ง id ของแถวที่เพิ่งสร้างกลับไปให้ frontend
    res.status(201).json({
      message: 'เพิ่มสถานที่สำเร็จ',
      id: result.insertId
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- แก้ไขสถานที่ ----------
export const updateLocation = async (req, res) => {
  try {
    // รับ id ของสถานที่ที่จะแก้จาก URL เช่น PUT /gps-locations/3
    const { id } = req.params
    const { name, address, lat, lng, radius, branch_id } = req.body

    // ตรวจสอบข้อมูลจำเป็น
    if (!name || !lat || !lng || !radius || !branch_id) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })
    }

    // อัปเดตแถวที่มี id ตรงกัน
    const [result] = await pool.execute(
      `UPDATE gps_locations
       SET name = ?, address = ?, lat = ?, lng = ?, radius = ?, branch_id = ?
       WHERE id = ?`,
      [name, address || null, lat, lng, radius, branch_id, id]
    )

    // affectedRows = 0 หมายความว่าไม่มีแถวที่ id ตรงกัน → ไม่พบสถานที่
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
    // รับ id จาก URL เช่น DELETE /gps-locations/3
    const { id } = req.params

    const [result] = await pool.execute(
      'DELETE FROM gps_locations WHERE id = ?',
      [id]
    )

    // ถ้าไม่มีแถวที่ถูกลบ → แสดงว่าไม่พบ id นั้น
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

    // ดึงค่า active ปัจจุบันของสถานที่นั้นก่อน
    const [rows] = await pool.execute(
      'SELECT active FROM gps_locations WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบสถานที่' })
    }

    // สลับค่า: ถ้าปัจจุบัน active=1 (เปิด) → เปลี่ยนเป็น 0 (ปิด) และกลับกัน
    const newActive = rows[0].active === 1 ? 0 : 1

    await pool.execute(
      'UPDATE gps_locations SET active = ? WHERE id = ?',
      [newActive, id]
    )

    res.json({
      message: newActive === 1 ? 'เปิดใช้งานสำเร็จ' : 'ปิดใช้งานสำเร็จ',
      active: newActive  // ส่งค่า active ใหม่กลับไปให้ frontend อัปเดต UI ได้ทันที
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ---------- ดึงสาขาทั้งหมด (สำหรับ dropdown ใน SetGPS) ----------
export const getAllBranches = async (req, res) => {
  try {
    // ดึงแค่ id กับ name เพื่อใช้สร้าง dropdown เลือกสาขาใน SetGPS
    const [rows] = await pool.execute(
      'SELECT id, name FROM branch ORDER BY id'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
