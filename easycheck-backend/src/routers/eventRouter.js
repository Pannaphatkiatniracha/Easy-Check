import express from "express"
import {getAllEvents , registerEvent} from "../controllers/eventController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const router = express.Router()

// GET: http://localhost:5000/events/all
router.get('/all', getAllEvents)

// POST: http://localhost:5000/events/:eventId/register
router.post('/:eventId/register', verifyToken, registerEvent)


export default router