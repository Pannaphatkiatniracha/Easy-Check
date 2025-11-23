import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const AttendanceSum = ({ role }) => {

    const location = useLocation()
    const employeeData = location.state?.employeeData

    // ฟังก์ชันดึงข้อมูลตาม employeeId
    const getAttendanceData = (employeeId) => {
        const attendanceMap = {
            "010889": { // ปิลันทิตา - ลา 3 ครั้ง สาย 2 ครั้ง
                onTimes: [
                    "2025-10-01", "2025-10-02", "2025-10-03", "2025-10-06", "2025-10-07",
                    "2025-10-08", "2025-10-09", "2025-10-10", "2025-10-13", "2025-10-14",
                    "2025-10-15", "2025-10-16", "2025-10-17", "2025-10-20", "2025-10-21",
                    "2025-10-22", "2025-10-23", "2025-10-24", "2025-10-27", "2025-10-28",
                    "2025-10-29", "2025-10-30", "2025-10-31", "2025-10-04", "2025-10-11",
                    "2025-10-18"
                ],
                lates: [
                    "2025-10-05", "2025-10-12" // สาย 2 ครั้ง
                ],
                leaves: [
                    "2025-10-19", "2025-10-25", "2025-10-26" // ลา 3 ครั้ง
                ]
            },
            "010101": { // อภิชญา - ลา 1 ครั้ง
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
                    "2025-10-31" // ลา 1 ครั้ง
                ]
            },
            "110400": { // ยิหวา - ลา 5 ครั้ง สาย 3 ครั้ง
                onTimes: [
                    "2025-10-01", "2025-10-02", "2025-10-03", "2025-10-06", "2025-10-07",
                    "2025-10-08", "2025-10-09", "2025-10-10", "2025-10-13", "2025-10-14",
                    "2025-10-15", "2025-10-16", "2025-10-17", "2025-10-20", "2025-10-21",
                    "2025-10-22", "2025-10-23", "2025-10-27", "2025-10-28", "2025-10-29"
                ],
                lates: [
                    "2025-10-04", "2025-10-11", "2025-10-24" // สาย 3 ครั้ง
                ],
                leaves: [
                    "2025-10-05", "2025-10-12", "2025-10-18", "2025-10-25", "2025-10-30", "2025-10-31" // ลา 6 ครั้ง
                ]
            }
        }
        return attendanceMap[employeeId] || attendanceMap["010889"]
    }

    // ดึงข้อมูลตามพนักงาน
    const attendanceData = employeeData ? getAttendanceData(employeeData.employeeId) : {
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
    }

    const onTimes = attendanceData.onTimes
    const lates = attendanceData.lates
    const leaves = attendanceData.leaves

    // ระเบิด array ตรงนี้คือการเอาข้อมูลใน array พวกนี้มารวมกัน
    const allRecords = [...onTimes, ...lates, ...leaves]

    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({ title: "", dates: [], color: "" })

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

    // ส่วนแสดงโปรไฟล์พนักงาน
    const EmployeeProfile = employeeData ? (
        <div className='d-flex justify-content-center mt-6'>
            <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center w-80">

                <img
                    src={employeeData.profile}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover mb-3"
                />

                <div className="text-gray-800 font-semibold fs-5 text-center">
                    {employeeData.name}
                </div>

                <div className="text-sm text-black text-center">
                    ID: {employeeData.employeeId}
                </div>

            </div>
        </div>
    ) : null

    // ส่วนสรุปผลสำหรับ Approver
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

            {/* แสดงโปรไฟล์พนักงาน (สำหรับ Approver) */}
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

            {/* ดีเทลสถานะ */}
            <div className='d-flex justify-content-center mt-8 mb-12'>
                <div className='rounded-3 w-80 p-4'
                    style={{ background: 'linear-gradient(to bottom right, #D9D9D9, #636CCB)' }}>

                    {/* On Time - สีเขียว */}
                    <div id="ontime" className="mb-6">
                        <DateGridModal
                            dates={onTimes}
                            title="On Time Details"
                            color="#1CA983"
                        />
                    </div>

                    {/* Late - สีแดง */}
                    <div id="late" className="mb-6">
                        <DateGridModal
                            dates={lates}
                            title="Late Details"
                            color="#D06356"
                        />
                    </div>

                    {/* Leave - สีเหลือง */}
                    <div id="leave" className="mb-6">
                        <DateGridModal
                            dates={leaves}
                            title="Leave Details"
                            color="#C7C76E"
                        />
                    </div>

                    {/* All Records - สีดำ */}
                    <div id="all">
                        <DateGridModal
                            dates={allRecords}
                            title="All Records"
                            color="#252A46"
                        />
                    </div>

                </div>
            </div>
        </div>
    )

    // ส่วนสรุปผลสำหรับ User ทั่วไป
    const Userpage = (
        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/home" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Attendance Summary</h3>
                <div className="me-4"></div>
            </div>

            {/* กล่องใหญ่ */}
            <div className='d-flex justify-content-center mt-10'>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
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
                <Modal.Footer className="border-0">
                    <Button
                        style={{ backgroundColor: '#636CCB', border: 'none' }}
                        onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AttendanceSum