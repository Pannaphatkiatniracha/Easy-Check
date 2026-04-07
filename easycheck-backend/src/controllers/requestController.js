import db from "../config/db.js";

// 🔥 ดึงคำขอ (pending)
export const getPendingRequests = (req, res) => {
  const sql = `
    SELECT a.*, u.firstname, u.lastname, u.id_employee
    FROM attendance a
    JOIN users u ON a.id_employee = u.id_employee
    WHERE a.approval_status = 'pending'
    AND a.type = 'checkout'
    AND a.status = 'early'
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    const formatted = result.map((r) => ({
      id: r.id,
      name: `${r.firstname} ${r.lastname}`,
      userId: r.id_employee,
      displayTime: new Date(r.created_at).toLocaleTimeString(),
      status: r.status,
      reason: r.reason,
      checkPhoto: r.photo
        ? `http://localhost:5000/uploads/${r.photo}`
        : null,
    }));

    res.json(formatted);
  });
};

// ✅ approve
export const approveRequest = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE attendance SET approval_status='approved' WHERE id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "อนุมัติแล้ว" });
    }
  );
};

// ❌ reject
export const rejectRequest = (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  db.query(
    "UPDATE attendance SET approval_status='rejected', reject_reason=? WHERE id=?",
    [reason, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "ไม่อนุมัติแล้ว" });
    }
  );
};