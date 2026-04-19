import db from "../config/db.js";

// ── Helper: สร้าง notification ─────────────────
// id_employee ในตาราง notifications คือ Users.id (int)
export const createNotification = async ({ userId, type, title, message, refId = null }) => {
  await db.execute(
    `INSERT INTO notifications (id_employee, type, title, message, ref_id)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, type, title, message, refId]
  );
};

// ── GET /notifications ─────────────────
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Users.id (int)

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

// ── GET /notifications/unread-count ─────────────────
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

    return res.json({ message: "อ่านทั้งหมดแล้ว" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};