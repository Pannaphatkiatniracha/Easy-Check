import express from "express";
import {
  checkIn,
  checkOut,
  getHistory,
  getStatus,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/history", getHistory);
router.get("/status", getStatus);

export default router;