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
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link via email
 *     tags: [User]
 *     description: Sends a password reset token to the user's email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user who wants to reset their password.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Successfully sent a reset token to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reset token sent successfully to your email"
 *                 resetToken:
 *                   type: string
 *                   description: A JWT token for password reset.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWN0aW9uIjoicmVzZXQgcGFzc3dvcmQifQ.1PtdMhAxfid9aj1dV-PsCdeI6WxhH5RoDoZti9Vpdsc"
 *       404:
 *         description: Email not found in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email not found"
 *       500:
 *         description: Server error while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */

router.put('/reset-password/:token', resetPassword)
/**
 * @swagger
 * /auth/reset-password/{token}:
 *   put:
 *     summary: Reset a user's password
 *     tags: [User]
 *     description: Resets the password of a user by using a password reset token.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: The token used for resetting the password.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password that the user wants to set.
 *                 example: "newSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password reset was successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successful"
 *       400:
 *         description: Invalid or expired token, or other errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token"
 *                 error:
 *                   type: string
 *                   example: "jwt malformed"
 *       500:
 *         description: Server error while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */



// via ------------------------------------------------------------
router.get("/", (req, res) => {
  res.send("auth route working");
});



export default router