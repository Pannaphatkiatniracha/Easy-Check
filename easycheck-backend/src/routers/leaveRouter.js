import express from "express";
import {
  createLeaveRequest,
  getLeaveHistory,
  getLeaveBalance,
  upload,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from "../controllers/leaveController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* USER */
// เพิ่ม verifyToken ให้ทุก route ที่ต้องการรู้ว่าใคร login อยู่
router.post("/request", verifyToken, upload.single("evidence"), createLeaveRequest);
router.get("/history", verifyToken, getLeaveHistory);
router.get("/balance", verifyToken, getLeaveBalance);

/* APPROVER */
router.get("/pending", verifyToken, getPendingLeaves);
router.put("/:id/approve", verifyToken, approveLeave);
router.put("/:id/reject", verifyToken, rejectLeave);

export default router; 