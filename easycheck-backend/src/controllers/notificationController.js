import db from "../config/db.js";

// ── SSE: เก็บรายการเครื่องที่กำลังเชื่อมต่อรอรับแจ้งเตือน ─────────────────
let connectedClients = [];

// ── SSE Helper: สั่ง Push แจ้งเตือนให้ Frontend โหลดข้อมูลใหม่ ─────────────────
const notifyClient = (userId) => {
  // หา client ทั้งหมดของ user คนนี้ (เผื่อเขาเปิดหลายแท็บ/หลายเครื่อง)
  const userClients = connectedClients.filter(client => client.id === userId);
  userClients.forEach(client => {
    // ส่ง signal กลับไปให้ Frontend รู้ว่า "มีอัปเดตนะ ให้ fetch ข้อมูลใหม่ได้เลย"
    client.res.write(`data: ${JSON.stringify({ triggerRefresh: true })}\n\n`);
  });
};

// ── Helper: สร้าง notification ─────────────────
export const createNotification = async ({ userId, type, title, message, refId = null }) => {
  await db.execute(
    `INSERT INTO notifications (id_employee, type, title, message, ref_id)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, type, title, message, refId]
  );
  // ดันแจ้งเตือนแบบ Real-time ทันทีที่สร้างเสร็จ
  notifyClient(userId);
};

// ── GET /notifications/stream ───────────────── (API ใหม่สำหรับเปิดท่อ SSE)
export const streamNotifications = async (req, res) => {
  // ตั้งค่า Header สำหรับ Server-Sent Events
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // ดึง userId จาก token (หมายเหตุ: ตอนเรียกจากหน้าบ้านต้องแนบ token มาด้วย)
  const userId = req.user.id; 

  const newClient = { id: userId, res };
  connectedClients.push(newClient);

  // ส่งข้อมูลทักทายไปก่อน 1 ครั้ง เพื่อบอกว่าเชื่อมต่อสำเร็จ
  res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);

  // เมื่อ user ปิดแอป/สลับหน้า ให้ล้าง connection ทิ้ง เซิร์ฟเวอร์จะได้ไม่พัง
  req.on("close", () => {
    connectedClients = connectedClients.filter(client => client.res !== res);
  });
};

// ── GET /notifications ───────────────── (ใช้ดึง List ปกติ)
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id; 

    const [rows] = await db.execute(
      `SELECT id, type, title, message, ref_id, is_read, created_at
       FROM notifications
       WHERE id_employee = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET /notifications/unread-count ───────────────── (เก็บไว้เผื่อใช้หน้าอื่น)
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[{ count }]] = await db.execute(
      `SELECT COUNT(*) AS count FROM notifications
       WHERE id_employee = ? AND is_read = 0`,
      [userId]
    );

    return res.json({ count: Number(count) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── PUT /notifications/:id/read ─────────────────
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await db.execute(
      `UPDATE notifications SET is_read = 1
       WHERE id = ? AND id_employee = ?`,
      [id, userId]
    );

    // แจ้งอัปเดตแบบ Real-time
    notifyClient(userId);

    return res.json({ message: "อ่านแล้ว" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── PUT /notifications/read-all ─────────────────
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.execute(
      `UPDATE notifications SET is_read = 1
       WHERE id_employee = ? AND is_read = 0`,
      [userId]
    );

    // แจ้งอัปเดตแบบ Real-time
    notifyClient(userId);

    return res.json({ message: "อ่านทั้งหมดแล้ว" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};