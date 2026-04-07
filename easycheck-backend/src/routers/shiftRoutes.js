import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getShifts,
  getUsersWithShifts,
  assignShift,
} from "../controllers/shiftController.js";

const router = express.Router();

const requireApprover = (req, res, next) => {
  const allowedRoles = ["approver", "admin", "super admin"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "ไม่มีสิทธิ์" });
  }
  next();
};

router.get("/shifts", verifyToken, requireApprover, getShifts);
router.get("/users-with-shifts", verifyToken, requireApprover, getUsersWithShifts);
router.post("/assign-shift", verifyToken, requireApprover, assignShift);

export default router;