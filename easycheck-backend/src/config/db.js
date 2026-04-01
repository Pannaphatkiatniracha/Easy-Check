import mysql from 'mysql2/promise'


// pool มันจะอารมณ์เหมือนตัวกลางเชื่อมให้ระบบเข้าถึงฐานข้อมูลได้ไวขึ้น
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3309, // port ของเราเองอันนี้
    user: process.env.DB_USER || 'root',           
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_DATA || 'easycheck',
    waitForConnections: true, // ^ เกิน 10 ให้รอ
    connectionLimit: 10, // ระบบจะคุยกับ db พร้อมกัน max สุด 10 คน
    queueLimit: 0 // 0 = unlimit คือรอไปเลยจ้าอันลิมิต
})

export default db