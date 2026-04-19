import express from "express";
import { getDepartments, getEmployees, sendNotification, getNotifications } from "../controllers/group-notiController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/departments', verifyToken, getDepartments);
router.get('/employees', verifyToken, getEmployees);
router.post('/notifications', verifyToken, sendNotification);
router.get('/notifications', verifyToken, getNotifications);

export default router;