import express from "express";
import { 
  createLeaveRequest,  // 🐰🤍
  getLeaveHistory, 
  upload, // 🐰🤍
  getPendingLeaves,
  approveLeave,
  rejectLeave
} from "../controllers/leaveController.js";

const router = express.Router();

// =======================
// 👤 USER
// =======================
router.post("/request", upload.single("evidenceFile"), createLeaveRequest); // 🐰🤍
router.get("/history", getLeaveHistory);

// =======================
// 👨‍💼 MANAGER
// =======================
router.get("/pending", getPendingLeaves);
router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);

export default router;