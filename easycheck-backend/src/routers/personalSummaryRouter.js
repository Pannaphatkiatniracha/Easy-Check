
import express from 'express'
// นำเข้า Controller ฟังก์ชันที่เราเขียนไว้เพื่อดึงข้อมูลพนักงาน
import { getAllEmployees } from '../controllers/personalSummaryController.js'

// สร้างตัวจัดการเส้นทาง (Router instance)
const router = express.Router()

// กำหนดเส้นทางแบบ GET (เมื่อมีการเรียก API มาที่พาธนี้ ให้ไปทำงานที่ฟังก์ชัน getAllEmployees)
// เนื่องจากใน app.js เรานำ router ตัวนี้ไปผูกไว้กับ '/personal-summary' แล้ว ดังนั้น URL จริงๆ ที่ต้องใช้เรียกคือ GET: /personal-summary/
router.get('/', getAllEmployees)


export default router
