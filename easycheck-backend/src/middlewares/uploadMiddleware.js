import multer from 'multer'
import path from 'path' // path แต่ละยี่ห้อไม่เหมือนกัน ตัวนี้จะช่วยให้จะรันที่ mac,window ก็ไม่พัง


// ตั้งค่าการเก็บไฟล์สำหรับ multer ไม่งั้นมันจะเป็นแบบสุ่มซึ่งเราจะเอาไปใช้ต่อไม่ได้
// multer.diskStorage คือการกำหนด ที่เก็บ,ชื่อใหม่ ของไฟล์ที่ถูกอัพโหลดเข้ามา
const storage = multer.diskStorage({
    // destination = ปลายทางที่เก็บ
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/') // ให้เอาไฟล์ไปไว้ที่ uploads/avatars/ ตามที่เราเตรียมไว้
    },
    // filename = ชื่อใหม่
    filename: (req, file, cb) => {
        // Math.round(Math.random() * 1E9 ตรงนี้ยิ่งทำให้ชื่อไฟล์มันซ้ำกันยากขึ้นอีก Math.round ก็ปัดเศษเป้นจำนวนเต็มไป
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // 1E9 คือหนึ่งพันล้าน
        // avatar-รหัสผู้ใช้-เลขสุ่ม.นามสกุลไฟล์
        // ตรง req.user.id(id) มาจาก verifyToken แปลว่าตรง router ต้องใช้ verifyToken มาก่อน
        cb(null, `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`) // path.extname คือเอาแค่นามสกุลจาก file.originalname
    }
})

// check ว่าเป็นไฟล์รูปภาพรึเปล่า
const fileFilter = (req, file, cb) => {
    // ปกติไฟล์รุปภาพจะขึ้นต้นด้วย ('image/')
    if (file.mimetype.startsWith('image/')) { 
        cb(null, true) // เป็นรูปก็ผ่าน
    } 
    else {
        cb(new Error('Please upload only image files'), false)
    }
}

// รวมร่างทุกอย่างที่เขียนไว้แล้ว export
export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // จำกัดขนาด 2MB
})