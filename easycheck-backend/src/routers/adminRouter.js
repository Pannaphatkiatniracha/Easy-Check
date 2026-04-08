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
  DeleteEvent,
  getDepartments,
  getEmployees,
  sendNotification
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

// -----------------------------------------
router.get("/", (req, res) => {
  res.send("admin route working");
});

export default router;