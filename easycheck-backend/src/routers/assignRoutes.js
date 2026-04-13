import express from "express";
import { 
    getBranches, 
    getCandidates, 
    getApprovers, 
    assignApprover, 
    revokeApprover 
} from "../controllers/assignController.js";

const router = express.Router();

router.get("/branches", getBranches);
router.get("/candidates", getCandidates);
router.get("/", getApprovers);
router.put("/:id/assign", assignApprover);
router.put("/:id/revoke", revokeApprover);

export default router;