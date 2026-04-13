import express from "express";

// import {  forgotPassword } from "../controllers/adminController.js";
// EditEvent , CreateEvent  

// import {  getAdmin, verifyAdminIdentity, verifyAdminOTP, resetAdminPassword, addNewUserShift, userShift, deleteUserShift, editShift, getAllEvent , CreateEvent , DeleteEvent , EditEvent ,getDepartments, getEmployees, sendNotification } from "../controllers/adminController.js";
// , CreateEvent , EditEvent , CreateEvent  , DeleteEvent


import {
  loginAdmin,
  getAdmin,
  verifyAdminIdentity,
  verifyAdminOTP,
  resetAdminPassword,
  addNewUserShift,
  userShift,
  deleteUserShift,
  editShift,
  getAllEvent,
  CreateEvent,
  EditEvent ,
  DeleteEvent,
  getDepartments,
  getEmployees,
  sendNotification,
  GetPositionCount ,
  SaveRolePermissions ,
  GetRolePermissions
} from "../controllers/adminController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// -----------------------------------------
// Admin auth
// -----------------------------------------
router.post("/login", loginAdmin);
router.get("/me", verifyToken, getAdmin);

// Forgot Password Routes for Admin
router.post("/forgot-password/verify-identity", verifyAdminIdentity);
router.post("/forgot-password/verify-otp", verifyAdminOTP);
router.post("/forgot-password/reset-password", resetAdminPassword);

// -----------------------------------------
// Shift Management
// -----------------------------------------
router.post("/newUserShift", addNewUserShift);
router.get("/userShift", userShift);
router.delete("/deleteUserShift", deleteUserShift);
router.put("/editShift", editShift);

// -----------------------------------------
// Event Management
// -----------------------------------------
router.get("/Event", getAllEvent);
router.post("/CreateEvent", CreateEvent);
router.delete("/DeleteEvent", DeleteEvent);

// -----------------------------------------
// Notification / Employee / Department
// -----------------------------------------
router.get("/departments", getDepartments);
router.get("/employees", getEmployees);
router.post("/send-notification", sendNotification);




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


router.get('/Event', getAllEvent)
router.post('/CreateEvent', CreateEvent)
router.patch('/EditEvent', EditEvent)
router.delete('/DeleteEvent', DeleteEvent)
router.get('/GetPositionCount', GetPositionCount)
router.post('/SaveRolePermissions' , SaveRolePermissions)
router.get('/GetRolePermissions' , GetRolePermissions)














































//-----------------------------------------------tar----------------------------------------//


// -----------------------------------------
router.get("/", (req, res) => {
  res.send("admin route working");
});

export default router;