import express from "express";

const router = express.Router();

// ตัวอย่าง route
router.get("/", (req, res) => {
  res.send("auth route working");
});

export default router;