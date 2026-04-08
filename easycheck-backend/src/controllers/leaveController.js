import multer from "multer";
import db from "../config/db.js";

// =========================
// Multer
// =========================
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("รองรับเฉพาะไฟล์ JPG, JPEG, PNG และ PDF เท่านั้น")
      );
    }

    cb(null, true);
  },
});

const bufferToBase64 = (buffer, mime = "image/jpeg") => {
  if (!buffer) return null;
  return `data:${mime};base64,${buffer.toString("base64")}`;
};

// =========================
// Map ชื่อจาก frontend -> leave_policy.leave_code
// =========================
const LEAVE_REASON_TO_CODE = {
  "Sick Leave": "SICK",
  "Personal Leave": "PERSONAL",
  "Vacation Leave": "VACATION",
  "Maternity Leave": "MATERNITY",
  "Wedding Leave": "WEDDING",
  "Religious Leave": "RELIGIOUS",
  "Other": "OTHER",
};

const getTodayDateString = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().split("T")[0];
};

const normalizeDateString = (dateValue) => {
  if (!dateValue) return null;
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return null;

  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().split("T")[0];
};

const parseLeaveReasons = (leaveReasons) => {
  let reasons = [];

  if (Array.isArray(leaveReasons)) {
    reasons = leaveReasons;
  } else {
    try {
      reasons = JSON.parse(leaveReasons);
    } catch (err) {
      reasons = leaveReasons ? [leaveReasons] : [];
    }
  }

  return reasons.filter(Boolean);
};

const getLeaveCodeFromReasons = (reasons = []) => {
  if (!Array.isArray(reasons) || reasons.length === 0) return null;

  // ใช้เหตุผลหลักตัวแรกที่ไม่ใช่ Other
  const mainReason = reasons.find((r) => r !== "Other") || reasons[0];
  return LEAVE_REASON_TO_CODE[mainReason] || null;
};

const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return 0;
  }

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay(); // 0=Sun, 6=Sat
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

const getYearRange = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();

  return {
    year,
    startOfYear: `${year}-01-01`,
    endOfYear: `${year}-12-31`,
  };
};

const getUserByEmployeeId = async (employeeId) => {
  const [rows] = await db.execute(
    `SELECT 
        id,
        id_employee,
        role_id,
        firstname,
        lastname,
        gender,
        birthdate,
        joindate,
        position,
        department,
        branch,
        email,
        password,
        phone,
        avatar
     FROM Users
     WHERE id_employee = ?
     LIMIT 1`,
    [employeeId]
  );

  return rows[0] || null;
};

const getLeavePolicyByCode = async (leaveCode) => {
  const [rows] = await db.execute(
    `SELECT id, leave_code, leave_name, max_days_per_year, require_evidence, active
     FROM leave_policy
     WHERE leave_code = ? AND active = 1
     LIMIT 1`,
    [leaveCode]
  );

  return rows[0] || null;
};

const getUsedLeaveStatsInYear = async (employeeId, reasonLabel, leaveStart) => {
  const { startOfYear, endOfYear } = getYearRange(leaveStart);

  const [rows] = await db.execute(
    `SELECT 
        COALESCE(SUM(leave_days), 0) AS usedDays,
        COUNT(*) AS usedTimes
     FROM leave_requests
     WHERE id_employee = ?
       AND status IN ('pending', 'approved')
       AND leave_start BETWEEN ? AND ?
       AND JSON_CONTAINS(leave_reasons, JSON_QUOTE(?))`,
    [employeeId, startOfYear, endOfYear, reasonLabel]
  );

  return {
    usedDays: Number(rows[0]?.usedDays || 0),
    usedTimes: Number(rows[0]?.usedTimes || 0),
  };
};

