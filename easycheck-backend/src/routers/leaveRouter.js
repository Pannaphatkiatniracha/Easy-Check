import express from "express";
import { 
  createLeaveRequest,  
  getLeaveHistory, 
  upload, 
  getPendingLeaves,
  approveLeave,
  rejectLeave
} from "../controllers/leaveController.js";

const router = express.Router();

// =======================
// 👤 USER
// =======================
// จุดสำคัญ: ชื่อ field ต้องเป็น "evidenceFile" เหมือนฝั่ง Frontend ส่งมา
router.post("/request", upload.single("evidenceFile"), createLeaveRequest); 
router.get("/history", getLeaveHistory);

// =======================
// 👨‍💼 MANAGER
// =======================
router.get("/pending", getPendingLeaves);
router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);

export default router;