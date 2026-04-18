import pool from "../config/db.js"; // ชี้ไปที่ไฟล์ตั้งค่าการเชื่อมต่อฐานข้อมูลของคุณ

// ฟังก์ชันดึงรายการ Early Leave ตามสาขาของ Approver
export const getRequests = async (req, res) => {
    const { approverId } = req.query;

    if (!approverId) {
        return res.status(400).json({ message: "Require approverId" });
    }

    try {
        const sql = `
            SELECT 
                a.id, 
                u.firstname, 
                u.lastname, 
                a.id_employee, 
                b.name AS branch_name,
                TIME_FORMAT(s.start_time, '%H:%i') AS shift_start,
                TIME_FORMAT(s.end_time, '%H:%i') AS shift_end,
                TIME_FORMAT(a.check_out_time, '%H:%i') AS request_time,
                a.early_leave_reason AS reason,
                a.approval_status AS status
            FROM attendance a
            JOIN Users u ON a.id_employee = u.id_employee
            JOIN branch b ON u.branch_id = b.id
            JOIN Shifts s ON a.shift_id = s.shift_id
            WHERE a.check_out_status = 'early' 
              AND u.branch_id = (
                  SELECT branch_id FROM Users WHERE id = ?
              )
            ORDER BY a.work_date DESC, a.check_out_time DESC
        `;
        
        const [results] = await pool.query(sql, [approverId]);
        res.json(results);

    } catch (error) {
        console.error("Error fetching early leave requests:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ฟังก์ชันอัปเดตสถานะ อนุมัติ/ไม่อนุมัติ
export const updateStatus = async (req, res) => {
    const attendanceId = req.params.id;
    const { status, approverId } = req.body; // รับ status ('approved', 'rejected') และ approverId

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        // อัปเดต approval_status ในตาราง attendance
        const sql = `
            UPDATE attendance 
            SET approval_status = ? 
            WHERE id = ? AND check_out_status = 'early'
        `;
        
        const [result] = await pool.query(sql, [status, attendanceId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found or not an early leave request" });
        }

        res.json({ message: "อัปเดตสถานะสำเร็จ", status });
    } catch (error) {
        console.error("Error updating approval status:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};