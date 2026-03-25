import express from "express";
import {
  checkIn, checkOut, getHistory, getPendingApprovals, 
  approveAttendance, rejectAttendance, upload
} from "../controllers/attendanceController.js";

const router = express.Router();

// เส้นทางสำหรับพนักงาน (User)
router.post("/check-in", upload.single("photo"), checkIn);
router.post("/check-out", upload.single("photo"), checkOut);
router.get("/history", getHistory);

// เส้นทางสำหรับหัวหน้า (Manager)
router.get("/pending", getPendingApprovals);
router.put("/approve/:id", approveAttendance);
router.put("/reject/:id", rejectAttendance);

export default router;