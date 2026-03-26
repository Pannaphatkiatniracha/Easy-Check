import express from "express";
import { loginAdmin, getAdmin, forgotPassword } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// -----------------------------------------

router.post("/login", loginAdmin)
router.get("/me", verifyToken, getAdmin)
router.post("/forgot-password", forgotPassword)

// -----------------------------------------

router.get("/", (req, res) => {
  res.send("admin route working");
});

export default router;