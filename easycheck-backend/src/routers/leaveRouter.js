import express from "express";
import {
  createLeaveRequest,
  getLeaveHistory,
  getLeaveBalance,
  upload,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from "../controllers/leaveController.js"; // เช็ค path ตรงนี้ให้ตรงกับโฟลเดอร์ของคุณด้วยนะ

const router = express.Router();

/* USER */
// ใช้ upload.single("evidence") เพื่อดักรับไฟล์จาก FormData 
router.post("/request", upload.single("evidence"), createLeaveRequest);
router.get("/history", getLeaveHistory);
router.get("/balance", getLeaveBalance);

/* APPROVER */
router.get("/pending", getPendingLeaves);
router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);

export default router;