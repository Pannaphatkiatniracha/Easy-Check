import express from "express";
import { 
  createLeaveRequest,  // 🐰🤍
  getLeaveHistory, 
  upload, // 🐰🤍
  getPendingLeaves,
  approveLeave,
  rejectLeave
} from "../controllers/leaveController.js";

const router = express.Router();

/*👤 USER*/

router.post("/request", upload.single("evidence"), createLeaveRequest);
/**
 * @swagger
 * /leave-approve/request:
 *   post:
 *     summary: Create leave request
 *     description: Submit a leave request with start/end dates, reasons, optional text, and evidence file.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - leaveStart
 *               - leaveEnd
 *               - leaveReasons
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID ของผู้ใช้ที่ยื่นคำขอลา
 *                 example: 42
 *               leaveStart:
 *                 type: string
 *                 format: date
 *                 description: วันที่เริ่มลา
 *                 example: "2026-03-27"
 *               leaveEnd:
 *                 type: string
 *                 format: date
 *                 description: วันที่สิ้นสุดการลา
 *                 example: "2026-03-29"
 *               leaveReasons:
 *                 type: string
 *                 description: JSON string ของเหตุผลการลา (เช่น ["sick","personal"])
 *                 example: "[\"sick\",\"personal\"]"
 *               otherReasonText:
 *                 type: string
 *                 description: เหตุผลอื่น ๆ ที่ผู้ใช้กรอกเอง
 *                 example: "ไปธุระส่วนตัว"
 *               evidence:
 *                 type: string
 *                 format: binary
 *                 description: ไฟล์หลักฐานการลา (เช่น ใบรับรองแพทย์)
 *     responses:
 *       200:
 *         description: Leave request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ส่งคำขอลางานสำเร็จ"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ข้อมูลไม่ครบ"
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



router.get("/history", getLeaveHistory);
/**
 * @swagger
 * /leave-approve/history:
 *   get:
 *     summary: Get leave history
 *     description: Retrieve the leave request history for a specific user, ordered by most recent first.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของผู้ใช้ที่ต้องการดูประวัติการลา
 *         example: 42
 *     responses:
 *       200:
 *         description: Leave history retrieved successfully
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
 *                   leave_start:
 *                     type: string
 *                     format: date
 *                     example: "2026-03-27"
 *                   leave_end:
 *                     type: string
 *                     format: date
 *                     example: "2026-03-29"
 *                   reasons:
 *                     type: string
 *                     description: JSON string ของเหตุผลการลา
 *                     example: "[\"sick\",\"personal\"]"
 *                   other_reason:
 *                     type: string
 *                     nullable: true
 *                     example: "ไปธุระส่วนตัว"
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                     example: "pending"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-25T14:30:00Z"
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







/*👨‍💼 MANAGER*/
router.get("/pending", getPendingLeaves);
/**
 * @swagger
 * /leave-approve/pending:
 *   get:
 *     summary: Get pending leave requests
 *     description: Retrieve all leave requests that are pending approval, including user details and evidence preview.
 *     tags: [MANAGER]
 *     responses:
 *       200:
 *         description: Pending leave requests retrieved successfully
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
 *                   name:
 *                     type: string
 *                     example: "Somchai Prasert"
 *                   employeeId:
 *                     type: integer
 *                     example: 42
 *                   profile:
 *                     type: string
 *                     description: URL หรือ base64 ของรูปโปรไฟล์
 *                     example: "https://example.com/avatar.jpg"
 *                   leaveStart:
 *                     type: string
 *                     format: date
 *                     example: "2026-03-27"
 *                   leaveEnd:
 *                     type: string
 *                     format: date
 *                     example: "2026-03-29"
 *                   reasons:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: รายการเหตุผลการลา
 *                     example: ["sick", "personal"]
 *                   otherReason:
 *                     type: string
 *                     nullable: true
 *                     example: "ไปธุระส่วนตัว"
 *                   evidencePreview:
 *                     type: string
 *                     description: Base64-encoded preview ของไฟล์หลักฐาน
 *                     example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABA..."
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


// /leave-approve

router.put("/:id/approve", approveLeave);
/**
 * @swagger
 * /leave-approve/{id}/approve:
 *   put:
 *     summary: Approve leave request
 *     description: Approve a specific leave request by its ID. Sets `status` to `approved`.
 *     tags: [MANAGER]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของคำขอลางานที่จะอนุมัติ
 *         example: 101
 *     responses:
 *       200:
 *         description: Leave request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "อนุมัติการลาเรียบร้อย"
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



router.put("/:id/reject", rejectLeave);
/**
 * @swagger
 * /leave-approve/{id}/reject:
 *   put:
 *     summary: Reject leave request
 *     description: Reject a specific leave request by its ID. Sets `status` to `rejected` and stores the reject reason.
 *     tags: [MANAGER]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของคำขอลางานที่จะปฏิเสธ
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
 *                 description: เหตุผลในการปฏิเสธคำขอลา
 *                 example: "ไม่ส่งเอกสารหลักฐาน"
 *     responses:
 *       200:
 *         description: Leave request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ไม่อนุมัติการลาเรียบร้อย"
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