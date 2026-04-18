import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Api from '../../Api';

const AttendanceSum = ({ role }) => {
    
    const location = useLocation()
    const employeeData = location.state?.employeeData
    
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({ title: "", dates: [], color: "" })

    const now = new Date()

    const monthYear = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
    })
    

    // State สำหรับเก็บข้อมูลผู้ใช้
    const [userProfile, setUserProfile] = useState({
        name: "",
        userid: "",
        avatar: ""
    })

    // State สำหรับเก็บข้อมูล status
    const [attendanceData, setAttendanceData] = useState({
        onTimes: [],
        lates: [],
        leaves: []
    })

    // ดึงข้อมูลของ user คนนั้น
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                // ไปดึงหน้า profile มา
                const response = await Api.get('/users/profile')
                const data = response.data
                
                const avatarPath = data.avatar 
                    ? (data.avatar.startsWith('http') 
                        ? data.avatar  
                        : `${Api.defaults.baseURL}/uploads/avatars/${data.avatar}`) 
                    : "/easycheck/img/an.jpg"

                setUserProfile({
                    name: `${data.firstname} ${data.lastname}`,
                    userid: data.id_employee || "",
                    avatar: avatarPath
                })
            } catch (error) {
                console.error("Error loading profile:", error.response?.data?.message || error.message)
            }
        }
        
        if (role !== "approver" && !employeeData) {
            loadUserProfile()
        }
    }, [role, employeeData])



    // ดึงข้อมูลประวัติเข้างาน
    useEffect(() => {
        const fetchAttendanceHistory = async () => {
            // approver ใช้ employeeData , user ใช้ userProfile
            const id = employeeData?.employeeId || userProfile.userid
            
            if (id) {
                try {
                    const response = await Api.get(`/attendance/attendance-history?userId=${id}`)
                    setAttendanceData(response.data)
                } 
                catch (error) {
                    console.error("Error fetching history:", error.response?.data?.message || error.message)
                }
            }
        }
        fetchAttendanceHistory()
    }, [employeeData, userProfile.userid])


    const onTimes = attendanceData.onTimes || []
    const lates = attendanceData.lates || []
    const leaves = attendanceData.leaves || []
    const allRecords = [...onTimes, ...lates, ...leaves]

    // ทำ openModal และ scrollToSection
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
            default: return
        }
        setModalData(data); setShowModal(true)
    }

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const DateGridModal = ({ dates, title, color }) => (
        <div>
            <h4 className="fw-bold mb-3 text-center">{title}</h4>
            <div className="row g-2">
                {dates.map((date, index) => (
                    <div key={index} className="col-6">
                        <div className="rounded-2 p-2 text-center shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                            <small className="fw-semibold" style={{ color: color }}>{date}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const EmployeeProfile = employeeData ? (
        <div className='d-flex justify-content-center mt-6'>
            <div className="flex flex-col items-center w-80">
                <img src={employeeData.profile} alt="profile" className="w-28 h-28 rounded-full object-cover mb-3"/>
                <div className="text-white font-semibold fs-5 text-center">{employeeData.name}</div>
                <div className="text-sm text-white text-center">ID: {employeeData.employeeId}</div>
            </div>
        </div>
    ) : userProfile.name ? (
        <div className='d-flex justify-content-center mt-6'>
            <div className="flex flex-col items-center w-80">
                <img src={userProfile.avatar} alt="profile" className="w-28 h-28 rounded-full object-cover mb-3"/>
                <div className="text-white font-semibold fs-5 text-center">{userProfile.name}</div>
                <div className="text-sm text-white text-center">ID: {userProfile.userid}</div>
            </div>
        </div>
    ) : null

    const ApprovePage = (
        <div className="app-container">
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/datacheck" className='text-decoration-none'>
                    <Button variant="link" className="p-0"><i className="bi bi-chevron-left ms-3 text-white"></i></Button>
                </Link>
                <h3 className="fw-bold">Attendance Summary</h3>
                <div className="me-4"></div>
            </div>
            {EmployeeProfile}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80" style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-3 fw-bold text-black">{monthYear} Summary</h4>
                    <div className='grid grid-cols-2 gap-2 p-3 mt-3'>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105' style={{ backgroundColor: '#1CA983', border: 'none', borderRadius: '12px' }} onClick={() => scrollToSection("ontime")}>On time: {onTimes.length}</Button>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105' style={{ backgroundColor: '#D06356', border: 'none', borderRadius: '12px' }} onClick={() => scrollToSection("late")}>Late: {lates.length}</Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105' style={{ backgroundColor: '#C7C76E', border: 'none', borderRadius: '12px' }} onClick={() => scrollToSection("leave")}>Leave: {leaves.length}</Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105' style={{ backgroundColor: '#252A46', border: 'none', borderRadius: '12px' }} onClick={() => scrollToSection("all")}>All: {allRecords.length}</Button>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center mt-8 mb-12'>
                <div className='rounded-3 w-80 p-4' style={{ background: 'linear-gradient(to bottom right, #D9D9D9, #636CCB)' }}>
                    <div id="ontime" className="mb-6"><DateGridModal dates={onTimes} title="On Time Details" color="#1CA983"/></div>
                    <div id="late" className="mb-6"><DateGridModal dates={lates} title="Late Details" color="#D06356"/></div>
                    <div id="leave" className="mb-6"><DateGridModal dates={leaves} title="Leave Details" color="#C7C76E"/></div>
                    <div id="all"><DateGridModal dates={allRecords} title="All Records" color="#252A46"/></div>
                </div>
            </div>
        </div>
    )

    const Userpage = (
        <div className="app-container">
            <div className="d-flex justify-content-between text-white mt-16 mb-2">
                <Link to="/home" className='text-decoration-none'>
                    <Button variant="link" className="p-0"><i className="bi bi-chevron-left ms-3 text-white"></i></Button>
                </Link>
                <h3 className="fw-bold">Attendance Summary</h3>
                <div className="me-4"></div>
            </div>
            {EmployeeProfile}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80" style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-3 fw-bold text-black">{monthYear} Summary</h4>
                    <div className='grid grid-cols-2 gap-2 p-3 mt-3'>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105' style={{ backgroundColor: '#1CA983', border: 'none', borderRadius: '12px' }} onClick={() => openModal("ontime")}>On time: {onTimes.length}</Button>
                        <Button className='w-100 p-2 text-white fw-semibold hover:scale-105' style={{ backgroundColor: '#D06356', border: 'none', borderRadius: '12px' }} onClick={() => openModal("late")}>Late: {lates.length}</Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105' style={{ backgroundColor: '#C7C76E', border: 'none', borderRadius: '12px' }} onClick={() => openModal("leave")}>Leave: {leaves.length}</Button>
                        <Button className='w-100 p-2 text-white fw-semibold mt-3 hover:scale-105' onClick={() => openModal("all")} style={{ backgroundColor: '#252A46', border: 'none', borderRadius: '12px' }}>All: {allRecords.length}</Button>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {role === "approver" ? ApprovePage : Userpage}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="sm" centered backdrop={true} keyboard={true}>
                <Modal.Body className="p-4">
                    <DateGridModal dates={modalData.dates} title={modalData.title} color={modalData.color} />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AttendanceSum