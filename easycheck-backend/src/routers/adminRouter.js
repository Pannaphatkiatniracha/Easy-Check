import express from "express";
import { loginAdmin, getAdmin, forgotPassword , addNewUserShift , userShift , deleteUserShift , editShift , settingsAdmin} from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();


// -----------------------------------------

router.post("/login", loginAdmin)
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin or superadmin using employee ID and password.
 *     tags: [Admin]
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
 *                 description: Employee ID of the admin
 *                 example: "A12345"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin password
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token valid for 1 day
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     full_name:
 *                       type: string
 *                       example: "tatar"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         description: Unauthorized - admin not found or password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password incorrect"
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



router.get("/me", verifyToken, getAdmin)
/**
 * @swagger
 * /admin/me:
 *   get:
 *     summary: Get admin profile
 *     description: Retrieve the currently authenticated admin's information by their ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []   # Requires JWT token in Authorization header
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 employee_id:
 *                   type: string
 *                   example: "A12345"
 *                 full_name:
 *                   type: string
 *                   example: "John Doe"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found"
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



router.post("/forgot-password", forgotPassword)
/**
 * @swagger
 * /admin/forgot-password:
 *   post:
 *     summary: Forgot password (Admin)
 *     description: Request a password reset for an admin or superadmin account.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin email address
 *                 example: "admin@example.com"
 *     responses:
 *       200:
 *         description: Reset password placeholder response
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
 *                   example: "Reset password feature coming soon"
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found"
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


// -----------------------------------------tar-----------------------------//
router.post('/newUserShift', addNewUserShift);
/**
 * @swagger
 * /users/newUserShift:
 *   post:
 *     summary: Assign a new shift to a user
 *     description: Add a new shift assignment for a user. Validates user existence and prevents duplicate assignments.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idemployee
 *               - shiftId
 *             properties:
 *               idemployee:
 *                 type: integer
 *                 description: Employee ID ของผู้ใช้
 *                 example: 1001
 *               shiftId:
 *                 type: integer
 *                 description: ID ของกะงานที่จะ assign ให้พนักงาน
 *                 example: 3
 *     responses:
 *       200:
 *         description: Shift assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idemployee:
 *                   type: integer
 *                   example: 1001
 *                 Firstname:
 *                   type: string
 *                   example: "Somchai"
 *                 Lastname:
 *                   type: string
 *                   example: "Prasert"
 *                 level:
 *                   type: string
 *                   example: "staff"
 *                 start_time:
 *                   type: string
 *                   format: time
 *                   example: "08:00:00"
 *                 end_time:
 *                   type: string
 *                   format: time
 *                   example: "17:00:00"
 *                 shift_id:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Missing required fields or user not found / already assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */





// ดึงข้อมูลมาแสดงพนักงานทั้งหมดจาก data php
router.get('/userShift', userShift);
/**
 * @swagger
 * /users/userShift:
 *   get:
 *     summary: Get all user shifts
 *     description: Retrieve all user shift assignments including employee details, role level, and shift times.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User shifts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idemployee:
 *                     type: integer
 *                     example: 1001
 *                   Firstname:
 *                     type: string
 *                     example: "tatar"
 *                   Lastname:
 *                     type: string
 *                     example: "Prasert"
 *                   level:
 *                     type: string
 *                     description: ระดับ role ของพนักงาน
 *                     example: "staff"
 *                   start_time:
 *                     type: string
 *                     format: time
 *                     example: "08:00:00"
 *                   end_time:
 *                     type: string
 *                     format: time
 *                     example: "17:00:00"
 *                   shift_id:
 *                     type: integer
 *                     example: 3
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
 */





//ลบ user ออกจาก shift
router.delete('/deleteUserShift' , deleteUserShift ) 
/**
 * @swagger
 * /users/deleteUserShift:
 *   delete:
 *     summary: Delete user shift assignment
 *     description: Remove a specific shift assignment from a user by userId and shiftId.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - shiftId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: Employee ID ของผู้ใช้
 *                 example: 1001
 *               shiftId:
 *                 type: integer
 *                 description: ID ของกะงานที่จะลบออก
 *                 example: 3
 *     responses:
 *       200:
 *         description: User shift deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User shift deleted successfully"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing userId or shiftId"
 *       404:
 *         description: User shift not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User shift not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */

router.put('/editShift', editShift)
router.get('/editShift', editShift)


router.get('/settingsAdmin', settingsAdmin)











































//-----------------------------------------------tar----------------------------------------//

router.get("/", (req, res) => {
  res.send("admin route working");
});

export default router;