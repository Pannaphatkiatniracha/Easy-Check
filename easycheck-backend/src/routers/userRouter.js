import express from "express";
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getProfile, updateProfile, changePassword, uploadAvatar, getAllUsers } from '../controllers/userController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

import { GetMyPermissions } from '../controllers/adminController.js'

const router = express.Router();


// ----------------------------------------------------------------

router.get('/profile', verifyToken, getProfile)
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile information of the currently authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []   # ต้องมี JWT token ใน Authorization header
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 42
 *                 employee_id:
 *                   type: string
 *                   example: "E12345"
 *                 full_name:
 *                   type: string
 *                   example: "Somchai Prasert"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "somchai@example.com"
 *                 phone:
 *                   type: string
 *                   example: "0812345678"
 *                 position:
 *                   type: string
 *                   example: "Software Engineer"
 *                 department:
 *                   type: string
 *                   example: "IT"
 *                 branch:
 *                   type: string
 *                   example: "Bangkok HQ"
 *                 join_date:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-15"
 *                 avatar:
 *                   type: string
 *                   description: URL หรือ base64 ของรูปโปรไฟล์
 *                   example: "https://example.com/avatar.jpg"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */



router.put('/profile', verifyToken, updateProfile)
/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the profile information of the currently authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []   # ต้องมี JWT token ใน Authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Somchai Prasert"
 *               phone:
 *                 type: string
 *                 example: "0812345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "somchai@example.com"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               branch:
 *                 type: string
 *                 example: "Bangkok HQ"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */



router.put('/change-password', verifyToken, changePassword)
/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change user password
 *     description: Change the password of the currently authenticated user. Requires current password verification.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []   # ต้องมี JWT token ใน Authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: รหัสผ่านปัจจุบัน
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: รหัสผ่านใหม่
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Current password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

// single คือจะรับแค่ไฟล์เดียวน้า avatar คือตัวรับต้องตรงกับตัวส่งที่ฟ้อนเอนส่งมาด้วย
router.post('/upload-avatar', verifyToken, upload.single('avatar'), uploadAvatar)

router.get('/permissions', verifyToken, GetMyPermissions)

router.get('/all', verifyToken, getAllUsers)
// ----------------------------------------------------------------
router.get("/", (req, res) => {
  res.send("user route working");
});

export default router;