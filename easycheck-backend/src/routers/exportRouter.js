import express from 'express'
import { getAttendance, exportReport } from '../controllers/exportController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/attendance', verifyToken, getAttendance)
router.get('/export', verifyToken, exportReport)

export default router