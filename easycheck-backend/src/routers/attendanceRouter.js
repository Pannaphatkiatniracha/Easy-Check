import express from "express";
// attendanceRoutes.js

import {
  checkIn, checkOut, getHistory,
  approveAttendance, rejectAttendance, upload,
  getAttendanceHistory, getWeeklyHours, getCurrentStatus
} from "../controllers/attendanceController.js";

const router = express.Router();

// เส้นทางสำหรับพนักงาน (User)
router.post("/check-in", upload.single("photo"), checkIn);

router.post("/check-out", upload.single("photo"), checkOut);

router.get("/history", getHistory);

// เส้นทางอนุมัติ / ปฏิเสธ
router.put("/approve/:id", approveAttendance);

router.put("/reject/:id", rejectAttendance);

// -----------------------------------------------------------
router.get("/attendance-history", getAttendanceHistory)

router.get('/weekly-hours', getWeeklyHours)

router.get('/current-status', getCurrentStatus)

export default router;