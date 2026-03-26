
import express from 'express'
// นำเข้า Controller ฟังก์ชันที่เราเขียนไว้เพื่อดึงข้อมูลพนักงาน
import { getAllEmployees } from '../controllers/personalSummaryController.js'

// สร้างตัวจัดการเส้นทาง (Router instance)
const router = express.Router()

// กำหนดเส้นทางแบบ GET (เมื่อมีการเรียก API มาที่พาธนี้ ให้ไปทำงานที่ฟังก์ชัน getAllEmployees)
// เนื่องจากใน app.js เรานำ router ตัวนี้ไปผูกไว้กับ '/personal-summary' แล้ว ดังนั้น URL จริงๆ ที่ต้องใช้เรียกคือ GET: /personal-summary/
router.get('/', getAllEmployees)
// /personal-summary
/**
 * @swagger
 * /personal-summary/:
 *   get:
 *     summary: Get all employees
 *     description: Retrieve a list of all employees with basic details (excluding sensitive fields like password).
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       employee_id:
 *                         type: string
 *                         example: "E12345"
 *                       full_name:
 *                         type: string
 *                         example: "Somchai Prasert"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "somchai@example.com"
 *                       phone:
 *                         type: string
 *                         example: "0812345678"
 *                       position:
 *                         type: string
 *                         example: "Software Engineer"
 *                       department:
 *                         type: string
 *                         example: "IT"
 *                       branch:
 *                         type: string
 *                         example: "Bangkok HQ"
 *                       join_date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       avatar:
 *                         type: string
 *                         description: URL หรือ base64 ของรูปโปรไฟล์
 *                         example: "https://example.com/avatar.jpg"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error: database connection failed"
 */



export default router
