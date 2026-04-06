import express from "express";
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.get("/pending", getPendingRequests);
router.put("/:id/approve", approveRequest);
router.put("/:id/reject", rejectRequest);

export default router;