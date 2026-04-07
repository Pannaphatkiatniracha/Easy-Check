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
            "SELECT * FROM users WHERE id_employee = ? AND role_id IN ('3','4')",
            [id_employee]
        )

        if (rows.length === 0) {
            return res.status(401).json({ message: "Admin not found" })
        }

        const admin = rows[0]

        // เช็ค password
        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Password incorrect" })
        }

        // สร้าง token (เปลี่ยน role -> position)
        const token = jwt.sign(
            { id: admin.id, position: admin.position },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            success: true,
            token,
            user: {
                id: admin.id,
                full_name: admin.full_name,
                position: admin.position
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
// edit shift
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
            Events.id AS event_id,
            Events.title,
            Events.date,
            Events.created_at,
            Events.description,

            Users.id_employee,
            Users.firstname,
            Users.lastname

        FROM Events

        LEFT JOIN Event_participants
            ON Events.id = Event_participants.event_id

        LEFT JOIN Users
            ON Event_participants.id_employee = Users.id_employee

        ORDER BY Events.created_at DESC;
        `

        const [rows] = await pool.execute(sql)

        // group data
        const grouped = {}

        rows.forEach(row => {
            if (!grouped[row.event_id]) {
                grouped[row.event_id] = {
                    event_id: row.event_id,
                    title: row.title,
                    date: row.date,
                    created_at: row.created_at,
                    description: row.description,
                    users: []
                }
            }

            if (row.id_employee) {
                grouped[row.event_id].users.push({
                    id_employee: row.id_employee,
                    firstname: row.firstname,
                    lastname: row.lastname
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




// export const CreateEvent = async (req , res) => {
//     try {
//         const {} = req.body ;
//     }
// }


// export const EditEvent = async (req , res) => {
//     try {
//         const {} = req.body ;
//     }
// }

// export const EditTimeEvent = async (req , res) => {
//     try {
//         const {} = req.body ;
//     }
// }

// export const DeleteEvent = async (req , res) => {
//     try {
//         const {} = req.body ;
//     }
// }




