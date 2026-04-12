import db from "../config/db.js";

// ดึงข้อมูลสาขาทั้งหมด (จากตาราง branch)
export const getBranches = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM branch ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ดึงรายชื่อพนักงานที่ "ยังไม่ได้เป็น Approver" (เพื่อรอแต่งตั้ง)
export const getCandidates = async (req, res) => {
  try {
    const { branch, department } = req.query;
    
    // ดึงเฉพาะพนักงานทั่วไป (role_id = 1) เท่านั้น (ไม่ดึง admin หรือ approver มาซ้ำ)
    let query = `
      SELECT id, id_employee, firstname, lastname, position, department 
      FROM Users 
      WHERE role_id = 1 
    `;
    const params = [];

    // กรองตามสาขาและแผนกที่หน้าเว็บส่งมา
    if (branch) {
      query += ` AND branch_id = ?`; //  แก้เป็น branch_id ให้ตรงกับ DB
      params.push(branch);
    }
    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ดึงรายชื่อคนที่เป็น Approver อยู่แล้วในปัจจุบัน
export const getApprovers = async (req, res) => {
  try {
    // JOIN ตาราง Users กับ branch เพื่อเอาชื่อสาขามาโชว์ให้สวยงาม (ดึงเฉพาะ role_id = 2)
    const [rows] = await db.execute(`
      SELECT u.id, u.id_employee, u.firstname, u.lastname, u.position, u.department, b.name AS branch_name 
      FROM Users u 
      LEFT JOIN branch b ON u.branch_id = b.id  --  แก้เป็น u.branch_id ให้ตรงกับ DB
      WHERE u.role_id = 2
      ORDER BY b.id ASC, u.department ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// แต่งตั้งให้เป็น Approver (เปลี่ยน role_id เป็น 2)
export const assignApprover = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`UPDATE Users SET role_id = 2 WHERE id = ?`, [id]);
    res.json({ message: "แต่งตั้งเป็นผู้อนุมัติเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ถอดถอนจากการเป็น Approver (เปลี่ยน role_id กลับเป็น 1 คือ User ธรรมดา)
export const revokeApprover = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`UPDATE Users SET role_id = 1 WHERE id = ?`, [id]);
    res.json({ message: "ถอดถอนสิทธิ์ผู้อนุมัติเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};