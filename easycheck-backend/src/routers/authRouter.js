import express from 'express'
import { login } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { logout } from '../controllers/authController.js'

const router = express.Router() // ก็คือเหมือน router ไปยังหน้าต่าง ๆ ตาม url ที่เราเขียนต่อ

// POST: http://localhost:5000/auth/login
router.post('/login', login)

router.get('/home-data', verifyToken, (req,res) => {
    res.json({message: "Success"})
})

// POST: http://localhost:5000/auth/logout
router.post('/logout', verifyToken, logout)



// via ------------------------------------------------------------
router.get("/", (req, res) => {
  res.send("auth route working");
});

export default router