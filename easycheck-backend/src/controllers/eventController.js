import db from '../config/db.js'


// 🐷🐷 GET ALL-EVENT
export const getAllEvents = async (req, res) => {
    try {

        // ใช้ LEFT JOIN เพราะต่อให้ event_registrations จะยังไม่ข้อมูลในที่นี้ก็คือไม่มีคนลงทะเบียนอะ แต่ events ก็จะมาหมด
        // COUNT(event_registrations.id) คือการนับจำนวน โดยเราสั่งให้นับ id ของคนที่ลงทะเบียนในตาราง event_registrations
        const [rows] = await db.query(
            `SELECT events.*, 
             COUNT(event_registrations.id) AS current_participants 
             FROM events
             LEFT JOIN event_registrations ON events.id = event_registrations.event_id 
                AND event_registrations.status = 'registered'
             GROUP BY events.id
             ORDER BY events.event_date ASC` // น้อยไปมาก
        )

        console.log(`ดึงข้อมูลมาได้ ${rows.length} รายการ`)

        res.status(200).json(rows) // ตรงนี้คืออีเว้นเราดึงไปทั้งก้อนเลยส่งไปทั้ง rows

    } catch (err) {
        console.error('Error:', err)
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}


// 🐷🐷 ลงทะเบียนเข้าร่วมกิจกรรม (Logic สำหรับหน้า ExRegister)
export const registerEvent = async (req, res) => {
    const { eventId } = req.params 
    const event_id = eventId
    const { notes } = req.body
    const id_employee = req.user.id_employee
    const registration_date = new Date().toISOString().split('T')[0]

    try {

        // ตรงนี้มันคือการเช็คว่าอีเว้นนี้มันมีจริงนะแล้วก็ยังไม่เต็ม
        // SELECT COUNT(*) = นับจำนวนแถวทั้งหมด
        const [eventCheck] = await db.execute(
            `SELECT max_participants, 
                (SELECT COUNT(*) 
                FROM event_registrations 
                WHERE event_id = ? AND status = 'registered') as current_count 
            FROM events WHERE id = ?`,
            [event_id, event_id] // ไปแทนที่ '?' ในคิวรี่
        )
        
        // ถ้าอีเว้นนี้มันไม่มีจริงหรือไม่มีแล้ว
        if (eventCheck.length === 0) {
            return res.status(404).json({ message: "Event not found" })
        }
        
        // ในนี้มีค่าของจำนวนสูงสุดที่รับในอีเว้นนั้นกับจำนวนคนที่ลงทะเบียนไปแล้ว
        const { max_participants, current_count } = eventCheck[0]
        
        // ก็คือเช็คว่าอีเว้นนี้มันจำกัดคนสมัครแล้วมันเต็มยังไรงี้
        if (max_participants > 0 && current_count >= max_participants) {
            return res.status(400).json({ message: "This event is full" })
        }
        
        // check ว่า user คนนี้นางลงทะเบียนไปรึยัง
        const [dupCheck] = await db.execute(
            `SELECT id 
            FROM event_registrations 
            WHERE event_id = ? AND id_employee = ? AND status = 'registered'`,
            [event_id, id_employee]
        )
        
        if (dupCheck.length > 0) {
            return res.status(400).json({ message: "Already registered" })
        }

        // อันนี้คือตอนที่ user กรอกข้อมูลสมัคร
        const insertSql = 
        `INSERT INTO event_registrations (event_id, id_employee, notes, registration_date, status) 
        VALUES (?, ?, ?, ?, 'registered')`
        await db.execute(insertSql, [event_id, id_employee, notes, registration_date])
        

        // อัพเดตจำนวนคนที่ลงทะเบียน
        await db.execute(
            `UPDATE events 
            SET current_participants = (
                SELECT COUNT(*) FROM event_registrations 
                 WHERE event_id = ? AND status = 'registered'
                 )
                 WHERE id = ?`, // ก็คืออัพเดต current_participants ตาม id ของ event นั้น
            [event_id, event_id]
        )
        
        console.log(`✅ Employee ID: ${id_employee} ลงทะเบียน Event ID: ${event_id} สำเร็จ`)
        
        
        res.status(201).json({ 
            success: true, 
            message: "Registration successful" 
        })

    } catch (err) {
        console.error('Register Event Error:', err)
        res.status(500).json({ message: "Something went wrong. Please try again later", error: err.message })
    }
}


// 🐷🐷 ดึงรายละเอียดกิจกรรมตาม id อันนี้คือทำเผื่อไว้ก่อน
export const getEventById = async (req, res) => {
    const { id } = req.params

    try {
        
        const [rows] = await db.execute(
            `SELECT events.*, 
             COUNT(event_registrations.id) AS current_participants 
             FROM events
             LEFT JOIN event_registrations ON events.id = event_registrations.event_id 
                AND event_registrations.status = 'registered'
             WHERE events.id = ?
             GROUP BY events.id`, 
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Event not found" })
        }

        res.status(200).json(rows[0])

    } catch (err) {
        console.error("Error fetching event:", err)
        res.status(500).json({ message: "Server Error", error: err.message })
    }
}