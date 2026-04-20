import express from 'express';
import { GetMyPermissions } from "../controllers/permissionController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/permissions', verifyToken, GetMyPermissions);

export default router;