import express from "express";
import { loginAdmin, getAdmin, forgotPassword } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();


// -----------------------------------------

router.post("/login", loginAdmin)
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin or superadmin using employee ID and password.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - password
 *             properties:
 *               employee_id:
 *                 type: string
 *                 description: Employee ID of the admin
 *                 example: "A12345"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin password
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token valid for 1 day
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     full_name:
 *                       type: string
 *                       example: "tatar"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         description: Unauthorized - admin not found or password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password incorrect"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */



router.get("/me", verifyToken, getAdmin)
/**
 * @swagger
 * /admin/me:
 *   get:
 *     summary: Get admin profile
 *     description: Retrieve the currently authenticated admin's information by their ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []   # Requires JWT token in Authorization header
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 employee_id:
 *                   type: string
 *                   example: "A12345"
 *                 full_name:
 *                   type: string
 *                   example: "John Doe"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */



router.post("/forgot-password", forgotPassword)
<<<<<<< HEAD
=======
/**
 * @swagger
 * /admin/forgot-password:
 *   post:
 *     summary: Forgot password (Admin)
 *     description: Request a password reset for an admin or superadmin account.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin email address
 *                 example: "admin@example.com"
 *     responses:
 *       200:
 *         description: Reset password placeholder response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Reset password feature coming soon"
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */


// -----------------------------------------

router.get("/", (req, res) => {
  res.send("admin route working");
});

export default router;
>>>>>>> 56c72163ddd2a4e80cf7eeb1beb81bca78a93881
