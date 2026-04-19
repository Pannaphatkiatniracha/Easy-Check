import express from "express";

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
  EditEvent,
  DeleteEvent,
  getDepartments,
  getEmployees,
  sendNotification,
  GetPositionCount,
  SaveRolePermissions,
  GetRolePermissions,
  getDashboardToday,
  getDashboardLeaveStats
} from "../controllers/adminController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

// -----------------------------------------
// Admin Auth (ไม่ต้อง token เพราะเป็นหน้า login/forgot)
// -----------------------------------------
router.post("/login", loginAdmin);
router.get("/me", verifyToken, getAdmin);
router.get("/dashboard/today", verifyToken, getDashboardToday);
router.get("/dashboard/leave-stats", verifyToken, getDashboardLeaveStats); // สถิติการลาเดือนนี้

// Forgot Password (ไม่ต้อง token เพราะยังไม่ได้ login)
router.post("/forgot-password/verify-identity", verifyAdminIdentity);
router.post("/forgot-password/verify-otp", verifyAdminOTP);
router.post("/forgot-password/reset-password", resetAdminPassword);

// -----------------------------------------
// Shift Management (ต้อง login ก่อนถึงจะใช้ได้)
// -----------------------------------------
router.post("/newUserShift", verifyToken, addNewUserShift)    // เพิ่ม shift ให้ user
router.get("/userShift", verifyToken, userShift)              // ดึงข้อมูล shift ทั้งหมด
router.delete("/deleteUserShift", verifyToken, deleteUserShift) // ลบ shift ของ user
router.put("/editShift", verifyToken, editShift)              // แก้ไข shift

// -----------------------------------------
// Event Management (ต้อง login ก่อนถึงจะใช้ได้)
// -----------------------------------------
router.get("/Event", verifyToken, getAllEvent)                 // ดึงกิจกรรมทั้งหมด
router.post("/CreateEvent", verifyToken, CreateEvent)         // สร้างกิจกรรม
router.patch("/EditEvent", verifyToken, EditEvent)              // แก้ไขกิจกรรม
router.delete("/DeleteEvent", verifyToken, DeleteEvent)       // ลบกิจกรรม

// -----------------------------------------
// Notification / Employee / Department (ต้อง login ก่อนถึงจะใช้ได้)
// -----------------------------------------
router.get("/departments", verifyToken, getDepartments)       // ดึงรายชื่อแผนก
router.get("/employees", verifyToken, getEmployees)           // ดึงรายชื่อพนักงาน
router.post("/send-notification", verifyToken, sendNotification) // ส่งการแจ้งเตือน

// -----------------------------------------
// Permission (ต้อง login ก่อนถึงจะใช้ได้) หน้า access control
// -----------------------------------------
router.get('/GetPositionCount', verifyToken, GetPositionCount)        // นับจำนวนตามตำแหน่ง
router.post('/SaveRolePermissions', verifyToken, SaveRolePermissions) // บันทึก permission
router.get('/GetRolePermissions', verifyToken, GetRolePermissions)    // ดึง permission ของ role

// -----------------------------------------
router.get("/", (req, res) => {
  res.send("admin route working");
});

export default router;

