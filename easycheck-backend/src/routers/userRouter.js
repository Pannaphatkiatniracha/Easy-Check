import express from "express";
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getProfile, updateProfile } from '../controllers/userController.js'

const router = express.Router();


// ----------------------------------------------------------------

router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)



// ----------------------------------------------------------------
router.get("/", (req, res) => {
  res.send("user route working");
});

export default router;