const getLeaveBalanceData = async (employeeId, targetYear = new Date().getFullYear()) => {
  const user = await getUserByEmployeeId(employeeId);
  if (!user) {
    throw new Error("ไม่พบข้อมูลพนักงาน");
  }

  const [policies] = await db.execute(
    `SELECT leave_code, leave_name, max_days_per_year, require_evidence, active
     FROM leave_policy
     WHERE active = 1
     ORDER BY id ASC`
  );

  const startOfYear = `${targetYear}-01-01`;
  const endOfYear = `${targetYear}-12-31`;

  const [requests] = await db.execute(
    `SELECT leave_reasons, leave_days, status, leave_start
     FROM leave_requests
     WHERE id_employee = ?
       AND status IN ('pending', 'approved')
       AND leave_start BETWEEN ? AND ?`,
    [employeeId, startOfYear, endOfYear]
  );

  const result = [];

  for (const policy of policies) {
    const reasonLabel = Object.keys(LEAVE_REASON_TO_CODE).find(
      (key) => LEAVE_REASON_TO_CODE[key] === policy.leave_code
    );

    let usedDays = 0;
    let usedTimesThisYear = 0;

    if (reasonLabel) {
      for (const req of requests) {
        let reasons = [];
        try {
          reasons = JSON.parse(req.leave_reasons || "[]");
        } catch {
          reasons = [];
        }

        if (reasons.includes(reasonLabel)) {
          usedDays += Number(req.leave_days || 0);
          usedTimesThisYear += 1;
        }
      }
    }

    let maxDays = Number(policy.max_days_per_year || 0);

    // Vacation Leave: ได้สิทธิ์เมื่อทำงานครบ 1 ปี
    if (policy.leave_code === "VACATION") {
      if (!user.joindate) {
        maxDays = 0;
      } else {
        const joinDate = new Date(user.joindate);
        const checkDate = new Date(`${targetYear}-12-31`);
        const diffYears = (checkDate - joinDate) / (1000 * 60 * 60 * 24 * 365);

        if (diffYears < 1) {
          maxDays = 0;
        }
      }
    }

    result.push({
      leaveCode: policy.leave_code,
      leaveName: policy.leave_name,
      maxDays,
      usedDays,
      remainingDays: Math.max(maxDays - usedDays, 0),
      usedTimesThisYear,
      requireEvidence: !!policy.require_evidence,
    });
  }

  return result;
};

