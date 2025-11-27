import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const WorkHoursTracker = ({ role }) => {

    const location = useLocation()
    const employeeData = location.state?.employeeData

    
    // state ตรงนี้มีไว้เก็บข้อมูลผู้ใช้จาก API
    const [userProfile, setUserProfile] = useState({
        name: "",
        userid: "",
        avatar: "",
        shift: ""
    })


    // ดึงข้อมูลจาก API
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users/6")
                const data = await res.json()
                setUserProfile({ // ส่วนนี้คือการดึงข้อมูลที่ต้องการมาเก็บใน state
                    name: data.name || "",
                    userid: data.userid || "",
                    avatar: data.avatar || "/easycheck/img/an.jpg",
                    shift: data.shift || ""
                })
            } catch (error) {
                console.error("Error loading user profile:", error)
            }
        }

        // ถ้าไม่ใช่ approver ให้ไปเอาข้อมูลจาก profile มาแสดง ซึ่งก็คือ user นั่นแหละ
        if (role !== "approver" && !employeeData) {
            loadUserProfile()
        }
    }, [role, employeeData])



    const weekTemplate = [
        {
            day: "Monday",
            color: "#FFD700"
        },
        {
            day: "Tuesday",
            color: "#FF69B4"
        },
        {
            day: "Wednesday",
            color: "#32CD32"
        },
        {
            day: "Thursday",
            color: "#FFA500"
        },
        {
            day: "Friday",
            color: "#1E90FF"
        },
    ]


    // mock จำนวนชั่วโมงไว้ก่อน
    const hoursMap = {
        "010889": {
            Monday: 7.2,
            Tuesday: 5.4,
            Wednesday: 8.1,
            Thursday: 6.3,
            Friday: 7.8,
        },
        "010101": {
            Monday: 9,
            Tuesday: 8.5,
            Wednesday: 7.2,
            Thursday: 9,
            Friday: 8.8,
        },
        "110400": {
            Monday: 6.4,
            Tuesday: 7.0,
            Wednesday: 5.9,
            Thursday: 8.3,
            Friday: 7.1,
        },
        "130901": {
            Monday: 8.0,
            Tuesday: 7.5,
            Wednesday: 8.2,
            Thursday: 7.8,
            Friday: 8.5,
        },
        "030996": {
            Monday: 6.5,
            Tuesday: 7.8,
            Wednesday: 8.0,
            Thursday: 7.2,
            Friday: 8.3,
        },
        "270502": {
            Monday: 8.2,
            Tuesday: 8.5,
            Wednesday: 7.9,
            Thursday: 8.1,
            Friday: 8.4,
        },
        "1110495": {
            Monday: 7.8,
            Tuesday: 8.0,
            Wednesday: 7.5,
            Thursday: 8.2,
            Friday: 7.9,
        }
    }

    // ให้มันโชว์ข้อมูลตาม ID แต่ถ้าผิดพลาดอะไรก็จะให้แสดงของ 010889 ไปก่อน
    // ส่วน user ก็ใชที่ลิ้งเอาจาก profile นั่นแหละ
    const employeeId = employeeData
        ? employeeData.employeeId
        : (userProfile.userid || "010889")


    const hoursData = hoursMap[employeeId] || hoursMap["010889"]


    // กำหนดชื่อวันโดยเรียงตาม date 0-6
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


    const todayIndex = new Date().getDay()  // วันปัจจุบันจริง ๆ แต่เป็นเลข 0-6
    const todayName = dayNames[todayIndex]  // วันปัจจุบันที่เป็นชื่อวัน เช่น todayIndex คือ 1 / todayName คือ Monday


    const MAX_HOURS_PER_DAY = 9


    const weeklyData = weekTemplate.map(item => {
        // dayNames.indexOf(item.day) จะได้ ตำแหน่งของวันนั้นในสัปดาห์ เช่นแบบ dayNames.indexOf("Wednesday") คืนค่า 3 
        const itemIndex = dayNames.indexOf(item.day)  // itemIndex = เลขลำดับวันนั้นๆ

        const reached = itemIndex <= todayIndex
        const hoursWorked = reached ? (hoursData[item.day] ?? 0) : 0
        const percent = (hoursWorked / MAX_HOURS_PER_DAY) * 100

        return {
            ...item,
            hours: hoursWorked,
            percent: percent,
            color: reached ? item.color : "#ccc"
        }
    })



    // .find() มันคือของอย่างที่แรกที่ระบบเจอและตรงตามเงื่อนไข
    // today อันนี้คือพอเช็คแล้วว่า d => d.day === todayName ถูกไหม ถ้าถูกมันจะได้ชุดผลลัพธ์ทั้งหมดเลย เช่น วันจันทร์ สีเหลือง 80%
    const today = weeklyData.find(d => d.day === todayName) ?? { hours: 0, percent: 0, color: "#ccc" }



    // sum = ผลรวม   day = ของใน array  -------------------- เวลาทำงานจริงจ้า --------------------
    // .reduce คือการเอาของใน array มาค่อยๆ ทำอะไรสักอย่างกัน โดยส่งผลลัพธ์ไปเรื่อยๆ ในทีนี้คือ บวก
    const workedHours = weeklyData.reduce((sum, day) => {
        return sum + day.hours
    }, 0)  // 0 ตรงนี้คือให้ sum มีค่าเริ่มต้นเป็น 0



    // เอาไว้บอกว่าตอนนี้เราทำงานไปกี่วันแล้ว
    const workDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const daysWorked = workDays.filter(day =>
        dayNames.indexOf(day) <= todayIndex
    ).length



    const maxPossibleHours = daysWorked * MAX_HOURS_PER_DAY  // จำนวนชั่วโมงสูงสุดที่เข้าทำงาน *นับแค่วันที่ทำงานแล้ว*


    // สรุปเปอร์เซ็นต์รวม
    const weeklySummaryPercent = maxPossibleHours > 0
        // Math.round คือปัดเศษตามค่าความเป็นจริง
        ? Math.round((workedHours / maxPossibleHours) * 100) : 0 // ถ้าหล่อนไม่เคยทำงานเลยก็ 0 จ่ะ


    // ส่วนแสดงโปรไฟล์พนักงาน (ใช้ทั้งสองฝั่ง)
    const EmployeeProfile = employeeData ? (
        
        // ฝั่ง approver
        <div className='d-flex justify-content-center mt-6'>
            <div className="flex flex-col items-center w-80">
                
                {/* รูป profile */}
                <img className="w-28 h-28 rounded-full object-cover mb-3" alt="profile"
                src={employeeData.profile}/>


                {/* ชื่อ */}
                <div className="text-white font-semibold fs-5 text-center">
                    {employeeData.name}
                </div>


                {/* id */}
                <div className="text-sm text-white text-center">
                    ID: {employeeData.employeeId}
                </div>


                {/* กะงาน */}
                {employeeData.shift && (
                    <div className="text-sm text-warning text-center mt-2">
                        Shift: {employeeData.shift}
                    </div>
                )}
            </div>
        </div>

    ) : 
    
    
    userProfile.name ? (
        
        // ฝั่ง user
        <div className='d-flex justify-content-center mt-6'>
            <div className="flex flex-col items-center w-80">

                {/* รูป profile */}
                <img className="w-28 h-28 rounded-full object-cover mb-3" alt="profile"
                src={userProfile.avatar}/>

                {/* ชื่อ */}
                <div className="text-white font-semibold fs-5 text-center">
                    {userProfile.name}
                </div>

                {/* id */}
                <div className="text-sm text-white text-center">
                    ID: {userProfile.userid}
                </div>

                {/* กะงาน */}
                {userProfile.shift && (
                    <div className="text-sm text-warning text-center mt-2">
                        Shift: {userProfile.shift}
                    </div>
                )}
            </div>
        </div>

    ) : null


    const CustomProgressBar = ({ percent, color, height = '20px' }) => (
        <div style={{ 
            height: height, 
            backgroundColor: '#ccc', 
            borderRadius: '4px', 
            overflow: 'hidden' 
        }}>
            <div style={{ 
                width: `${percent}%`, 
                height: '100%', 
                backgroundColor: color 
            }} />
        </div>
    )



    const ApprovePage = (
        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/datatocheck" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Work Hours Tracker</h3>
                <div className="me-4"></div>
            </div>

            {EmployeeProfile}

            {/* ของวันนี้ */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-2 mb-4 fw-bold">Today - {todayName}</h4>
                    <div className='p-2'>
                        <div className='d-flex justify-content-between mb-2'>
                            <span className='fw-bold'>Worked: {today.hours.toFixed(1)}h</span>
                            <span className='fw-bold'>Target: {MAX_HOURS_PER_DAY}h</span>
                        </div>
                        <CustomProgressBar percent={today.percent} color={today.color} />
                    </div>
                </div>
            </div>

            {/* โชว์รายวัน */}
            <div className='d-flex justify-content-center mt-8'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-2 mb-6 fw-bold">Weekly Report</h4>
                    {weeklyData.map((item, index) => (
                        <div key={index} className='mb-4 ml-1 mr-1'>
                            <div className='d-flex justify-content-between mb-2'>
                                <span className='fw-bold'>{item.day}</span>
                                <span className='fw-bold'>{item.hours.toFixed(1)}h / {MAX_HOURS_PER_DAY}h</span>
                            </div>
                            <CustomProgressBar percent={item.percent} color={item.color} />
                        </div>
                    ))}
                </div>
            </div>

            {/* กล่องรวม */}
            <div className='d-flex justify-content-center mt-10 mb-3'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-2 mb-4 fw-bold">Weekly Summary</h4>
                    <div className='d-flex justify-content-between mb-3'>
                        <span className='fw-bold'>Total Worked: {workedHours.toFixed(1)}h</span>
                        <span className='fw-bold'>Possible: {maxPossibleHours}h</span>
                    </div>
                    <CustomProgressBar percent={weeklySummaryPercent} color="#6D29F6" />
                    <div className='fw-bold text-center mt-3'>
                        Efficiency: {weeklySummaryPercent}%
                    </div>
                </div>
            </div>
        </div>
    )



    const Userpage = (
        <div className="app-container">
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/home" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Work Hours Tracker</h3>
                <div className="me-4"></div>
            </div>

            {EmployeeProfile}

            {/* ของวันนี้ - ใช้ CustomProgressBar */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-2 mb-4 fw-bold">Today - {todayName}</h4>
                    <div className='p-2'>
                        <div className='d-flex justify-content-between mb-2'>
                            <span className='fw-bold'>Worked: {today.hours.toFixed(1)}h</span>
                            <span className='fw-bold'>Target: {MAX_HOURS_PER_DAY}h</span>
                        </div>
                        <CustomProgressBar percent={today.percent} color={today.color} />
                    </div>
                </div>
            </div>

            {/* โชว์รายวัน */}
            <div className='d-flex justify-content-center mt-8 mb-6'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <h4 className="mt-2 mb-6 fw-bold">Weekly Report</h4>
                    {weeklyData.map((item, index) => (
                        <div key={index} className='mb-4 ml-1 mr-1 text-start'>
                            <div className='d-flex justify-content-between mb-2'>
                                <span className='fw-bold'>{item.day}</span>
                                <span className='fw-bold'>{item.hours.toFixed(1)}h / {MAX_HOURS_PER_DAY}h</span>
                            </div>
                            <CustomProgressBar percent={item.percent} color={item.color} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return role === "approver" ? ApprovePage : Userpage
}

export default WorkHoursTracker