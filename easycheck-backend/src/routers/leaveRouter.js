import express from "express";
import { fileLeaveRequest, getLeaveHistory, uploadLeave } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/request", uploadLeave.single("evidenceFile"), fileLeaveRequest);
router.get("/history", getLeaveHistory);

export default router;