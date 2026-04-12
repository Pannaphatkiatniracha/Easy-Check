import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Api from '../../Api';

const WorkHoursTracker = ({ role }) => {
    const location = useLocation()
    const employeeData = location.state?.employeeData

    // =State สำหรับเก็บข้อมูลผู้ใช้=
    const [userProfile, setUserProfile] = useState({
        name: "",
        userid: "",
        avatar: "",
        shift: ""
    })

    // =State สำหรับเก็บข้อมูลชั่วโมงทำงาน
    const [realHours, setRealHours] = useState({
        Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0
    })

    // ดึงข้อมูล user
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
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
                    avatar: avatarPath,
                    shift: data.start_time && data.end_time ? `${data.start_time.substring(0,5)} - ${data.end_time.substring(0,5)}` : "No Shift"
                })
            } 
            catch (error) {
                console.error("Error loading profile:", error.response?.data?.message || error.message)
            }
        }
        
        if (role !== "approver" && !employeeData) {
            loadUserProfile()
        }
    }, [role, employeeData])


    // ดึงข้อมูลชั่วโมงทำงาน
    useEffect(() => {
        const fetchWeeklyHours = async () => {
            const id = employeeData?.employeeId || userProfile.userid
            if (id) {
                try {
                    const response = await Api.get(`/attendance/weekly-hours?userId=${id}`)
                    setRealHours(response.data)
                } 
                catch (error) {
                    console.error("Error fetching hours:", error.response?.data?.message || error.message)
                }
            }
        }
        fetchWeeklyHours()
    }, [employeeData, userProfile.userid])


    // การคำนวณวันและ ProgressBar
    const weekTemplate = [
        { day: "Monday", color: "#FFD700" },
        { day: "Tuesday", color: "#FF69B4" },
        { day: "Wednesday", color: "#32CD32" },
        { day: "Thursday", color: "#FFA500" },
        { day: "Friday", color: "#1E90FF" },
    ]


    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const todayIndex = new Date().getDay()
    const todayName = dayNames[todayIndex]
    const MAX_HOURS_PER_DAY = 9

    
    const weeklyData = weekTemplate.map(item => {
        const itemIndex = dayNames.indexOf(item.day)
        const reached = itemIndex <= todayIndex
        const hoursWorked = realHours[item.day] || 0
        // ไม่ให้ percent ที่เกิน 100 และไม่ให้เป็น NaN
        let percent = (hoursWorked / MAX_HOURS_PER_DAY) * 100
        percent = Math.min(100, Math.max(0, percent)) // จำกัดให้อยู่ระหว่าง 0-100

        return {
            ...item,
            hours: hoursWorked,
            percent: percent,
            color: item.color
        }
    })

    const today = weeklyData.find(d => d.day === todayName) ?? { hours: 0, percent: 0, color: "#ccc" }
    const workedHours = weeklyData.reduce((sum, day) => sum + day.hours, 0)
    const workDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const daysWorked = workDays.filter(day => dayNames.indexOf(day) <= todayIndex).length
    const maxPossibleHours = daysWorked * MAX_HOURS_PER_DAY
    const weeklySummaryPercent = maxPossibleHours > 0 ? Math.round((workedHours / maxPossibleHours) * 100) : 0


    const CustomProgressBar = ({ percent, color, height = '20px' }) => {
        // ตรวจสอบว่า percent เป็นตัวเลขที่ถูกต้อง
        const validPercent = isNaN(percent) ? 0 : Math.min(100, Math.max(0, percent))
        
        return (
            <div style={{ 
                height: height, 
                backgroundColor: '#e0e0e0', 
                borderRadius: '10px', 
                overflow: 'hidden',
                width: '100%',
                position: 'relative'
            }}>
                <div style={{ 
                    width: `${validPercent}%`, 
                    height: '100%', 
                    backgroundColor: color,
                    transition: 'width 0.3s ease',
                    borderRadius: '10px'
                }} />
            </div>
        )
    }



    // 🐸🐸 result
    const EmployeeProfile = (
        <div className='d-flex justify-content-center mt-6'>
            <div className="flex flex-col items-center w-80">
                <img src={employeeData ? employeeData.profile : userProfile.avatar} 
                     alt="profile" className="w-28 h-28 rounded-full object-cover mb-3"/>
                <div className="text-white font-semibold fs-5 text-center">
                    {employeeData ? employeeData.name : userProfile.name}
                </div>
                <div className="text-sm text-white text-center">
                    ID: {employeeData ? employeeData.employeeId : userProfile.userid}
                </div>
                {(employeeData?.shift || userProfile.shift) && (
                    <div className="text-sm text-warning text-center mt-2 fw-bold">
                        Shift: {employeeData ? employeeData.shift : userProfile.shift}
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="app-container">
            {/* Header */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to={role === "approver" ? "/datatocheck" : "/home"} className='text-decoration-none'>
                    <Button variant="link" className="p-0"><i className="bi bi-chevron-left ms-3 text-white"></i></Button>
                </Link>
                <h3 className="fw-bold">Work Hours Tracker</h3>
                <div className="me-4"></div>
            </div>

            {EmployeeProfile}

            {/* Today Summary */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80" 
                     style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-2 mb-4 fw-bold">Today - {todayName}</h4>
                    <div className='d-flex justify-content-between mb-2'>
                        <span className='fw-bold'>Worked: {today.hours.toFixed(1)}h</span>
                        <span className='fw-bold'>Target: {MAX_HOURS_PER_DAY}h</span>
                    </div>
                    <CustomProgressBar percent={today.percent} color={today.color} />
                </div>
            </div>

            {/* Weekly Report */}
            <div className='d-flex justify-content-center mt-8 mb-6'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80" 
                     style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-2 mb-6 fw-bold">Weekly Report</h4>
                    {weeklyData.map((item, index) => (
                        <div key={index} className='mb-4 text-start' style={{ width: '100%' }}>
                            <div className='d-flex justify-content-between mb-2'>
                                <span className='fw-bold'>{item.day}</span>
                                <span className='fw-bold'>{item.hours.toFixed(1)}h / {MAX_HOURS_PER_DAY}h</span>
                            </div>
                            <CustomProgressBar percent={item.percent} color={item.color} />
                        </div>
                    ))}
                    
                    {/* Summary เฉพาะหน้า Approver หรือจะโชว์ให้ User เห็นด้วยก็ได้ */}
                    <div className="mt-4 pt-4 border-top border-secondary">
                        <div className='d-flex justify-content-between mb-2'>
                            <span className='fw-bold'>Total Worked: {workedHours.toFixed(1)}h</span>
                            <span className='fw-bold'>{weeklySummaryPercent}%</span>
                        </div>
                        <CustomProgressBar percent={weeklySummaryPercent} color="#6D29F6" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkHoursTracker;