import express from "express";
import {
  createLeaveRequest,
  getLeaveHistory,
  getLeaveBalance,
  upload,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
} from "../controllers/leaveController.js"; // เช็ค path ตรงนี้ให้ตรงกับโฟลเดอร์ของกุค่า

// เพิ่ม Import verifyToken เข้ามา (แก้ไข path ให้ตรงกับที่เก็บไฟล์ middleware )
import { verifyToken } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

/* USER */
// ใช้ upload.single("evidence") เพื่อดักรับไฟล์จาก FormData 
router.post("/request", upload.single("evidence"), createLeaveRequest);
router.get("/history", getLeaveHistory);
router.get("/balance", getLeaveBalance);

/* APPROVER */
router.get("/pending", verifyToken, getPendingLeaves);
router.put("/:id/approve", verifyToken, approveLeave);
router.put("/:id/reject", verifyToken, rejectLeave);

export default router;