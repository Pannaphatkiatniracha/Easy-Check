import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//admin login
export const loginAdmin = async (req, res) => {
    try {
        console.log("BODY:", req.body)
        const { id_employee, password } = req.body

        // หา admin ใน db
        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE id_employee = ? AND role IN ('admin','superadmin')",
            "SELECT * FROM users WHERE id_employee = ? AND position IN ('admin','superadmin')",
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



// forgot password
export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body

        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE email = ? AND position IN ('admin','superadmin')",
            [email]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" })
        }

        res.json({
            success: true,
            message: "Reset password feature coming soon"
        })

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
            Events.event_id,
            Events.title,
            Events.date,
            Events.created_at,
            Events.description,

            Users.id_employee,
            Users.firstname,
            Users.lastname

        FROM Events

        LEFT JOIN Event_participants
            ON Events.event_id = Event_participants.event_id

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




export const CreateEvent = async (req, res) => {
    try {
        const { title, date, description } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: "Title and Date are required" });
        }

        const [EventResult] = await pool.query(
            "INSERT INTO EVENTS (title , date , description) VALUES(?,?,?)",
            [title, date, description]
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

export const DeleteEvent = async (req, res) => {
    try {
        const { id } = req.body;

        console.log("DELETE ID:", id);

        if (!id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // ลบ event_participants ก่อน
        await pool.query(
            "DELETE FROM event_participants WHERE event_id = ?",
            [id]
        );

        // แล้วค่อยลบ event
        const [DeleteResult] = await pool.query(
            "DELETE FROM EVENTS WHERE event_id = ?",
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




