import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const InternalEvent = () => {
    const [currentDate, setCurrentDate] = useState(new Date())

    // อัพเดทวันให้เป็นวันปัจจุบันทุกวัน
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date()) // ให้ setInterval มัน setCurrentDate ให้เป็นวันปัจจุบันด้วย new Date()
        }, 24 * 60 * 60 * 1000) // ทุก 24 ชั่วโมง

        return () => clearInterval(timer)
    }, [])

    const inevents = [
        {
            id: 1,
            title: "อบรมความปลอดภัยในการทำงาน",
            date: "30 พฤศจิกายน 2568", // เป็น string ธรรมดาเอาไว้โชว์หน้าเว็บเฉย ๆ
            eventDate: new Date(2025, 10, 30), // อันนี้ใช้คำนวณได้จริงจย้าออนนี่ 🥰
            time: "09:00 - 12:00",
            location: "ห้องประชุมใหญ่ อาคาร A",
            icon: "bi-shield-check",
            registerStart: new Date(2025, 10, 1),
            registerEnd: new Date(2025, 10, 25)
        },
        {
            id: 2,
            title: "บริจาคโลหิตประจำปี",
            date: "1 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 1),
            time: "08:30 - 16:00",
            location: "ห้องประชุมกลาง ชั้น 3",
            icon: "bi-droplet",
            registerStart: new Date(2025, 10, 15),
            registerEnd: new Date(2025, 11, 1)
        },
        {
            id: 3,
            title: "Workshop การทำงานเป็นทีม",
            date: "5 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 5),
            time: "13:00 - 17:00",
            location: "ห้องอบรม อาคาร B",
            icon: "bi-people",
            registerStart: new Date(2025, 10, 20),
            registerEnd: new Date(2025, 11, 3)
        },
        {
            id: 4,
            title: "อบรมการใช้ซอฟต์แวร์ใหม่",
            date: "10 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 10),
            time: "10:00 - 15:00",
            location: "ห้องคอมพิวเตอร์ ชั้น 2",
            icon: "bi-laptop",
            registerStart: new Date(2025, 10, 25),
            registerEnd: new Date(2025, 11, 8)
        },
        {
            id: 5,
            title: "กิจกรรมสร้างความสัมพันธ์พนักงาน",
            date: "15 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 15),
            time: "16:00 - 19:00",
            location: "สวนหย่อม อาคาร A",
            icon: "bi-heart",
            registerStart: new Date(2025, 10, 1),
            registerEnd: new Date(2025, 11, 10)
        },
        {
            id: 6,
            title: "งานเปิดตัวสินค้า",
            date: "20 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 20),
            time: "14:00 - 17:30",
            location: "ห้องประชุม C",
            icon: "bi-megaphone",
            registerStart: new Date(2025, 10, 15),
            registerEnd: new Date(2025, 11, 18)
        },
        {
            id: 7,
            title: "อบรมเทคนิคการสื่อสารภายในองค์กร",
            date: "8 มกราคม 2569",
            eventDate: new Date(2026, 0, 8),
            time: "09:30 - 16:30",
            location: "ห้องประชุมใหญ่ อาคาร A",
            icon: "bi-chat-dots",
            registerStart: new Date(2025, 11, 1),
            registerEnd: new Date(2026, 0, 5)   // มกราคม = 0
        },
        {
            id: 8,
            title: "กิจกรรมกีฬาเพื่อสุขภาพ",
            date: "12 มกราคม 2569",
            eventDate: new Date(2026, 0, 12),
            time: "08:00 - 11:00",
            location: "สนามกีฬาในบริษัท",
            icon: "bi-activity",
            registerStart: new Date(2025, 11, 15),
            registerEnd: new Date(2026, 0, 10)
        },
        {
            id: 9,
            title: "Workshop การแก้ไขปัญหาเชิงสร้างสรรค์",
            date: "13 มกราคม 2569",
            eventDate: new Date(2026, 0, 13),
            time: "13:30 - 16:30",
            location: "ห้องอบรม อาคาร B",
            icon: "bi-lightbulb",
            registerStart: new Date(2025, 11, 20),
            registerEnd: new Date(2026, 0, 10)
        },
        {
            id: 10,
            title: "งานเลี้ยงบริษัท",
            date: "14 มกราคม 2569",
            eventDate: new Date(2026, 0, 14),
            time: "18:00 - 21:00",
            location: "ห้องประชุมใหญ่ อาคาร A",
            icon: "bi-cup-straw",
            registerStart: new Date(2025, 11, 1),
            registerEnd: new Date(2026, 0, 12)
        },
    ]

    // เช็คว่าลงทะเบียนได้ไหม
    const canRegister = (registerStart, registerEnd) => {
        const today = currentDate
        return today >= registerStart && today <= registerEnd
    }

    // ฟังก์ชันนี้มันเช็คว่าอีเว้นมันผ่านไปรึยัง
    const isEventUpcoming = (eventDate) => {
        return currentDate <= eventDate
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('th-TH', {
            day: 'numeric', // ให้แสดงวันเป็นตัวเลข
            month: 'long', // ให้แสดงชื่อเดือนเต็ม
            year: 'numeric' // ให้แสดงปีเป็นตัวเลขสี่หลัก
        })
    }

    return (
        <div className='app-container'>

            {/* หัวข้อ + icon */}
            <div className="d-flex justify-content-between text-warning mt-16">
                <Link to="/event" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="text-white text-center fw-bold">Corporate <br /> Internal event</h3>
                <div className="me-4"></div>
            </div>

            {/* หัวข้อ + กล่องงาน event */}
            <div className="mt-4 px-3">
                {inevents.map((inevent) => {
                    const canRegisterNow = canRegister(inevent.registerStart, inevent.registerEnd)
                    const isUpcoming = isEventUpcoming(inevent.eventDate)

                    return (
                        <Card key={inevent.id} className="mb-3 rounded-3 text-black hover:scale-105 transition-all duration-200 ease-in-out"
                            style={{ backgroundColor: '#D9D9D9', opacity: isUpcoming ? 1 : 0.6 }}>

                            <Card.Body className="p-3">
                                <div className="d-flex align-items-start">

                                    {/* icon ใหญ่ */}
                                    <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: '45px', height: '45px', backgroundColor: 'white', opacity: 0.9 }}>
                                        <i className={`bi ${inevent.icon} fs-5 text-[#6D29F6]`}></i>
                                    </div>

                                    {/* เนื้อหา */}
                                    <div className="flex-grow-1">

                                        {/* ชื่ออีเว้น */}
                                        <Card.Title className="h6 mb-2">
                                            <b>{inevent.title}</b>

                                            {/* กรณีที่อีเว้นจบแล้ว */}
                                            {!isUpcoming && (
                                                <span className="badge bg-secondary ms-2">จบแล้ว</span>
                                            )}
                                        </Card.Title>

                                        {/* รายละเอียดอีเว้น */}
                                        <Card.Text className="small mb-2">
                                            <i className="bi bi-calendar3 me-1"></i> วันที่: {inevent.date} <br />
                                            <i className="bi bi-clock me-1"></i> เวลา: {inevent.time} <br />
                                            <i className="bi bi-geo-alt me-1"></i> สถานที่: {inevent.location}
                                        </Card.Text>

                                        {/* วันที่ลงทะเบียน */}
                                        <div className="small text-muted mb-2">
                                            <i className="bi bi-calendar-check me-1"></i>
                                            ลงทะเบียนได้: {formatDate(inevent.registerStart)} - {formatDate(inevent.registerEnd)}
                                        </div>

                                        {/* สถานะการลงทะเบียน */}
                                        <div className="mb-2">
                                            {canRegisterNow ? (
                                                <span className="badge bg-success">เปิดลงทะเบียน</span>
                                            ) : currentDate < inevent.registerStart ? (
                                                <span className="badge bg-warning text-dark">ยังไม่เปิดลงทะเบียน</span>
                                            ) : (
                                                <span className="badge bg-danger">ปิดลงทะเบียนแล้ว</span>
                                            )}
                                        </div>

                                        {/* ปุ่มลงทะเบียน */}
                                        {canRegisterNow && isUpcoming ? (
                                            <Link 
                                                to="/inregister" 
                                                className='text-decoration-none'
                                                state={{ 
                                                    event: inevent,
                                                    // เพิ่มข้อมูลที่จำเป็นสำหรับการลงทะเบียน
                                                    registrationData: {
                                                        eventTitle: inevent.title,
                                                        eventDate: inevent.date,
                                                        eventTime: inevent.time,
                                                        eventLocation: inevent.location,
                                                        eventIcon: inevent.icon,
                                                        // เพิ่มข้อมูลวันที่สำหรับฟิลด์ Registration date
                                                        currentDate: new Date().toISOString().split('T')[0] // วันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
                                                    }
                                                }}
                                            >
                                                <Button className='text-white mt-1 fw-semibold'
                                                    style={{ backgroundColor: '#636CCB', border: 'none', padding: '0.375rem 1.25rem', fontSize: '0.8rem', borderRadius: '20px' }}>
                                                    REGISTER
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                className='text-white mt-1 fw-semibold'
                                                style={{ backgroundColor: '#6c757d', border: 'none', padding: '0.375rem 1.25rem', fontSize: '0.8rem', borderRadius: '20px' }}
                                                disabled
                                            >
                                                {!isUpcoming ? 'EVENT ENDED' : 'REGISTRATION CLOSED'}
                                            </Button>
                                        )}

                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default InternalEvent