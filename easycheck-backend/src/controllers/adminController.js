import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Map สำหรับเก็บ OTP ชั่วคราว (ใน production ควรใช้ Redis หรือ database)
const otpStore = new Map();

//admin login
export const loginAdmin = async (req, res) => {
    try {
        console.log("BODY:", req.body)
        const { id_employee, password } = req.body

        // หา admin ใน db
        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE id_employee = ? AND role_id IN (3,4)",
            [id_employee]
        )

        if (rows.length === 0) {
            return res.status(401).json({
            success: false,
            message: "Admin not found"
        })
        }

        const admin = rows[0]

        // เช็ค password
        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) {
            return res.status(401).json({
            success: false,
            message: "Password incorrect"
            })
        }

        // สร้าง token
        const token = jwt.sign(
            { id: admin.id, position: admin.position, role_id: admin.role_id, branch_id: admin.branch_id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            success: true,
            token,
            user: {
                id: admin.id,
                full_name: `${admin.firstname} ${admin.lastname}`,
                position: admin.position,
                branch_id: admin.branch_id,
                role_id: admin.role_id
            }
        })

    } catch (err) {
        console.error("Admin Login Error:", err)
        res.status(500).json({ message: "Server Error" })
    }
}



//เช็คว่า admin login อยู่รึ
export const getAdmin = async (req, res) => {

    try {

        const adminId = req.user.id

        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE id = ?",
            [adminId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" })
        }

        res.json(rows[0])

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }

}



// forgot password - ขั้นตอนที่ 1: ตรวจสอบตัวตนและส่ง OTP
export const verifyAdminIdentity = async (req, res) => {
    try {
        const { employeeCode, email } = req.body;

        if (!employeeCode || !email) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        // ตรวจสอบว่ามี admin นี้หรือไม่ โดยใช้ id_employee และ email และ role_id 3 หรือ 4
        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE id_employee = ? AND email = ? AND role_id IN (3, 4)",
            [employeeCode, email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลผู้ดูแลระบบ กรุณาตรวจสอบรหัสพนักงานและอีเมลอีกครั้ง" });
        }

        // สร้าง OTP 6 หลัก
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // เก็บ OTP ใน memory (มีอายุ 5 นาที)
        const key = `${employeeCode}_${email}`;
        otpStore.set(key, {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 นาที
        });

        // ส่ง OTP ทางอีเมล
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP สำหรับรีเซ็ทรหัสผ่าน - Easy Check Admin',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4A90E2;">รีเซ็ทรหัสผ่านผู้ดูแลระบบ</h2>
                    <p>คุณได้ขอรีเซ็ทรหัสผ่านสำหรับบัญชีผู้ดูแลระบบ <b>Easy Check</b>.</p>
                    <p>รหัส OTP ของคุณคือ: <strong style="font-size: 24px; color: #e74c3c;">${otp}</strong></p>
                    <p>รหัสนี้จะหมดอายุใน 5 นาที.</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">
                        หากคุณไม่ได้ขอรีเซ็ทรหัสผ่าน กรุณาละเว้นอีเมลนี้.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: `ส่งรหัส OTP ไปยัง ${email} เรียบร้อยแล้ว`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการส่ง OTP" });
    }
};

