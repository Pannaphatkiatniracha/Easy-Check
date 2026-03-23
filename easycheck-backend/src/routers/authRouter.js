import express from 'express'
import { login } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router() // ก็คือเหมือน router ไปยังหน้าต่าง ๆ ตาม url ที่เราเขียนต่อ

// POST: http://localhost:5000/api/auth/login
router.post('/login', login)

router.get('/home-data', verifyToken, (req,res) => {
    res.json({message: "Success"})
})

export default router