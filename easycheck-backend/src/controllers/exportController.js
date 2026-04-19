import pool from '../config/db.js'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'

// ── Helper: ดึงข้อมูล attendance ตาม date + department ──
const fetchAttendanceData = async (date, department, branchId) => {
  let query = `
    SELECT 
      u.id_employee,
      u.firstname,
      u.lastname,
      u.department,
      u.position,
      a.work_date,
      a.check_in_time,
      a.check_out_time,
      a.check_in_status,
      a.check_out_status,
      a.approval_status
    FROM Users u
    LEFT JOIN attendance a 
      ON u.id_employee = a.id_employee AND a.work_date = ?
    WHERE u.role_id IN (1, 2)
  `
  const params = [date]

  if (branchId) {
    query += ` AND u.branch_id = ?`
    params.push(branchId)
  }
  if (department && department !== 'all') {
    query += ` AND u.department = ?`
    params.push(department)
  }

  query += ` ORDER BY u.department, u.firstname`

  const [rows] = await pool.execute(query, params)
  return rows
}

// ── Helper: แปลงสถานะ ──
const getStatus = (row) => {
  if (!row.check_in_time) return 'ขาด'
  if (row.check_out_status === 'early') return 'ออกก่อนเวลา'
  if (row.check_in_status === 'late') return 'สาย'
  return 'ปกติ'
}

const formatTime = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

// ── GET /api/attendance?date=YYYY-MM-DD&department=xxx ──
export const getAttendance = async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0], department } = req.query
    const branchId = req.user.branch_id

    const rows = await fetchAttendanceData(date, department, branchId)

    const result = rows.map(row => ({
      id_employee: row.id_employee,
      name: `${row.firstname} ${row.lastname}`,
      department: row.department,
      position: row.position,
      status: getStatus(row),
      checkIn: formatTime(row.check_in_time),
      checkOut: formatTime(row.check_out_time),
    }))

    res.json({ date, employees: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

// ── GET /api/export?date=YYYY-MM-DD&department=xxx&format=excel|pdf ──
export const exportReport = async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0], department, format = 'excel' } = req.query
    const branchId = req.user.branch_id

    const rows = await fetchAttendanceData(date, department, branchId)
    const data = rows.map(row => ({
      id_employee: row.id_employee,
      name: `${row.firstname} ${row.lastname}`,
      department: row.department,
      position: row.position,
      status: getStatus(row),
      checkIn: formatTime(row.check_in_time),
      checkOut: formatTime(row.check_out_time),
    }))

    const deptLabel = (!department || department === 'all') ? 'ทั้งหมด' : department

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('รายงานการเข้างาน')

      // Header rows
      sheet.mergeCells('A1:G1')
      sheet.getCell('A1').value = `รายงานการเข้างานพนักงาน`
      sheet.getCell('A1').font = { bold: true, size: 14 }
      sheet.getCell('A1').alignment = { horizontal: 'center' }

      sheet.mergeCells('A2:G2')
      sheet.getCell('A2').value = `วันที่: ${date}   แผนก: ${deptLabel}`
      sheet.getCell('A2').alignment = { horizontal: 'center' }

      sheet.addRow([]) // row 3 ว่าง

      // Column headers
      const headerRow = sheet.addRow(['รหัสพนักงาน', 'ชื่อ-นามสกุล', 'แผนก', 'ตำแหน่ง', 'สถานะ', 'เวลาเข้างาน', 'เวลาออกงาน'])
      headerRow.font = { bold: true }
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3C467B' } }
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }

      // Column widths
      sheet.columns = [
        { width: 16 }, { width: 24 }, { width: 14 },
        { width: 28 }, { width: 16 }, { width: 16 }, { width: 16 }
      ]

      // Data rows
      data.forEach(emp => {
        const row = sheet.addRow([emp.id_employee, emp.name, emp.department, emp.position, emp.status, emp.checkIn, emp.checkOut])
        // สีตามสถานะ
        const statusColors = { 'ปกติ': 'FFD1FAE5', 'สาย': 'FFFEF3C7', 'ขาด': 'FFFEE2E2', 'ออกก่อนเวลา': 'FFFFEDD5' }
        const color = statusColors[emp.status] || 'FFFFFFFF'
        row.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }
      })

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename="attendance_${date}.xlsx"`)
      await workbook.xlsx.write(res)
      res.end()

    } else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 40, size: 'A4' })
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="attendance_${date}.pdf"`)
      doc.pipe(res)

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text('Attendance Report', { align: 'center' })
      doc.fontSize(11).font('Helvetica').text(`Date: ${date}   Department: ${deptLabel}`, { align: 'center' })
      doc.moveDown()

      // Table header
      const cols = [60, 140, 80, 150, 80, 70, 70]
      const headers = ['ID', 'Name', 'Dept', 'Position', 'Status', 'Check In', 'Check Out']
      let x = 40

      doc.fontSize(9).font('Helvetica-Bold')
      doc.rect(40, doc.y, 555, 18).fill('#3C467B')
      doc.fillColor('white')
      headers.forEach((h, i) => {
        doc.text(h, x + 2, doc.y - 16, { width: cols[i], lineBreak: false })
        x += cols[i]
      })
      doc.fillColor('black').moveDown(0.8)

      // Data rows
      doc.font('Helvetica').fontSize(8)
      data.forEach((emp, idx) => {
        if (doc.y > 750) { doc.addPage(); }
        const y = doc.y
        if (idx % 2 === 0) doc.rect(40, y, 555, 16).fill('#F3F4F6')
        doc.fillColor('black')
        x = 40
        const cells = [emp.id_employee, emp.name, emp.department, emp.position, emp.status, emp.checkIn, emp.checkOut]
        cells.forEach((cell, i) => {
          doc.text(String(cell), x + 2, y + 3, { width: cols[i] - 4, lineBreak: false })
          x += cols[i]
        })
        doc.moveDown(0.6)
      })

      doc.end()
    } else {
      res.status(400).json({ message: 'format ต้องเป็น excel หรือ pdf' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}