/* =========================
   ✅ ส่งคำขอลางาน
========================= */
export const createLeaveRequest = async (req, res) => {
  try {
    const {
      userId,
      leaveStart,
      leaveEnd,
      leaveReasons,
      otherReasonText,
    } = req.body;

    const file = req.file;

    if (!userId || !leaveStart || !leaveEnd || !leaveReasons) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    const normalizedStart = normalizeDateString(leaveStart);
    const normalizedEnd = normalizeDateString(leaveEnd);
    const today = getTodayDateString();

    if (!normalizedStart || !normalizedEnd) {
      return res.status(400).json({ message: "รูปแบบวันที่ไม่ถูกต้อง" });
    }

    if (normalizedStart > normalizedEnd) {
      return res.status(400).json({
        message: "วันเริ่มลาต้องไม่มากกว่าวันสิ้นสุดลา",
      });
    }

    // ✅ ห้ามลาย้อนหลัง
    if (normalizedStart < today || normalizedEnd < today) {
      return res.status(400).json({
        message: "ไม่สามารถยื่นลาย้อนหลังได้ กรุณาเลือกวันที่วันนี้หรือวันถัดไป",
      });
    }

    const reasons = parseLeaveReasons(leaveReasons);

    if (!Array.isArray(reasons) || reasons.length === 0) {
      return res.status(400).json({ message: "กรุณาเลือกประเภทการลา" });
    }

    if (reasons.includes("Other") && !String(otherReasonText || "").trim()) {
      return res.status(400).json({ message: "กรุณาระบุเหตุผลเพิ่มเติม" });
    }

    const leaveDays = calculateLeaveDays(normalizedStart, normalizedEnd);

    if (leaveDays <= 0) {
      return res.status(400).json({
        message: "จำนวนวันลาต้องมากกว่า 0 วันทำงาน",
      });
    }

    const user = await getUserByEmployeeId(String(userId).trim());
    if (!user) {
      return res.status(404).json({
        message: `ไม่พบพนักงานในระบบ: ${userId}`,
      });
    }

    const leaveCode = getLeaveCodeFromReasons(reasons);
    if (!leaveCode) {
      return res.status(400).json({ message: "ไม่พบประเภทการลา" });
    }

    const policy = await getLeavePolicyByCode(leaveCode);
    if (!policy) {
      return res.status(400).json({
        message: "ไม่พบสิทธิการลาประเภทนี้ใน leave_policy",
      });
    }

    // Vacation Leave: ต้องทำงานครบ 1 ปี
    if (leaveCode === "VACATION") {
      if (!user.joindate) {
        return res.status(400).json({
          message: "ไม่พบข้อมูลวันเริ่มงานของพนักงาน",
        });
      }

      const joinDate = new Date(user.joindate);
      const requestDate = new Date(normalizedStart);
      const diffYears = (requestDate - joinDate) / (1000 * 60 * 60 * 24 * 365);

      if (diffYears < 1) {
        return res.status(400).json({
          message: "ยังทำงานไม่ครบ 1 ปี จึงยังไม่มีสิทธิ์ลาพักร้อน",
        });
      }
    }

    // Maternity Leave: ให้เฉพาะ female
    if (leaveCode === "MATERNITY" && user.gender !== "female") {
      return res.status(400).json({
        message: "ลาคลอดใช้ได้เฉพาะพนักงานหญิง",
      });
    }

    // require_evidence จาก policy
    if (Number(policy.require_evidence) === 1 && !file) {
      return res.status(400).json({
        message: `การลา ${policy.leave_name} ต้องแนบหลักฐาน`,
      });
    }

    const mainReasonLabel =
      Object.keys(LEAVE_REASON_TO_CODE).find(
        (key) => LEAVE_REASON_TO_CODE[key] === leaveCode
      ) || reasons[0];

    const stats = await getUsedLeaveStatsInYear(
      user.id_employee,
      mainReasonLabel,
      normalizedStart
    );

    const maxDays = Number(policy.max_days_per_year || 0);
    const remainingDays = maxDays - stats.usedDays;

    if (maxDays > 0 && leaveDays > remainingDays) {
      return res.status(400).json({
        message: `สิทธิลาไม่พอ ใช้ไปแล้ว ${stats.usedDays} วัน เหลือ ${Math.max(
          remainingDays,
          0
        )} วัน แต่กำลังยื่น ${leaveDays} วัน`,
      });
    }

    await db.execute(
      `INSERT INTO leave_requests
      (
        id_employee,
        leave_start,
        leave_end,
        leave_days,
        leave_reasons,
        other_reason,
        evidence_file,
        evidence_mime,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        user.id_employee,
        normalizedStart,
        normalizedEnd,
        leaveDays,
        JSON.stringify(reasons),
        otherReasonText?.trim() || null,
        file ? file.buffer : null,
        file ? file.mimetype : null,
      ]
    );

    return res.json({
      message: "ส่งคำขอลางานสำเร็จ และส่งให้ approver รออนุมัติแล้ว",
      data: {
        employeeId: user.id_employee,
        employeeName: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        leaveCode,
        leaveName: policy.leave_name,
        leaveDays,
        usedDays: stats.usedDays,
        usedTimesThisYear: stats.usedTimes + 1,
        remainingAfterSubmit: Math.max(remainingDays - leaveDays, 0),
        status: "pending",
      },
    });
  } catch (err) {
    console.error("Error creating leave request:", err);
    return res.status(500).json({
      message: err.message || "เกิดข้อผิดพลาดในการส่งคำขอลา",
    });
  }
};

/* =========================
   ✅ ดูสิทธิวันลาคงเหลือ
========================= */
export const getLeaveBalance = async (req, res) => {
  try {
    const { userId, year } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "กรุณาระบุ userId" });
    }

    const targetYear = Number(year || new Date().getFullYear());
    const balance = await getLeaveBalanceData(String(userId).trim(), targetYear);

    return res.json({
      userId: String(userId).trim(),
      year: targetYear,
      balance,
    });
  } catch (err) {
    console.error("Error getting leave balance:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   ✅ ประวัติการลา
========================= */
export const getLeaveHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "กรุณาระบุ userId" });
    }

    const [rows] = await db.execute(
      `SELECT 
          id,
          id_employee,
          leave_start,
          leave_end,
          leave_days,
          leave_reasons,
          other_reason,
          evidence_mime,
          status,
          reject_reason,
          created_at,
          approved_at,
          rejected_at
       FROM leave_requests
       WHERE id_employee = ?
       ORDER BY created_at DESC`,
      [String(userId).trim()]
    );

    const formatted = rows.map((row) => {
      let reasons = [];
      try {
        reasons = JSON.parse(row.leave_reasons || "[]");
      } catch {
        reasons = [];
      }

      return {
        ...row,
        leave_reasons: reasons,
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error("Error getting leave history:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   ✅ pending (สำหรับ approver)
========================= */
export const getPendingLeaves = async (req, res) => {
  try {
    const [leaves] = await db.execute(`
      SELECT *
      FROM leave_requests
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `);

    const [users] = await db.execute(`
      SELECT id_employee, firstname, lastname, avatar, department, position
      FROM Users
    `);

    const formatted = leaves.map((l) => {
      const user = users.find((u) => u.id_employee === l.id_employee) || {};

      let fullName = l.id_employee;
      if (user.firstname && user.lastname) {
        fullName = `${user.firstname} ${user.lastname}`;
      } else if (user.firstname) {
        fullName = user.firstname;
      }

      let reasons = [];
      try {
        reasons = l.leave_reasons ? JSON.parse(l.leave_reasons) : [];
      } catch {
        reasons = [];
      }

      return {
        id: l.id,
        name: fullName,
        employeeId: l.id_employee,
        department: user.department || null,
        position: user.position || null,
        profile: user.avatar || null,
        leaveStart: l.leave_start,
        leaveEnd: l.leave_end,
        leaveDays: l.leave_days,
        reasons,
        otherReason: l.other_reason,
        evidencePreview:
          l.evidence_mime && l.evidence_mime.startsWith("image/")
            ? bufferToBase64(l.evidence_file, l.evidence_mime)
            : null,
        evidenceMime: l.evidence_mime || null,
        hasEvidence: !!l.evidence_file,
        status: l.status,
        createdAt: l.created_at,
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error("Error fetching pending leaves:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   ✅ approve
========================= */
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      `SELECT id, status FROM leave_requests WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "ไม่พบคำขอลา" });
    }

    if (rows[0].status !== "pending") {
      return res.status(400).json({
        message: "คำขอนี้ไม่ได้อยู่ในสถานะรออนุมัติ",
      });
    }

    await db.execute(
      `UPDATE leave_requests
       SET status = 'approved',
           approved_at = NOW()
       WHERE id = ?`,
      [id]
    );

    return res.json({ message: "approver อนุมัติการลาเรียบร้อย" });
  } catch (err) {
    console.error("Error approving leave:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   ✅ reject
========================= */
export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const [rows] = await db.execute(
      `SELECT id, status FROM leave_requests WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "ไม่พบคำขอลา" });
    }

    if (rows[0].status !== "pending") {
      return res.status(400).json({
        message: "คำขอนี้ไม่ได้อยู่ในสถานะรออนุมัติ",
      });
    }

    await db.execute(
      `UPDATE leave_requests
       SET status = 'rejected',
           reject_reason = ?,
           rejected_at = NOW()
       WHERE id = ?`,
      [reason?.trim() || "ไม่ระบุเหตุผล", id]
    );

    return res.json({ message: "approver ไม่อนุมัติการลาเรียบร้อย" });
  } catch (err) {
    console.error("Error rejecting leave:", err);
    return res.status(500).json({ message: err.message });
  }
};