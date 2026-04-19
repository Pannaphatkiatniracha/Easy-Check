import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js"; 

const router = express.Router();

router.get("/",             verifyToken, getMyNotifications);
router.get("/unread-count", verifyToken, getUnreadCount);
router.put("/read-all",     verifyToken, markAllAsRead);
router.put("/:id/read",     verifyToken, markAsRead);

export default router;