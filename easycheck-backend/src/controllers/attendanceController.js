import multer from "multer";

// ---------- upload ----------
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ---------- check in ----------
export const checkIn = async (req, res) => {
  try {
    const { lat, lng, userId } = req.body;

    if (!lat || !lng || !userId || !req.file) {
      return res.status(400).json({
        message: "ข้อมูลไม่ครบ",
      });
    }

    res.json({
      message: "เช็คอินสำเร็จ",
      status: "ontime",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- check out ----------
export const checkOut = async (req, res) => {
  try {
    const { lat, lng, userId } = req.body;

    if (!lat || !lng || !userId || !req.file) {
      return res.status(400).json({
        message: "ข้อมูลไม่ครบ",
      });
    }

    res.json({
      message: "เช็คเอาท์สำเร็จ",
      status: "normal",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- history ----------
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "ไม่พบ userId" });
    }

    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- approve ----------
export const approveAttendance = async (req, res) => {
  try {
    res.json({ message: "อนุมัติเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- reject ----------
export const rejectAttendance = async (req, res) => {
  try {
    res.json({ message: "ปฏิเสธเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};