// forgot password - ขั้นตอนที่ 2: ตรวจสอบ OTP
export const verifyAdminOTP = async (req, res) => {
    try {
        const { employeeCode, email, otp } = req.body;

        if (!employeeCode || !email || !otp) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        const key = `${employeeCode}_${email}`;
        const storedData = otpStore.get(key);

        if (!storedData) {
            return res.status(400).json({ message: "รหัส OTP หมดอายุหรือไม่ถูกต้อง กรุณาขอรหัสใหม่" });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(key);
            return res.status(400).json({ message: "รหัส OTP หมดอายุ กรุณาขอรหัสใหม่" });
        }

        if (otp !== storedData.otp) {
            return res.status(400).json({ message: "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" });
        }

        // OTP ถูกต้อง ลบออกจาก store และอนุญาตให้เปลี่ยนรหัสผ่าน
        otpStore.delete(key);

        res.json({
            success: true,
            message: "ยืนยัน OTP สำเร็จ"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการตรวจสอบ OTP" });
    }
};

// forgot password - ขั้นตอนที่ 3: ตั้งรหัสผ่านใหม่
export const resetAdminPassword = async (req, res) => {
    try {
        const { employeeCode, email, newPassword } = req.body;

        if (!employeeCode || !email || !newPassword) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" });
        }

        // เข้ารหัสรหัสผ่านใหม่
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // อัพเดทรหัสผ่านในฐานข้อมูล
        const [result] = await pool.execute(
            "UPDATE users SET password = ? WHERE id_employee = ? AND email = ? AND role_id IN (3, 4)",
            [hashedPassword, employeeCode, email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบข้อมูลผู้ดูแลระบบ" });
        }

        res.json({
            success: true,
            message: "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
    }
};

// dashboard วันนี้ — กรองเฉพาะสาขาของ admin ที่ login
export const getDashboardToday = async (req, res) => {
    try {
        const branch_id = req.user.branch_id
        if (!branch_id) return res.status(400).json({ message: 'Admin token missing branch_id' })

        const [rows] = await pool.query(
            `SELECT
                u.id_employee, u.firstname, u.lastname,
                u.position, u.department, u.avatar,
                s.start_time AS shift_start, s.end_time AS shift_end,
                a.check_in_time, a.check_out_time, a.check_in_status,
                lr.id AS leave_id, lr.leave_reasons
            FROM Users u
            LEFT JOIN Shifts s ON s.shift_id = u.shift_id
            LEFT JOIN attendance a
                ON a.id_employee = u.id_employee AND a.work_date = CURDATE()
            LEFT JOIN leave_requests lr
                ON lr.id_employee = u.id_employee
                AND lr.status = 'approved'
                AND CURDATE() BETWEEN lr.leave_start AND lr.leave_end
            WHERE u.role_id IN (1, 2)
            AND u.branch_id = ?
            ORDER BY u.department, u.firstname`,
            [branch_id]
        )

        const formatTime = (dt) => dt ? new Date(dt).toTimeString().slice(0, 5) : null

        const employees = rows.map(row => {
            let overallStatus = 'ขาด'
            if (row.check_in_time) {
                overallStatus = row.check_in_status === 'late' ? 'สาย' : 'ปกติ'
            } else if (row.leave_id) {
                overallStatus = 'ลา'
            }

            let leaveReasons = null
            if (row.leave_reasons) {
                try { leaveReasons = typeof row.leave_reasons === 'string' ? JSON.parse(row.leave_reasons) : row.leave_reasons } catch (e) {}
            }

            return {
                id_employee: row.id_employee,
                firstname: row.firstname,
                lastname: row.lastname,
                position: row.position,
                department: row.department,
                avatar: row.avatar,
                checkInTime: formatTime(row.check_in_time),
                checkOutTime: formatTime(row.check_out_time),
                checkInStatus: row.check_in_status,
                overallStatus,
                leaveReasons,
                shiftStart: row.shift_start ? String(row.shift_start).slice(0, 5) : null,
                shiftEnd: row.shift_end ? String(row.shift_end).slice(0, 5) : null
            }
        })

        const present = employees.filter(e => e.overallStatus === 'ปกติ' || e.overallStatus === 'สาย').length
        const late = employees.filter(e => e.overallStatus === 'สาย').length
        const absent = employees.filter(e => e.overallStatus === 'ขาด').length
        const onLeave = employees.filter(e => e.overallStatus === 'ลา').length
        const notCheckedOut = employees.filter(e => e.checkInTime && !e.checkOutTime).length

        const deptMap = {}
        employees.forEach(e => {
            if (!deptMap[e.department]) {
                deptMap[e.department] = { department: e.department, total: 0, present: 0, late: 0, absent: 0, onLeave: 0 }
            }
            deptMap[e.department].total++
            if (e.overallStatus === 'ปกติ') deptMap[e.department].present++
            else if (e.overallStatus === 'สาย') { deptMap[e.department].present++; deptMap[e.department].late++ }
            else if (e.overallStatus === 'ขาด') deptMap[e.department].absent++
            else if (e.overallStatus === 'ลา') deptMap[e.department].onLeave++
        })

        res.json({
            summary: { present, late, absent, onLeave, notCheckedOut, total: employees.length },
            employees,
            departmentStats: Object.values(deptMap)
        })

    } catch (err) {
        console.error('getDashboardToday error:', err)
        res.status(500).json({ message: err.message })
    }
}

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

//---------------------------------tar----------------------------------------------//


// ดึงข้อมูลทั้งหมดของ user shifts พร้อมรายละเอียด
export const userShift = async (req, res) => {
    try {
        const sql = `
         SELECT 
            Users.id_employee AS userId,
            Users.firstname,
            Users.lastname,
            Roles.role AS level,
            Shifts.start_time,
            Shifts.end_time,
            User_shifts.shift_id,
            User_shifts.role_id
        FROM User_shifts
        JOIN Users ON User_shifts.user_id = Users.id_employee
        JOIN Roles ON User_shifts.role_id = Roles.role_id
        JOIN Shifts ON User_shifts.shift_id = Shifts.shift_id;
        `;
        const [rows] = await pool.execute(sql);
        res.status(200).json(rows);
        console.log(rows);

    } catch (error) {
        console.error("Error fetching user shifts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

};


// เพิ่ม shift ให้ user
export const addNewUserShift = async (req, res) => {
    try {
        const { userId, shiftId, roleId } = req.body;

        if (!userId || !shiftId || !roleId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // ตรวจสอบว่ามี user อยู่แล้วไหม
        const [userRows] = await pool.execute(
            "SELECT id_employee FROM Users WHERE id_employee = ?",
            [userId]
        );
        if (userRows.length === 0) {
            return res.status(401).json({ error: "User does not exist" });
        }

        // ตรวจสอบว่ามี user+shift อยู่แล้วหรือยัง
        const [shiftRows] = await pool.execute(
            "SELECT * FROM User_shifts WHERE user_id = ? AND shift_id = ?",
            [userId, shiftId]
        );
        if (shiftRows.length > 0) {
            return res.status(400).json({ message: "This user shift already exists" });
        }

        // insert
        await pool.execute(
            "INSERT INTO User_shifts (user_id, shift_id, role_id) VALUES (?, ?, ?)",
            [userId, shiftId, roleId]
        );

        return res.status(200).json({ message: "User shift added successfully" });
    } catch (err) {
        console.error("Error adding user shift:", err);
        return res.status(500).json({ error: "Server error" });
    }
};






// ลบเฉพาะ shift ของ user (ไม่ลบ user)
export const deleteUserShift = async (req, res) => {
    try {
        const { userId, shiftId } = req.body;

        if (!userId || !shiftId) {
            return res.status(400).json({ error: "Missing userId or shiftId" });
        }

        const [result] = await pool.execute(
            "DELETE FROM User_shifts WHERE user_id = ? AND shift_id = ?",
            [userId, shiftId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User shift not found" });
        }

        return res.status(200).json({ message: "User shift deleted successfully" });
    } catch (error) {
        console.error("Error deleting user shift:", error);
        return res.status(500).json({ error: "Server error" });
    }
};




// edit Shift
export const editShift = async (req, res) => {
    try {
        const { userId, shiftId, newShiftId, roleId } = req.body;

        if (!userId || !shiftId) {
            return res.status(400).json({ error: "Missing userId or shiftId" });
        }

        let updates = [];
        let params = [];

        if (roleId) {
            updates.push("role_id = ?");
            params.push(roleId);
        }

        if (newShiftId) {
            updates.push("shift_id = ?");
            params.push(newShiftId);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "Nothing to update" });
        }

        const sql = `
      UPDATE User_shifts 
      SET ${updates.join(", ")} 
      WHERE user_id = ? AND shift_id = ?
    `;
        params.push(userId, shiftId);

        const [result] = await pool.execute(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Not found" });
        }

        return res.status(200).json({ message: "Update successful" });
    } catch (error) {
        console.error("Error editing user shift:", error);
        res.status(500).json({ error: "Server error" });
    }
};




//-----------------------event tar ------------------------------//
export const getAllEvent = async (req, res) => {
    try {
        const sql = `
        
         SELECT 
            events.id,
            events.title,
            events.event_date,
            events.created_at,
            events.description,
            events.event_time,
            events.location,
            events.register_start,
            events.register_end,
            events.type,
            events.max_participants,

            (
                SELECT COUNT(*)
                FROM event_registrations
                WHERE event_registrations.event_id = events.id
                AND event_registrations.status = 'registered'
            ) AS current_participants,

            Users.id_employee,
            Users.firstname,
            Users.lastname,
            event_registrations.notes  

        FROM events

        LEFT JOIN event_registrations
            ON events.id = event_registrations.event_id

        LEFT JOIN Users
            ON event_registrations.id_employee = Users.id_employee

        `

        const [rows] = await pool.execute(sql)

        // group data
        const grouped = {}

        rows.forEach(row => {
            if (!grouped[row.id]) {
                grouped[row.id] = {
                    id: row.id,
                    title: row.title,
                    event_date: row.event_date,
                    event_time: row.event_time,
                    created_at: row.created_at,
                    description: row.description,
                    location: row.location,
                    register_start: row.register_start,
                    register_end: row.register_end,
                    type: row.type,
                    max_participants: row.max_participants,
                    current_participants: row.current_participants,
                    users: []
                }
            }

            if (row.id_employee) {
                grouped[row.id].users.push({
                    id_employee: row.id_employee,
                    firstname: row.firstname,
                    lastname: row.lastname,
                    notes: row.notes
                })
            }
        })

        const result = Object.values(grouped)

        res.status(200).json(result)

    } catch (error) {
        console.error("DB ERROR:", error)

        res.status(500).json({
            message: 'Database error',
            error: error.message
        })
    }
}




export const CreateEvent = async (req, res) => {
    try {
        const { title, event_date, description, event_time, location, register_start, register_end, type, max_participants } = req.body;

        if (!title || !event_date || !event_time || !location || !register_start || !register_end || !type || !max_participants) {
            return res.status(400).json({ message: "Title and Date and Location are required" });
        }

        const [EventResult] = await pool.query(
            "INSERT INTO events (title , event_date , description , event_time , location , register_start , register_end , type , max_participants) VALUES(?,?,?,?,?,?,?,?,?)",
            [title, event_date, description, event_time, location, register_start, register_end, type, max_participants]
        )

        res.status(200).json({
            message: "event created successfully",
            eventId: EventResult.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating event" });
    }
}


export const EditEvent = async (req, res) => {

    try {
        const { id, title, event_date, description, event_time, location, register_start, register_end, type, max_participants } = req.body;

        const updates = [];
        // เก็บเป็น array
        const values = [];

        if (!id) {
            return res.status(400).json({
                message: "Event id is required"
            });
        }

        if (title !== undefined) {
            updates.push("title = ?")
            values.push(title);
        }

        if (event_date !== undefined) {
            const formattedDate = event_date.includes("T") ? event_date.split("T")[0] : event_date;
            updates.push("event_date = ?");
            values.push(formattedDate);
        }

        if (description !== undefined) {
            updates.push("description = ?")
            values.push(description);
        }

        if (event_time !== undefined) {
            updates.push("event_time = ?")
            values.push(event_time);
        }

        if (location !== undefined) {
            updates.push("location = ?")
            values.push(location);
        }

        if (register_start) {
            let formatted = register_start;

            if (formatted.includes("T")) {
                formatted = formatted.replace("T", " ");
            }


            if (formatted.includes(".")) {
                formatted = formatted.split(".")[0];
            }


            if (formatted.length === 16) {
                formatted += ":00";
            }

            updates.push("register_start = ?");
            values.push(formatted);
        }

        if (register_end) {
            let formatted = register_end;

            if (formatted.includes("T")) {
                formatted = formatted.replace("T", " ");
            }

            if (formatted.includes(".")) {
                formatted = formatted.split(".")[0];
            }

            if (formatted.length === 16) {
                formatted += ":00";
            }

            updates.push("register_end = ?");
            values.push(formatted);
        }

        if (type !== undefined) {
            updates.push("type = ?")
            values.push(type);
        }

        if (max_participants !== undefined) {
            updates.push("max_participants = ?")
            values.push(max_participants);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                message: "No data to update"
            });
        }


        // sql
        const sql = `
        UPDATE events
        SET ${updates.join(" , ")}
        WHERE id = ?

        `;

        values.push(id);

        //ยิง query
        await pool.query(sql, values);

        res.json({ message: "Update Success" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
}


export const DeleteEvent = async (req, res) => {
    try {
        const { id } = req.body;

        console.log("DELETE ID:", id);

        if (!id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // ลบ event_participants ก่อน
        await pool.query(
            "DELETE FROM event_registrations WHERE id = ?",
            [id]
        );

        // แล้วค่อยลบ event
        const [DeleteResult] = await pool.query(
            "DELETE FROM events WHERE id = ?",
            [id]
        );

        console.log("RESULT:", DeleteResult);

        if (DeleteResult.affectedRows === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ message: "Error deleting event" });
    }
};


// -------------------- access control tar------------------------------------------

export const GetPositionCount = async (req, res) => {
    try {
        const sql = `
            SELECT roles.role, COUNT(users.id_employee) AS total
            FROM users
            JOIN roles ON users.role_id = roles.role_id
            GROUP BY roles.role
        `;

        const [rows] = await pool.query(sql);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



export const SaveRolePermissions = async (req, res) => {
    try {
        const { role_id, role_permissions } = req.body;

        //  ดึงของเก่าจาก db
        const [rows] = await pool.query(
            `SELECT id_permission 
             FROM role_permissions 
             WHERE role_id = ?`,
            [role_id]
        );
        const oldPermissions = rows.map(r => r.id_permission);
        //มันคือตัวดึงค่า id  จะได้ oldPermissions = [1,2,3]


        // หา ที่ต้องเพิ่ม เอาของใหม่ หาอันที่ไม่มีในของเก่า
        const toAdd = role_permissions.filter(p => !oldPermissions.includes(p));


        // หา ที่ต้องลบ เอาของเก่า หาอันที่ไม่มีในของใหม่
        const toDelete = oldPermissions.filter(p => !role_permissions.includes(p));


        //  insert เฉพาะที่เพิ่ม
        if (toAdd.length > 0) {
            const values = toAdd.map(p => [role_id, p]);

            await pool.query(
                `INSERT INTO role_permissions (role_id, id_permission) VALUES ?`,
                [values]
            );
        }

        //  delete (เฉพาะที่ลบ)
        if (toDelete.length > 0) {
            await pool.query(
                `DELETE FROM role_permissions 
                 WHERE role_id = ? 
                 AND id_permission IN (?)`,
                [role_id, toDelete]
            );
        }

        res.json({
            message: "Updated",
            added: toAdd,
            deleted: toDelete
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const GetRolePermissions = async (req, res) => {
    try {
        const { role_id } = req.query;

        const [rows] = await pool.query(
            `   SELECT id_permission
                FROM role_permissions
                WHERE role_id = ?
             ` , [role_id]
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// สรุปสถิติการลาเดือนนี้ — กรองเฉพาะสาขาของ admin ที่ login
export const getDashboardLeaveStats = async (req, res) => {
    try {
        const branch_id = req.user.branch_id
        if (!branch_id) return res.status(400).json({ message: 'Admin token missing branch_id' })

        // ดึง leave_requests ที่ approved เดือนนี้ ของพนักงานในสาขา
        const [rows] = await pool.query(
            `SELECT lr.leave_reasons, lr.leave_days
             FROM leave_requests lr
             JOIN Users u ON lr.id_employee = u.id_employee
             WHERE u.branch_id = ?
               AND lr.status = 'approved'
               AND MONTH(lr.leave_start) = MONTH(CURDATE())
               AND YEAR(lr.leave_start) = YEAR(CURDATE())`,
            [branch_id]
        )

        // 7 ประเภทการลา ตาม leave_policy
        const leaveTypes = [
            { label: 'Sick Leave',      thLabel: 'ลาป่วย',       color: '#f44336' },
            { label: 'Personal Leave',  thLabel: 'ลากิจ',         color: '#ff9800' },
            { label: 'Vacation Leave',  thLabel: 'ลาพักร้อน',    color: '#4caf50' },
            { label: 'Maternity Leave', thLabel: 'ลาคลอด',       color: '#e91e63' },
            { label: 'Wedding Leave',   thLabel: 'ลาแต่งงาน',    color: '#9c27b0' },
            { label: 'Religious Leave', thLabel: 'ลาบวช/ศาสนา', color: '#2196f3' },
            { label: 'Other',           thLabel: 'อื่นๆ',         color: '#607d8b' },
        ]

        // นับจำนวนครั้งและวันลาของแต่ละประเภท
        const stats = {}
        leaveTypes.forEach(t => { stats[t.label] = { count: 0, days: 0 } })

        rows.forEach(row => {
            let reasons = row.leave_reasons
            if (typeof reasons === 'string') {
                try { reasons = JSON.parse(reasons) } catch { reasons = [] }
            }
            if (!Array.isArray(reasons)) reasons = []
            reasons.forEach(r => {
                if (stats[r] !== undefined) {
                    stats[r].count++
                    stats[r].days += Number(row.leave_days || 0)
                }
            })
        })

        const data = leaveTypes.map(t => ({
            label:   t.label,
            thLabel: t.thLabel,
            color:   t.color,
            count:   stats[t.label].count,
            days:    stats[t.label].days,
        }))

        res.json({ success: true, data })

    } catch (err) {
        console.error('getDashboardLeaveStats error:', err)
        res.status(500).json({ message: err.message })
    }
}
