import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });


let attendanceDB = [];

/*check in*/ 
export const checkIn = [
  upload.single("photo"),
  (req, res) => {
    try {
      const { lat, lng } = req.body;
      const photo = req.file;

      if (!lat || !lng || !photo) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
      }

      const now = new Date();

      /*เวลาเข้างาน 09:00*/ 
      const workStart = new Date();
      workStart.setHours(9, 0, 0, 0);

      const status = now > workStart ? "late" : "ontime";

      const data = {
        id: Date.now(),
        type: "checkin",
        lat,
        lng,
        time: now,
        status,
        photo: photo.buffer,
      };

      attendanceDB.push(data);

      res.json({
        message: "เช็คอินสำเร็จ",
        status,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

/*check out*/ 
export const checkOut = [
  upload.single("photo"),
  (req, res) => {
    try {
      const { lat, lng } = req.body;
      const photo = req.file;

      if (!lat || !lng || !photo) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
      }

      const now = new Date();

  /*เวลาเลิกงาน 18:00*/ 
      const workEnd = new Date();
      workEnd.setHours(18, 0, 0, 0);

      const status = now < workEnd ? "early" : "normal";

      const data = {
        id: Date.now(),
        type: "checkout",
        lat,
        lng,
        time: now,
        status,
        photo: photo.buffer,
      };

      attendanceDB.push(data);

      res.json({
        message: "เช็คเอาท์สำเร็จ",
        status,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

/*history*/
export const getHistory = (req, res) => {
  try {
    res.json(attendanceDB);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*status*/
export const getStatus = (req, res) => {
  try {
    const today = new Date().toDateString();

    const todayRecords = attendanceDB.filter(
      (item) => new Date(item.time).toDateString() === today
    );

    let checkIn = todayRecords.find((i) => i.type === "checkin");
    let checkOut = todayRecords.find((i) => i.type === "checkout");

    res.json({
      checkIn: checkIn?.status || null,
      checkOut: checkOut?.status || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};