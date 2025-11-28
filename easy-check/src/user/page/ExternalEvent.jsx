import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ExternalEvent = () => {

    const [currentDate, setCurrentDate] = useState(new Date())

    // อัพเดทวันให้เป็นวันปัจจุบันทุกวัน
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date()) // ให้ setInterval มัน setCurrentDate ให้เป็นวันปัจจุบันด้วย new Date()
        }, 24 * 60 * 60 * 1000) // ทุก 24 ชั่วโมง

        return () => clearInterval(timer)
    }, [])

    const exevents = [
        {
            id: 1,
            title: "งานวิ่งการกุศลประจำปี",
            date: "2 พฤศจิกายน 2568", // เป็น string ธรรมดาเอาไว้โชว์หน้าเว็บเฉย ๆ
            eventDate: new Date(2025, 10, 2), // อันนี้ใช้คำนวณได้จริงจย้าออนนี่ 🥰
            time: "06:00 - 10:00",
            location: "สวนสาธารณะเมือง",
            icon: "bi-activity",
            registerStart: new Date(2025, 9, 1),  // เริ่ม 1 ต.ค. 2025
            registerEnd: new Date(2025, 10, 1)    // ปิด 1 พ.ย. 2025
        },
        {
            id: 2,
            title: "สัมมนาเทรนด์ธุรกิจปี 2025",
            date: "8 พฤศจิกายน 2568",
            eventDate: new Date(2025, 10, 8),
            time: "09:00 - 17:00",
            location: "โรงแรม Grand Palace",
            icon: "bi-graph-up",
            registerStart: new Date(2025, 9, 15), // เริ่ม 15 ต.ค. 2025
            registerEnd: new Date(2025, 10, 5)    // ปิด 5 พ.ย. 2025
        },
        {
            id: 3,
            title: "กิจกรรม CSR ร่วมกับชุมชน",
            date: "12 พฤศจิกายน 2568",
            eventDate: new Date(2025, 10, 12),
            time: "08:30 - 15:30",
            location: "โรงเรียนบ้านหนองบัว",
            icon: "bi-heart",
            registerStart: new Date(2025, 9, 20), // เริ่ม 20 ต.ค. 2025
            registerEnd: new Date(2025, 10, 10)   // ปิด 10 พ.ย. 2025
        },
        {
            id: 4,
            title: "ประชุมผู้ถือหุ้นประจำปี",
            date: "18 พฤศจิกายน 2568",
            eventDate: new Date(2025, 10, 18),
            time: "13:00 - 16:30",
            location: "โรงแรม The Plaza",
            icon: "bi-people",
            registerStart: new Date(2025, 9, 1),  // เริ่ม 1 ต.ค. 2025
            registerEnd: new Date(2025, 10, 15)   // ปิด 15 พ.ย. 2025
        },
        {
            id: 5,
            title: "อบรมเทคนิคการตลาดดิจิทัล",
            date: "22 พฤศจิกายน 2568",
            eventDate: new Date(2025, 10, 22),
            time: "10:00 - 16:00",
            location: "ศูนย์ฝึกอบรม AIA Tower",
            icon: "bi-laptop",
            registerStart: new Date(2025, 9, 25), // เริ่ม 25 ต.ค. 2025
            registerEnd: new Date(2025, 10, 20)   // ปิด 20 พ.ย. 2025
        },
        {
            id: 6,
            title: "งานแสดงสินค้าและนวัตกรรม",
            date: "27 พฤศจิกายน 2568",
            eventDate: new Date(2025, 10, 27),
            time: "10:00 - 18:00",
            location: "ศูนย์ประชุมแห่งชาติสิริกิติ์",
            icon: "bi-lightbulb",
            registerStart: new Date(2025, 9, 15), // เริ่ม 15 ต.ค. 2025
            registerEnd: new Date(2025, 10, 25)   // ปิด 25 พ.ย. 2025
        },
        {
            id: 7,
            title: "ทริป Team Building กลางแจ้ง",
            date: "3 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 3),
            time: "07:00 - 19:00",
            location: "เขาใหญ่ รีสอร์ท",
            icon: "bi-tree",
            registerStart: new Date(2025, 10, 1),  // เริ่ม 1 พ.ย. 2025
            registerEnd: new Date(2025, 11, 1)     // ปิด 1 ธ.ค. 2025
        },
        {
            id: 8,
            title: "Workshop การพัฒนาทักษะผู้นำ",
            date: "6 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 6),
            time: "09:30 - 16:30",
            location: "โรงแรม Bangkok Marriott",
            icon: "bi-award",
            registerStart: new Date(2025, 10, 15), // เริ่ม 15 พ.ย. 2025
            registerEnd: new Date(2025, 11, 3)     // ปิด 3 ธ.ค. 2025
        },
        {
            id: 9,
            title: "งานเทศกาลอาหารและวัฒนธรรม",
            date: "12 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 12),
            time: "16:00 - 22:00",
            location: "ตลาดนัดกลางแจ้ง เซ็นทรัลเวิลด์",
            icon: "bi-egg-fried",
            registerStart: new Date(2025, 10, 20), // เริ่ม 20 พ.ย. 2025
            registerEnd: new Date(2025, 11, 10)    // ปิด 10 ธ.ค. 2025
        },
        {
            id: 10,
            title: "งานเลี้ยงสังสรรค์ปีใหม่บริษัท",
            date: "20 ธันวาคม 2568",
            eventDate: new Date(2025, 11, 20),
            time: "18:30 - 22:00",
            location: "โรงแรม The St. Regis Bangkok",
            icon: "bi-cup-straw",
            registerStart: new Date(2025, 10, 1),  // เริ่ม 1 พ.ย. 2025
            registerEnd: new Date(2025, 11, 15)    // ปิด 15 ธ.ค. 2025
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
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/event" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="text-white text-center fw-bold">Corporate <br /> External event</h3>
                <div className="me-4"></div>
            </div>

            {/* หัวข้อ + กล่องงาน event */}
            <div className="mt-4 px-3">
                {exevents.map((exevent) => {
                    const canRegisterNow = canRegister(exevent.registerStart, exevent.registerEnd);
                    const isUpcoming = isEventUpcoming(exevent.eventDate);

                    return (
                        <Card key={exevent.id} className="mb-3 rounded-3 text-black hover:scale-105 transition-all duration-200 ease-in-out"
                            style={{ backgroundColor: '#D9D9D9', opacity: isUpcoming ? 1 : 0.6 }}>

                            <Card.Body className="p-3">
                                <div className="d-flex align-items-start">

                                    {/* icon ใหญ่ */}
                                    <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: '45px', height: '45px', backgroundColor: 'white', opacity: 0.9 }}>
                                        <i className={`bi ${exevent.icon} fs-5 text-[#6D29F6]`}></i>
                                    </div>

                                    {/* เนื้อหา */}
                                    <div className="flex-grow-1">

                                        {/* ชื่ออีเว้น */}
                                        <Card.Title className="h6 mb-2">
                                            <b>{exevent.title}</b>

                                            {/* กรณีที่อีเว้นจบแล้ว */}
                                            {!isUpcoming && (
                                                <span className="badge bg-secondary ms-2">จบแล้ว</span>
                                            )}
                                        </Card.Title>

                                        {/* รายละเอียดอีเว้น */}
                                        <Card.Text className="small mb-2">
                                            <i className="bi bi-calendar3 me-1"></i> วันที่: {exevent.date} <br />
                                            <i className="bi bi-clock me-1"></i> เวลา: {exevent.time} <br />
                                            <i className="bi bi-geo-alt me-1"></i> สถานที่: {exevent.location}
                                        </Card.Text>

                                        {/* วันที่ลงทะเบียน */}
                                        <div className="small text-muted mb-2">
                                            <i className="bi bi-calendar-check me-1"></i>
                                            ลงทะเบียนได้: {formatDate(exevent.registerStart)} - {formatDate(exevent.registerEnd)}
                                        </div>

                                        {/* สถานะการลงทะเบียน */}
                                        <div className="mb-2">
                                            {canRegisterNow ? (
                                                <span className="badge bg-success">เปิดลงทะเบียน</span>
                                            ) : currentDate < exevent.registerStart ? (
                                                <span className="badge bg-warning text-dark">ยังไม่เปิดลงทะเบียน</span>
                                            ) : (
                                                <span className="badge bg-danger">ปิดลงทะเบียนแล้ว</span>
                                            )}
                                        </div>

                                        {/* ปุ่มลงทะเบียน */}
                                        {canRegisterNow && isUpcoming ? (
                                            <Link to="/exregister" className='text-decoration-none'
                                                state={{ 
                                                    selectedEvent: exevent.title,
                                                    event: exevent 
                                                }}>
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

export default ExternalEvent