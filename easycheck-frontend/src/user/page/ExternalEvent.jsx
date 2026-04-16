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
            <div className="d-flex justify-content-between align-items-center text-white mt-16 px-4">
                <Link to="/event" className='text-decoration-none'>
                    <Button variant="link" className="p-0 border-0">
                        <i className="bi bi-chevron-left fs-4 text-white"></i>
                    </Button>
                </Link>

                <h3 className="text-white text-center fw-bold mb-0">Corporate <br /> External event</h3>
                <div style={{ width: '24px' }}></div> {/* Spacer เพื่อให้หัวข้ออยู่กลางเป๊ะ */}
            </div>

            {/* หัวข้อ + กล่องงาน event */}
            <div className="mt-5 px-3">
                {exevents.map((exevent) => {
                    const canRegisterNow = canRegister(exevent.register_start, exevent.register_end) // เอาวันที่เปิดลงทะเบียนกับวันที่ปิดมาคำนวณใน canRegister
                    const isUpcoming = isEventUpcoming(exevent.event_date)

                    return (
                        <Card key={exevent.id} className="mb-4 border-0 shadow-lg transform transition-all duration-300 hover:-translate-y-1"
                            style={{ 
                                borderRadius: '30px',
                                background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                                opacity: isUpcoming ? 1 : 0.7 
                            }}>

                            <Card.Body className="p-4">
                                <div className="d-flex align-items-start mb-3">

                                    {/* icon ใหญ่ */}
                                    <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-4 shadow-sm"
                                        style={{ width: '55px', height: '55px', backgroundColor: '#636CCB', color: 'white' }}>
                                        <i className={`bi ${exevent.icon || 'bi-calendar-event'} fs-4`}></i>
                                    </div>

                                    {/* เนื้อหาข้างบน */}
                                    <div className="flex-grow-1">

                                        {/* ชื่ออีเว้น */}
                                        <Card.Title className="h5 mb-2 text-dark">
                                            <span className="fw-bold">{exevent.title}</span>

                                            {/* กรณีที่อีเว้นจบแล้ว */}
                                            {!isUpcoming && (
                                                <span className="badge rounded-pill bg-dark ms-2 small">จบแล้ว</span>
                                            )}
                                        </Card.Title>

                                        {/* รายละเอียดอีเว้น */}
                                        <div className="text-muted small">
                                            <div className="mb-1"><i className="bi bi-calendar3 me-2 text-[#636CCB]"></i>{exevent.date_thai || formatDate(exevent.event_date)}</div>
                                            <div className="mb-1"><i className="bi bi-clock me-2 text-[#636CCB]"></i>{exevent.event_time}</div>
                                            <div><i className="bi bi-geo-alt me-2 text-[#636CCB]"></i>{exevent.location}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* รายละเอียดเพิ่มเติมที่แสดงเต็มความกว้าง */}
                                <div className="w-100">
                                    {/* แสดงจำนวนผู้เข้าร่วมสูงสุด */}
                                    {exevent.max_participants > 0 && (
                                        <div className="small mb-2 p-2 rounded-3 bg-white bg-opacity-50 border border-gray-100">
                                            <i className="bi bi-people-fill me-2 text-[#636CCB]"></i>
                                            <span className="fw-medium text-dark">รับจำนวน: {exevent.max_participants} คน</span>
                                            {exevent.current_participants !== undefined && (
                                                <span className="ms-2 text-muted text-xs">
                                                    (ลงทะเบียนแล้ว {exevent.current_participants} คน)
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* วันที่ลงทะเบียน */}
                                    <div className="small text-muted mb-3 italic px-1" style={{ fontSize: '0.75rem' }}>
                                        <i className="bi bi-info-circle me-1"></i>
                                        เปิดลงทะเบียน: {formatDate(exevent.register_start)} - {formatDate(exevent.register_end)}
                                    </div>

                                    {/* ส่วนของปุ่มที่ขยายเต็มความกว้าง */}
                                    <div className="d-flex flex-column gap-2 pt-3 border-top">
                                        <div className="text-center">
                                            {canRegisterNow ? (
                                                <span className="badge rounded-pill w-100 py-2 bg-success bg-opacity-10 text-success border border-success border-opacity-25">เปิดลงทะเบียน</span>
                                            ) : currentDate < new Date(exevent.register_start) ? (
                                                <span className="badge rounded-pill w-100 py-2 bg-warning bg-opacity-10 text-dark border border-warning border-opacity-25">ยังไม่เปิดลงทะเบียน</span>
                                            ) : (
                                                <span className="badge rounded-pill w-100 py-2 bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">ปิดลงทะเบียนแล้ว</span>
                                            )}
                                        </div>

                                        {/* ปุ่มลงทะเบียน */}
                                        {canRegisterNow && isUpcoming ? (
                                            <Link to="/exregister" className='text-decoration-none w-100'
                                                state={{ 
                                                    selectedEvent: exevent.title,
                                                    event: exevent 
                                                }}>
                                                <Button className='text-white fw-bold shadow-sm w-100'
                                                    style={{ backgroundColor: '#636CCB', border: 'none', padding: '0.75rem', fontSize: '0.9rem', borderRadius: '20px' }}>
                                                    REGISTER NOW
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                className='text-white fw-bold w-100'
                                                style={{ backgroundColor: '#adb5bd', border: 'none', padding: '0.75rem', fontSize: '0.9rem', borderRadius: '20px' }}
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

export default ExternalEvent;