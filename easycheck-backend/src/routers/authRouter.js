import express from 'express'
import { login, logout, forgotPassword, resetPassword } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router() // ก็คือเหมือน router ไปยังหน้าต่าง ๆ ตาม url ที่เราเขียนต่อ

// POST: http://localhost:5000/auth/login
router.post('/login', login)
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Employee login
 *     description: Authenticate employee using employee_id and password.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - password
 *             properties:
 *               employee_id:
 *                 type: string
 *                 example: "E12345"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: JWT token valid for 30 minutes
 *                 role:
 *                   type: string
 *                   example: "employee"
 *                 full_name:
 *                   type: string
 *                   example: "Somchai Prasert"
 *       404:
 *         description: Employee ID not found
 *       401:
 *         description: Incorrect password
 *       500:
 *         description: Internal server error
 */




router.get('/home-data', verifyToken, (req,res) => {
    res.json({message: "Success"})
})





// POST: http://localhost:5000/auth/logout
router.post('/logout', verifyToken, logout)
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Employee logout
 *     description: Logout the currently authenticated user. This simply invalidates the session on client side.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []   # Requires JWT token in Authorization header
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 */



router.post('/forgot-password', forgotPassword)

router.put('/reset-password/:token', resetPassword)


// via ------------------------------------------------------------
router.get("/", (req, res) => {
  res.send("auth route working");
});



export default router