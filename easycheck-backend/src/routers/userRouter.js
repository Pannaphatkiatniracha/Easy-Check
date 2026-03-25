import express from "express";
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getProfile } from '../controllers/userController.js'

const router = express.Router();


// ----------------------------------------------------------------

router.get('/profile', verifyToken, getProfile)




// ----------------------------------------------------------------
router.get("/", (req, res) => {
  res.send("user route working");
});

export default router;