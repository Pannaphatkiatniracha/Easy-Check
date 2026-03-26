import express from "express";
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getProfile, updateProfile, changePassword } from '../controllers/userController.js'

const router = express.Router();


// ----------------------------------------------------------------

router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)
router.put('/change-password', verifyToken, changePassword)


// ----------------------------------------------------------------
router.get("/", (req, res) => {
  res.send("user route working");
});

export default router;