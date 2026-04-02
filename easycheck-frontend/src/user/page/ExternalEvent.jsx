import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Api from '../../Api';

const ExternalEvent = () => {

    const [currentDate, setCurrentDate] = useState(new Date()) // เก็บเวลาปัจจุบันมันจะได้รู้ว่าเลยเวลาลงทะเบียนยัง
    const [exevents, setExevents] = useState([]) // สร้าง State ไว้เก็บข้อมูลจาก Database

    // อัพเดทวันให้เป็นวันปัจจุบันทุกวัน
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date()) // ให้ setInterval มัน setCurrentDate ให้เป็นวันปัจจุบันด้วย new Date()
        }, 24 * 60 * 60 * 1000) // ทุก 24 ชั่วโมง

        return () => clearInterval(timer)
    }, [])


    
    useEffect(() => {
        const fetchExternalEvents = async () => {
            try {
                const response = await Api.get('/events/all')

                // เอาแต่ external
                const externalOnly = response.data.filter(ev => ev.type === 'external')
                setExevents(externalOnly)
            } catch (err) {
                console.error("Error fetching external events:", err)
            }
        }
        fetchExternalEvents()
    }, [])


    // เช็คว่าลงทะเบียนได้ไหม
    const canRegister = (registerStart, registerEnd) => {
        const today = currentDate
        // แปลง string จาก db ให้เป็น Date Object ก่อนคำนวณ
        const start = new Date(registerStart)
        const end = new Date(registerEnd)
        return today >= start && today <= end
    }

    // ฟังก์ชันนี้มันเช็คว่าอีเว้นมันผ่านไปรึยัง
    const isEventUpcoming = (eventDate) => {
        return currentDate <= new Date(eventDate)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "" // ถ้าไม่มีข้อมูลมาก็ไม่ต้องแสดงอะไร

        const date = new Date(dateString)
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
                    const canRegisterNow = canRegister(exevent.register_start, exevent.register_end) // เอาวันที่เปิดลงทะเบียนกับวันที่ปิดมาคำนวณใน canRegister
                    const isUpcoming = isEventUpcoming(exevent.event_date)

                    return (
                        <Card key={exevent.id} className="mb-3 rounded-3 text-black hover:scale-105 transition-all duration-200 ease-in-out"
                            style={{ backgroundColor: '#D9D9D9', opacity: isUpcoming ? 1 : 0.6 }}>

                            <Card.Body className="p-3">
                                <div className="d-flex align-items-start">

                                    {/* icon ใหญ่ */}
                                    <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: '45px', height: '45px', backgroundColor: 'white', opacity: 0.9 }}>
                                        <i className={`bi ${exevent.icon || 'bi-calendar-event'} fs-5 text-[#6D29F6]`}></i>
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
                                            <i className="bi bi-calendar3 me-1"></i> วันที่: {exevent.date_thai || formatDate(exevent.event_date)} <br />
                                            <i className="bi bi-clock me-1"></i> เวลา: {exevent.event_time} <br />
                                            <i className="bi bi-geo-alt me-1"></i> สถานที่: {exevent.location}
                                        </Card.Text>

                                        {/* วันที่ลงทะเบียน */}
                                        <div className="small text-muted mb-2">
                                            <i className="bi bi-calendar-check me-1"></i>
                                            ลงทะเบียนได้: {formatDate(exevent.register_start)} - {formatDate(exevent.register_end)}
                                        </div>

                                        {/* สถานะการลงทะเบียน */}
                                        <div className="mb-2">
                                            {canRegisterNow ? (
                                                <span className="badge bg-success">เปิดลงทะเบียน</span>
                                            ) : currentDate < new Date(exevent.register_start) ? (
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