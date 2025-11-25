import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AttendanceSum = ({ role }) => {
    
    const location = useLocation()
    const employeeData = location.state?.employeeData
    
    
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({ title: "", dates: [], color: "" })
    
    // State สำหรับเก็บข้อมูลผู้ใช้จาก API
    const [userProfile, setUserProfile] = useState({
        name: "",
        userid: "",
        avatar: ""
    })

    // ดึงข้อมูลผู้ใช้จาก API (สำหรับฝั่ง User)
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users/6")
                const data = await res.json()
                setUserProfile({
                    name: data.name || "",
                    userid: data.userid || "",
                    avatar: data.avatar || "/easycheck/img/an.jpg"
                })
            } catch (error) {
                console.error("Error loading user profile:", error)
            }
        }
        
        // ถ้าเป็น User และไม่มี employeeData จากหน้า DataCheck ให้โหลดข้อมูลจาก API
        if (role !== "approver" && !employeeData) {
            loadUserProfile()
        }
    }, [role, employeeData])

    // ฟังก์ชันดึงข้อมูลตาม employeeId
    const getAttendanceData = (employeeId) => {
        const attendanceMap = {
            "010889": {
                onTimes: [
                    "2025-10-01", "2025-10-02", "2025-10-03", "2025-10-06", "2025-10-07",
                    "2025-10-08", "2025-10-09", "2025-10-10", "2025-10-13", "2025-10-14",
                    "2025-10-15", "2025-10-16", "2025-10-17", "2025-10-20", "2025-10-21",
                    "2025-10-22", "2025-10-23", "2025-10-24", "2025-10-27", "2025-10-28",
                    "2025-10-29", "2025-10-30", "2025-10-31", "2025-10-04", "2025-10-11",
                    "2025-10-18"
                ],
                lates: [
                    "2025-10-05", "2025-10-12"
                ],
                leaves: [
                    "2025-10-19", "2025-10-25", "2025-10-26"
                ]
            },
            "010101": {
                onTimes: [
                    "2025-10-01", "2025-10-02", "2025-10-03", "2025-10-04", "2025-10-05",
                    "2025-10-06", "2025-10-07", "2025-10-08", "2025-10-09", "2025-10-10",
                    "2025-10-11", "2025-10-12", "2025-10-13", "2025-10-14", "2025-10-15",
                    "2025-10-16", "2025-10-17", "2025-10-18", "2025-10-19", "2025-10-20",
                    "2025-10-21", "2025-10-22", "2025-10-23", "2025-10-24", "2025-10-25",
                    "2025-10-26", "2025-10-27", "2025-10-28", "2025-10-29", "2025-10-30"
                ],
                lates: [
                    // ไม่มีมาสาย
                ],
                leaves: [
                    "2025-10-31"
                ]
            },
            "110400": {
                onTimes: [
                    "2025-10-01", "2025-10-02", "2025-10-03", "2025-10-06", "2025-10-07",
                    "2025-10-08", "2025-10-09", "2025-10-10", "2025-10-13", "2025-10-14",
                    "2025-10-15", "2025-10-16", "2025-10-17", "2025-10-20", "2025-10-21",
                    "2025-10-22", "2025-10-23", "2025-10-27", "2025-10-28", "2025-10-29"
                ],
                lates: [
                    "2025-10-04", "2025-10-11", "2025-10-24" 
                ],
                leaves: [
                    "2025-10-05", "2025-10-12", "2025-10-18", "2025-10-25", "2025-10-30", "2025-10-31"
                ]
            }
        }
        return attendanceMap[employeeId] || attendanceMap["010889"]
    }

    // ดึงข้อมูลพนักงานมาโชว์เป็น profile
    const attendanceData = employeeData ? 
        getAttendanceData(employeeData.employeeId) : 
        getAttendanceData(userProfile.userid)

    const onTimes = attendanceData.onTimes
    const lates = attendanceData.lates
    const leaves = attendanceData.leaves

    // ระเบิด array ตรงนี้คือการเอาข้อมูลใน array พวกนี้มารวมกัน
    const allRecords = [...onTimes, ...lates, ...leaves]


    // ฟังก์ชันเปิด Modal
    const openModal = (type) => {
        let data = {}
        switch (type) {
            case "ontime":
                data = { title: "On Time Details", dates: onTimes, color: "#1CA983" }
                break
            case "late":
                data = { title: "Late Details", dates: lates, color: "#D06356" }
                break
            case "leave":
                data = { title: "Leave Details", dates: leaves, color: "#C7C76E" }
                break
            case "all":
                data = { title: "All Records", dates: allRecords, color: "#252A46" }
                break
            default:
                return
        }
        setModalData(data)
        setShowModal(true)
    }


    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }


    // ตัวแสดงวันที่ใน Modal
    const DateGridModal = ({ dates, title, color }) => (
        <div>
            <h4 className="fw-bold mb-3 text-center">
                {title} <span className="badge bg-dark ms-2">{dates.length} วัน</span>
            </h4>

            <div className="row g-2">
                {dates.map((date, index) => (
                    <div key={index} className="col-6">
                        <div className="rounded-2 p-2 text-center shadow-sm"
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                            <small className="fw-semibold" style={{ color: color }}>{date}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )


    // profile พนักงาน
    const EmployeeProfile = employeeData ? (


        // ฝั่ง approver
        <div className='d-flex justify-content-center mt-6'>
            <div className="flex flex-col items-center w-80">
                <img
                    src={employeeData.profile}
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover mb-3"/>
                <div className="text-white font-semibold fs-5 text-center">
                    {employeeData.name}
                </div>
                <div className="text-sm text-white text-center">
                    ID: {employeeData.employeeId}
                </div>
            </div>
        </div>
    ) : userProfile.name ? (



        // ฝั่ง user อันนิดึงมาจาก profile
        <div className='d-flex justify-content-center mt-6'>
            <div className="flex flex-col items-center w-80">
                <img
                    src={userProfile.avatar}
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover mb-3"/>
                <div className="text-white font-semibold fs-5 text-center">
                    {userProfile.name}
                </div>
                <div className="text-sm text-white text-center">
                    ID: {userProfile.userid}
                </div>
            </div>
        </div>
    ) : null






    const ApprovePage = (
        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/datacheck" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Attendance Summary</h3>
                <div className="me-4"></div>
            </div>


            {EmployeeProfile}


            {/* กล่องใหญ่ */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-3 fw-bold text-black">October 2025 Summary</h4>
                    <div className='grid grid-cols-2 gap-2 p-3 mt-3'>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#1CA983', border: 'none', borderRadius: '12px' }}
                            onClick={() => scrollToSection("ontime")}>
                            <i className="bi bi-check-circle me-2"></i>
                            On time: {onTimes.length}
                        </Button>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#D06356', border: 'none', borderRadius: '12px' }}
                            onClick={() => scrollToSection("late")}>
                            <i className="bi bi-clock me-2"></i>
                            Late: {lates.length}
                        </Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#C7C76E', border: 'none', borderRadius: '12px' }}
                            onClick={() => scrollToSection("leave")}>
                            <i className="bi bi-person-x me-2"></i>
                            Leave: {leaves.length}
                        </Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#252A46', border: 'none', borderRadius: '12px' }}
                            onClick={() => scrollToSection("all")}>
                            <i className="bi bi-list-ul me-2"></i>
                            All: {allRecords.length}
                        </Button>
                    </div>
                </div>
            </div>


            {/* ดีเทล */}
            <div className='d-flex justify-content-center mt-8 mb-12'>
                <div className='rounded-3 w-80 p-4'
                    style={{ background: 'linear-gradient(to bottom right, #D9D9D9, #636CCB)' }}>
                    {/* On Time */}
                    <div id="ontime" className="mb-6">
                        <DateGridModal
                            dates={onTimes}
                            title="On Time Details"
                            color="#1CA983"/>
                    </div>
                    {/* Late */}
                    <div id="late" className="mb-6">
                        <DateGridModal
                            dates={lates}
                            title="Late Details"
                            color="#D06356"/>
                    </div>
                    {/* Leave */}
                    <div id="leave" className="mb-6">
                        <DateGridModal
                            dates={leaves}
                            title="Leave Details"
                            color="#C7C76E"/>
                    </div>
                    {/* All Records */}
                    <div id="all">
                        <DateGridModal
                            dates={allRecords}
                            title="All Records"
                            color="#252A46"/>
                    </div>
                </div>
            </div>
        </div>
    )




    const Userpage = (
        <div className="app-container">
            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16 mb-2">
                <Link to="/home" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Attendance Summary</h3>
                <div className="me-4"></div>
            </div>


            {EmployeeProfile}



            {/* กล่องใหญ่ */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-3 fw-bold text-black">October 2025 Summary</h4>
                    <div className='grid grid-cols-2 gap-2 p-3 mt-3'>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#1CA983', border: 'none', borderRadius: '12px' }}
                            onClick={() => openModal("ontime")}>
                            <i className="bi bi-check-circle me-2"></i>
                            On time: {onTimes.length}
                        </Button>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#D06356', border: 'none', borderRadius: '12px' }}
                            onClick={() => openModal("late")}>
                            <i className="bi bi-clock me-2"></i>
                            Late: {lates.length}
                        </Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#C7C76E', border: 'none', borderRadius: '12px' }}
                            onClick={() => openModal("leave")}>
                            <i className="bi bi-person-x me-2"></i>
                            Leave: {leaves.length}
                        </Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105 transition-all duration-200 ease-in-out'
                            onClick={() => openModal("all")}
                            style={{ backgroundColor: '#252A46', border: 'none', borderRadius: '12px' }}>
                            <i className="bi bi-list-ul me-2"></i>
                            All: {allRecords.length}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )



    return (
        <>
            {role === "approver" ? ApprovePage : Userpage}


            {/* 
                centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ
                backdrop = ให้คลิกด้านนอก modal ก็ปิดตัว modal ได้
                keyboard = กด esc ที่ปุ่มคีย์บอร์ดก็ปิดได้
             */}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="sm" centered backdrop={true} keyboard={true}>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">{modalData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <DateGridModal
                        dates={modalData.dates}
                        title={modalData.title}
                        color={modalData.color}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AttendanceSum