import express from "express";
import { getRequests, updateStatus } from "../controllers/earlyleaveController.js";

const router = express.Router();

// GET: ดึงรายการทั้งหมด (เรียกฟังก์ชัน getRequests)
router.get('/requests', getRequests);

// PUT: อัปเดตสถานะ (เรียกฟังก์ชัน updateStatus)
router.put('/:id/status', updateStatus);

export default router;