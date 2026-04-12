import db from "../config/db.js";

// ดึงคำขอ (pending) โดยกรองด้วย branch_id
export const getPendingRequests = (req, res) => {
  const { branch_id } = req.query; 

  let sql = `
    SELECT a.id, a.id_employee, u.firstname, u.lastname,
           a.check_out_time AS created_at,
           a.check_out_status AS status,
           a.early_leave_reason AS reason,
           a.check_out_photo AS photo,
           'checkout' AS type
    FROM attendance a
    JOIN Users u ON a.id_employee = u.id_employee
    WHERE a.approval_status = 'pending'
    AND a.check_out_status = 'early'
  `;

  const params = [];

  // เพิ่มเงื่อนไขการกรองสาขา
  if (branch_id) {
    sql += ` AND u.branch_id = ?`;
    params.push(branch_id);
  }

  sql += ` ORDER BY a.check_out_time DESC`;

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);

    const formatted = result.map((r) => ({
      id: r.id,
      name: `${r.firstname} ${r.lastname}`,
      userId: r.id_employee,
      displayTime: r.created_at ? new Date(r.created_at).toLocaleTimeString("th-TH") : "-",
      status: r.status,
      reason: r.reason,
      type: r.type,
      checkPhoto: r.photo ? `http://localhost:5000/${r.photo}` : null,
    }));

    res.json(formatted);
  });
};

//  approve
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

//  reject
export const rejectRequest = (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  db.query(
    "UPDATE attendance SET approval_status='rejected', early_leave_reason=CONCAT(IFNULL(early_leave_reason,''), ' [เหตุผลไม่อนุมัติ: ', ?, ']') WHERE id=?",
    [reason, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "ไม่อนุมัติแล้ว" });
    }
  );
};