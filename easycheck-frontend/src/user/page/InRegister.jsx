import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Api from '../../Api';

const InRegister = ({ role }) => {

    const location = useLocation()  // รับข้อมูลจาก state
    const navigate = useNavigate()  // สำหรับ redirect หลังจากลงทะเบียนสำเร็จ
    const selectedEvent = location.state?.event  //  ข้อมูล event ที่เลือก
    const registrationData = location.state?.registrationData // รับข้อมูลเพิ่มเติมสำหรับการลงทะเบียน

    const [showModal, setShowModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false) // สร้าง Modal สำหรับ Error แยกออกมา
    const [errorMessage, setErrorMessage] = useState("") // เก็บข้อความ Error
    const [notes, setNotes] = useState("") // State สำหรับเก็บหมายเหตุเพิ่มเติม
    const [registrationDate, setRegistrationDate] = useState("") // State สำหรับวันที่ลงทะเบียน
    
    const [user, setUser] = useState({
        name: "", //ค่าตั้งต้น
        userid: "",
        position: "",
        department: "",
        branch: "",
        events: registrationData?.eventTitle || selectedEvent?.title || ""  // ใช้ข้อมูลจาก registrationData ก่อน
    })

    // ตอนรันเว็บครั้งแรกให้ไปดึงข้อมูลโปรไฟล์ผู้ใช้จาก Backend จริง
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await Api.get('/users/profile')
                const data = response.data
                
                // เช็คก่อนว่าแบคเอนส่งชื่อสาขามามั้ย ถ้าส่งมาเป็นเลขก็ฟีลเหมือนแปลงมาให้
                const branchName = data.name || 
                    (data.branch_id === 1 ? "Bangkok" 
                        : data.branch_id === 2 ? "Chiang Mai" 
                        : data.branch_id === 3 ? "Phuket" 
                        : data.branch_id === 4 ? "Chonburi" 
                        : "Khon Kaen")
                
                setUser({
                    name: `${data.firstname || ''} ${data.lastname || ''}`.trim() || data.name || "",
                    userid: data.id_employee || "",
                    position: data.position || "",
                    department: data.department || "",
                    branch: branchName,
                    events: registrationData?.eventTitle || selectedEvent?.title || ""
                })
            } catch (error) {
                console.error("Error loading user profile:", error)
                setErrorMessage(error.response?.data?.message || "Could not load profile data")
                setShowErrorModal(true)
            }
        }
        loadUserProfile()

        // ตั้งค่าวันที่ลงทะเบียนเป็นวันที่ปัจจุบัน
        if (registrationData?.currentDate) {
            setRegistrationDate(registrationData.currentDate)
        } else {
            setRegistrationDate(new Date().toISOString().split('T')[0])
        }
    }, [selectedEvent, registrationData])   //ทำครั้งเดียวตอนหน้าเว็บโหลด


    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
        try {
            const response = await Api.post(`/events/${selectedEvent.id}/register`, { 
                notes: notes
            })
            
            if (response.data.success) {
                setShowModal(true)
            }
        } catch (error) {
            console.error("Error saving registration:", error)
            const errorMsg = error.response?.data?.message || "Failed to save data"
            setErrorMessage(errorMsg)
            setShowErrorModal(true)
        }
    }

    // ปิด modal แล้วให้ redirect ไปหน้า internalevent
    const handleCloseModal = () => {
        setShowModal(false)
        navigate('/internalevent')
    }


    // ใช้ข้อมูลจาก registrationData ก่อน ถ้าไม่มีค่อยใช้ selectedEvent
    const eventTitle = registrationData?.eventTitle || selectedEvent?.title
    const eventDate = registrationData?.eventDate || selectedEvent?.date_thai || selectedEvent?.event_date
    const eventTime = registrationData?.eventTime || selectedEvent?.event_time
    const eventLocation = registrationData?.eventLocation || selectedEvent?.location
    const eventIcon = registrationData?.eventIcon || selectedEvent?.icon



    const UserPage = (
        <div className='app-container'>

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                <Link to="/internalevent" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold">Register to</h3>
                    <h5 className="text-white mb-0">{eventTitle}</h5>
                </div>

                <div className="me-4"></div>
            </div>

            {/* รายละเอียดต่าง ๆ ของ event */}
            <div className="mt-5 px-3">
                <Card className="mb-4 border-0 shadow-lg"
                    style={{ 
                        borderRadius: '30px',
                        background: 'linear-gradient(145deg, #ffffff, #e6e6e6)'
                    }}>
                    <Card.Body className="p-4">

                        <div className="d-flex align-items-start mb-3">

                            <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-4 shadow-sm"
                                style={{ width: '55px', height: '55px', backgroundColor: '#636CCB', color: 'white' }}>
                                <i className={`bi ${eventIcon || 'bi-calendar-event'} fs-4`}></i>
                            </div>

                            <div className="flex-grow-1">

                                <div className="h5 mb-2 text-dark fw-bold">
                                    {eventTitle}
                                </div>

                                <div className="text-muted small">
                                    <div className="mb-1">
                                        <i className="bi bi-calendar3 me-2 text-[#636CCB]"></i>
                                        {eventDate}
                                    </div>
                                    <div className="mb-1">
                                        <i className="bi bi-clock me-2 text-[#636CCB]"></i>
                                        {eventTime}
                                    </div>
                                    <div className="mb-1">
                                        <i className="bi bi-geo-alt me-2 text-[#636CCB]"></i>
                                        {eventLocation}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </Card.Body>
                </Card>
            </div>

            {/* ดึงข้อมูลเดิมมา */}
            <div className="d-flex flex-column align-items-center mt-6">

                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label">Employee ID</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        value={user.userid} readOnly />
                </div>

                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label">Name</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        value={user.name} readOnly />
                </div>

                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label">Position</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        value={user.position} readOnly />
                </div>

                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label">Department</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        value={user.department} readOnly />
                </div>

                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label">Branch</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        value={user.branch} readOnly />
                </div>

                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label">Additional Notes</label>
                    <textarea
                        className="rounded-1 form-control fw-semibold"
                        rows="3"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

            </div>

            <div className='text-center mt-12 mb-12'>
                <Button className='rounded-5 w-50 fw-semibold'
                    style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleSave}>
                    DONE
                </Button>
            </div>

            <Modal size="sm" show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                    <h5 className="fw-bold mt-2">You're registered!</h5>
                    <p><i>{user.name}</i> registered for<br />{eventTitle}</p>
                </Modal.Body>
            </Modal>

            <Modal size="sm" show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-exclamation-circle-fill fs-1 text-danger"></i>
                    <h5 className="fw-bold mt-2">Registration Failed</h5>
                    <p className="text-secondary small">{errorMessage}</p>
                    <Button variant="secondary" size="sm"
                        onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Body>
            </Modal>

        </div>
    )

    return UserPage
}

export default InRegister