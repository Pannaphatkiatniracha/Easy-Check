import express from "express";
import {
  checkIn,
  checkOut,
  getHistory,
  getPending,
  approveAttendance,
  rejectAttendance,
  getMyShift,
  upload,
} from "../controllers/attendanceController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/shift/me", verifyToken, getMyShift);
router.post("/check-in", verifyToken, upload.single("photo"), checkIn);
router.post("/check-out", verifyToken, upload.single("photo"), checkOut);
router.get("/history", verifyToken, getHistory);

router.get("/pending", verifyToken, getPending);
router.put("/:id/approve", verifyToken, approveAttendance);
router.put("/:id/reject", verifyToken, rejectAttendance);

export default router;