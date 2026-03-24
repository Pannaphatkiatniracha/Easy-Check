import mysql from 'mysql2/promise'


// pool มันจะอารมณ์เหมือนตัวกลางเชื่อมให้ระบบเข้าถึงฐานข้อมูลได้ไวขึ้น
const db = mysql.createPool({
    host: 'localhost',      
    port: 3309, // port ของเราเองอันนี้
    user: 'root',           
    password: 'root',
    database: 'easycheck',
    waitForConnections: true, // ^ เกิน 10 ให้รอ
    connectionLimit: 10, // ระบบจะคุยกับ db พร้อมกัน max สุด 10 คน
    queueLimit: 0 // 0 = unlimit คือรอไปเลยจ้าอันลิมิต
})

export default db