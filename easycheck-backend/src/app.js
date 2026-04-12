import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerUi, swaggerSpec } from "./config/swaggerConfig.js";

import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import attendanceRouter from "./routers/attendanceRouter.js";
import eventRouter from "./routers/eventRouter.js";
import leaveRouter from "./routers/leaveRouter.js";
import personalSummaryRouter from "./routers/personalSummaryRouter.js";
import adminRouter from "./routers/adminRouter.js";
import gpsLocationRouter from "./routers/gpsLocationRouter.js";
import requestRoutes from "./routers/requestRoutes.js";
import shiftRoutes from "./routers/shiftRoutes.js";
import groupNotiRouter from "./routers/group-notiRouter.js";

import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/attendance", attendanceRouter);
app.use("/events", eventRouter);
app.use("/leave-approve", leaveRouter);
app.use("/personal-summary", personalSummaryRouter);
app.use("/admin", adminRouter);
app.use("/gps-locations", gpsLocationRouter);
app.use("/api/group-noti", groupNotiRouter);
app.use("/checkin-approve", requestRoutes);
app.use("/approver", shiftRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("EasyCheck API is running 🚀");
});

(async () => {
  try {
    await pool.execute("SELECT 1");
    console.log("✅ Database Connected");
  } catch (err) {
    console.error("❌ Database Error:", err.message);
  }
})();

app.use((err, req, res, next) => {
  console.error("💥 ERROR:", err);

  if (err?.message?.includes("รองรับเฉพาะไฟล์")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});