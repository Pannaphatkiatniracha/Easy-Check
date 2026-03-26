import express from "express";
import {
  checkIn, checkOut, getHistory, getPendingApprovals, 
  approveAttendance, rejectAttendance, upload
} from "../controllers/attendanceController.js";

const router = express.Router();

// เส้นทางสำหรับพนักงาน (User)
router.post("/check-in", upload.single("photo"), checkIn);
/**
 * @swagger
 * /attendance/check-in:
 *   post:
 *     summary: Employee check-in
 *     description: Submit a check-in with GPS coordinates, user ID, and a photo. Determines if the employee is on time or late.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - lng
 *               - userId
 *               - photo
 *             properties:
 *               lat:
 *                 type: number
 *                 format: float
 *                 description: Latitude of check-in location
 *                 example: 13.7563
 *               lng:
 *                 type: number
 *                 format: float
 *                 description: Longitude of check-in location
 *                 example: 100.5018
 *               userId:
 *                 type: integer
 *                 description: ID of the user checking in
 *                 example: 42
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo file for check-in proof
 *     responses:
 *       200:
 *         description: Check-in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "เช็คอินสำเร็จ"
 *                 status:
 *                   type: string
 *                   enum: [ontime, late]
 *                   example: "ontime"
 *                 id:
 *                   type: integer
 *                   example: 101
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ข้อมูลไม่ครบถ้วน (ต้องมีพิกัด, รูปถ่าย และ ID)"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error: database connection failed"
 */





router.post("/check-out", upload.single("photo"), checkOut);
/**
 * @swagger
 * /attendance/check-out:
 *   post:
 *     summary: Employee check-out
 *     description: Submit a check-out with GPS coordinates, user ID, photo, and optional reason. Determines if the employee checked out early or at normal time.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - lng
 *               - userId
 *               - photo
 *             properties:
 *               lat:
 *                 type: number
 *                 format: float
 *                 description: Latitude of check-out location
 *                 example: 13.7563
 *               lng:
 *                 type: number
 *                 format: float
 *                 description: Longitude of check-out location
 *                 example: 100.5018
 *               userId:
 *                 type: integer
 *                 description: ID of the user checking out
 *                 example: 42
 *               reason:
 *                 type: string
 *                 description: Reason for early check-out (optional)
 *                 example: "Doctor appointment"
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo file for check-out proof
 *     responses:
 *       200:
 *         description: Check-out successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "เช็คเอาท์สำเร็จ"
 *                 status:
 *                   type: string
 *                   enum: [early, normal]
 *                   example: "normal"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ข้อมูลไม่ครบถ้วน"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error: database connection failed"
 */



router.get("/history", getHistory);
/**
 * @swagger
 * /attendance/history:
 *   get:
 *     summary: Get attendance history
 *     description: Retrieve the attendance history for a specific user, ordered by most recent first.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose attendance history is requested
 *         example: 42
 *     responses:
 *       200:
 *         description: Attendance history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 101
 *                   type:
 *                     type: string
 *                     enum: [checkin, checkout]
 *                     example: "checkin"
 *                   status:
 *                     type: string
 *                     enum: [ontime, late, early, normal]
 *                     example: "ontime"
 *                   approval_status:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                     example: "pending"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-26T09:15:00Z"
 *       400:
 *         description: Missing userId query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ไม่พบรหัสผู้ใช้"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error: database connection failed"
 */



// เส้นทางสำหรับหัวหน้า (Manager)
router.get("/pending", getPendingApprovals);
/**
 * @swagger
 * /attendance/pending:
 *   get:
 *     summary: Get pending attendance approvals
 *     description: Retrieve all attendance records that are pending approval, including user details and check-in/out information.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Pending approvals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 101
 *                   userId:
 *                     type: integer
 *                     example: 42
 *                   name:
 *                     type: string
 *                     example: "Somchai Prasert"
 *                   type:
 *                     type: string
 *                     enum: [checkin, checkout]
 *                     example: "checkin"
 *                   status:
 *                     type: string
 *                     enum: [ontime, late, early, normal]
 *                     example: "late"
 *                   checkTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-26T09:15:00Z"
 *                   displayTime:
 *                     type: string
 *                     description: Localized display time (Thai locale)
 *                     example: "26/3/2569 16:15:00"
 *                   checkPhoto:
 *                     type: string
 *                     description: Base64-encoded photo string
 *                     example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABA..."
 *                   approval_status:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                     example: "pending"
 *                   reject_reason:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error: database connection failed"
 */




router.put("/approve/:id", approveAttendance);
/**
 * @swagger
 * /attendance/attendance/approve/{id}:
 *   put:
 *     summary: Approve attendance record
 *     description: Approve a specific attendance record by its ID. Sets `approval_status` to `approved`.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attendance record to approve
 *         example: 101
 *     responses:
 *       200:
 *         description: Attendance record approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "อนุมัติเรียบร้อย"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error: database connection failed"
 */




router.put("/reject/:id", rejectAttendance);
/**
 * @swagger
 * /attendance/reject/{id}:
 *   put:
 *     summary: Reject attendance record
 *     description: Reject a specific attendance record by its ID. Sets `approval_status` to `rejected` and stores the reject reason.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attendance record to reject
 *         example: 101
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejecting the attendance record
 *                 example: "Left early without permission"
 *     responses:
 *       200:
 *         description: Attendance record rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ปฏิเสธการเช็คอินเรียบร้อย"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error: database connection failed"
 */


export default router;