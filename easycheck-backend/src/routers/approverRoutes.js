import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getUsersWithShifts, getAllShifts, assignShift } from "./approverController.js";

const router = express.Router();

// Middleware เช็ค Role (เฉพาะ approver/admin เข้าได้)
const requireApprover = (req, res, next) => {
  const allowedRoles = ["approver", "admin", "super admin"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "ไม่มีสิทธิ์" });
  }
  next();
};

router.get("/users-with-shifts", verifyToken, requireApprover, getUsersWithShifts);
router.get("/shifts",            verifyToken, requireApprover, getAllShifts);
router.post("/assign-shift",     verifyToken, requireApprover, assignShift);

export default router;