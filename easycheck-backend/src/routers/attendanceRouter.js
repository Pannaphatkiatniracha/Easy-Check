import express from "express";
import {
  checkIn,
  checkOut,
  getHistory,
  getStatus,
} from "../controllers/attendanceController.js";
import db from "../config/db.js"; 

const router = express.Router();

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/list", getHistory); 
router.get("/status", getStatus);

// Route สำหรับการ Update สถานะ Approve/Reject (เขียน Logic ในนี้เลย)
router.patch("/approve/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body; // status: 'approved' หรือ 'rejected'
        
        // ใช้ชื่อคอลัมน์ approval_status ตามที่เห็นใน phpMyAdmin ของคุณ
        await db.execute(
            "UPDATE attendance SET approval_status = ?, reject_reason = ? WHERE id = ?",
            [status, reason || null, id]
        );
        
        res.json({ message: "อัปเดตสถานะเรียบร้อย" });
    } catch (err) {
        console.error("Update Status Error:", err);
        res.status(500).json({ message: err.message });
    }
});

export default router;