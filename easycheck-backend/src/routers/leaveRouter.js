import express from "express";
import { 
  fileLeaveRequest, 
  getLeaveHistory, 
  uploadLeave,
  getPendingLeaves,
  approveLeave,
  rejectLeave
} from "../controllers/leaveController.js";

const router = express.Router();

// =======================
// 👤 USER
// =======================
router.post("/request", uploadLeave.single("evidenceFile"), fileLeaveRequest);
router.get("/history", getLeaveHistory);

// =======================
// 👨‍💼 MANAGER
// =======================
router.get("/pending", getPendingLeaves);
router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);

export default router;