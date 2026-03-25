import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    // ฟ้อนเอนส่ง token ในนามนัง authorization เราก็แค่ไปถอดออกแล้วก็เตรียมนางให้พร้อมสำหรับการตรวจสอบ token
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // ตรงนี้ .split('') ส่วน bearer ออกตรวจแค่ token พอ


    if (!token) {
        return res.status(401).json({ message: 'login first !' })
    }

    // กรณีรอดมี token มาให้เช็ต
    try {
        // check (ตัว token มันถูกสร้างจาก process.env.JWT_SECRET ด้วยเลยฟีลเหมือนเช็คว่ามาจากตัวแม่พิมพ์นี้จริงรึเปล่าไรเงี้ย)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // ถ้า check ผ่าน จะเอาข้อมูล user แปะไปใน req ด้วย
        req.user = decoded
        
        next() // ไปกันต่อคุนแม่ ตามประสา middleware

    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' })
    }
}