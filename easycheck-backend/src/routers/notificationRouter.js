import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  streamNotifications // เพิ่ม import ตัวนี้เข้ามา
} from "../controllers/notificationController.js"; 

const router = express.Router();

// ── SSE Route ────────────────────────────────────────
// เปิดท่อรับข้อมูล Real-time
router.get("/stream", verifyToken, streamNotifications);

// ── Standard Routes ──────────────────────────────────
router.get("/",             verifyToken, getMyNotifications);
router.get("/unread-count", verifyToken, getUnreadCount);
router.put("/read-all",     verifyToken, markAllAsRead);
router.put("/:id/read",     verifyToken, markAsRead);

export default router;