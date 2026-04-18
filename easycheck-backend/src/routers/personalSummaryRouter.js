
import express from 'express'
// นำเข้า Controller ฟังก์ชันที่เราเขียนไว้เพื่อดึงข้อมูลพนักงาน
import { getAllEmployees, updateEmployee, deleteEmployee, getEmployeeStats } from '../controllers/personalSummaryController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

// สร้างตัวจัดการเส้นทาง (Router instance)
const router = express.Router()

// กำหนดเส้นทางแบบ GET (เมื่อมีการเรียก API มาที่พาธนี้ ให้ไปทำงานที่ฟังก์ชัน getAllEmployees)
router.get('/list', verifyToken, getAllEmployees)
router.get('/:id/stats', verifyToken, getEmployeeStats) // ต้องอยู่ก่อน /:id เพื่อไม่ให้ชนกัน
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)


/**
 * @swagger
 * /personal-summary/list:
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
