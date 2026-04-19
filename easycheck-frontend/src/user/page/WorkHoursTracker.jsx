import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Api from '../../Api'

const WorkHoursTracker = ({ role }) => {
    
    const location = useLocation()
    const employeeData = location.state?.employeeData

    // สร้างไว้เก็บข้อมูล user
    const [userProfile, setUserProfile] = useState({
        name: "",
        userid: "",
        avatar: ""
    })

    // เก็บข้อมูลเข้าออกงานแต่ละวัน
    const [timeline, setTimeline] = useState([])

    const profileData = {
        name: employeeData?.name || userProfile.name,
        userid: employeeData?.employeeId || userProfile.userid,
        avatar: employeeData?.profile || userProfile.avatar
    }

    // ก็คือตอนโหลดหน้ามาให้เจออะไรบ้าง
    useEffect(() => {
        const loadUserProfile = async () => {
            if (employeeData) return

            try {
                const res = await Api.get('/users/profile')
                const data = res.data

                const avatarPath = data.avatar
                    ? (data.avatar.startsWith('http')
                        ? data.avatar
                        : `${Api.defaults.baseURL}/uploads/avatars/${data.avatar}`)
                    : "/easycheck/img/an.jpg"

                // เอาข้อมูลมาเก็บใน state
                setUserProfile({
                    name: `${data.firstname} ${data.lastname}`,
                    userid: data.id_employee,
                    avatar: avatarPath
                })
            } catch (err) {
                console.error(err)
            }
        }

        loadUserProfile()
    }, [employeeData])



    useEffect(() => {
        const fetchTimeline = async () => {
            // เลือกว่าใช้ id ไหน
            const id = employeeData?.employeeId || userProfile.userid
            if (!id) return

            try {
                const res = await Api.get(`/attendance/weekly-timeline?userId=${id}`)
                setTimeline(res.data) // เก็บข้อมูลลง state
            } 
            catch (err) {
                console.error(err)
            }
        }

        fetchTimeline()
    }, [employeeData?.employeeId, userProfile.userid])


    // แปลง datetime > เวลา
    const formatTime = (time) => {
        if (!time) return "-"

        return new Date(time).toLocaleTimeString("th-TH", {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // ✅ คำนวณเวลาทำงาน (เพิ่มใหม่ แต่ไม่แตะ logic เดิม)
    const getWorkingDuration = (inTime, outTime) => {
        if (!inTime || !outTime) return null

        // แปลง string เป็น date มันจะได้คำนวณได้
        const start = new Date(inTime)
        const end = new Date(outTime)

        // เวลาที่ทำงาน แต่อยู่ในหน่วย ms
        const diffMs = end - start

        // 1 วินาที = 1000 ms
        // 1 นาที = 60 วินาที
        // 1 ชั่วโมง = 60 นาที
        // แล้วใช้ Math.floor ปัดเศษลงเพราะในการทำงานทำไม่ถึงก็คือไม่ปัดขึ้นนะแม่นะ
        const hours = Math.floor(diffMs / (1000 * 60 * 60)) // 1000 * 60 * 60 = 1 ชั่วโมงใน ms
        
        // diffMs % (1 ชั่วโมง) > เอาเฉพาะเศษที่เหลือ หลังจากที่เราคำนวณชั่วโมงเต็มแล้ว
        // 1 นาที = 60,000 ms > / (1000 * 60)
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        return `${hours}h ${minutes}m`
    }

    // อันนี้เหมือนร่างไว้ก่อนเฉย ๆ ว่าต้องมี 5 วันเสมอ
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    // loop ทุกวัน
    const mergedData = weekDays.map(day => {
        const found = timeline.find(item => item.day === day)
        // เหมือนดึงมากงนิ
        return {
            day,
            check_in: found?.check_in || null,
            check_out: found?.check_out || null
        }
    })

    const getStatusColor = (item, index) => {
        const todayIndex = new Date().getDay() // วันนี้คือวันอะไร (0–6)
        const dayMap = [1, 2, 3, 4, 5] // Monday–Friday

        const thisDayIndex = dayMap[index] // วันปัจจุบัน

        if (thisDayIndex > todayIndex) return "#9ca3af"

        if (!item.check_in) return "#ef4444"

        if (item.check_in && !item.check_out) return "#8b5cf6"

        return "#22c55e"
    }

    return (
        <div className="app-container">

            {/* หัวข้อจ่ะแม่จ๋า */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to={role === "approver" ? "/datatocheck" : "/home"} className='text-decoration-none'>
                    <i className="bi bi-chevron-left ms-3 text-white"></i>
                </Link>
                <h3 className="fw-bold">Work Hours Tracker</h3>
                <div className="me-4"></div>
            </div>

            {/* ตรงที่ดึงข้อมูล user มาแสดง */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="flex flex-col items-center w-80">
                    {/* รูป */}
                    <img src={profileData.avatar} alt="profile"
                        className="w-28 h-28 rounded-full object-cover mb-3"/>

                    {/* ชื่อ */}
                    <div className="text-white font-semibold fs-5 text-center">
                        {profileData.name}
                    </div>

                    {/* id */}
                    <div className="text-sm text-white text-center">
                        ID: {profileData.userid}
                    </div>

                </div>
            </div>


            {/* card แสดงผลแล้วแม่ */}
            <div className="d-flex justify-content-center mt-8 mb-12">
                <div className="w-80 flex flex-col gap-4">

                    {/* item = ข้อมูล 1 วัน
                        day: "Monday",
                        check_in: "08:00",
                        check_out: "17:00"
                    -------------------------------
                        index = ลำดับวัน
                        0 = Monday , 1 = Tuesday */}

                    {/* วนแสดง 5 วัน */}
                    {mergedData.map((item, index) => {

                        // จำนวนเวลาจริงที่ทำงานไปในวันนี้
                        // เอา check_in + check_out ของวันนั้น ๆ ส่งเข้า function
                        const duration = getWorkingDuration(item.check_in, item.check_out)

                        return (
                            <div key={index} className="flex gap-3 items-start">

                                <div className="flex flex-col items-center mt-1">
                                    {/* เอาสีจาก logic มาใช้ */}
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: getStatusColor(item, index) }}
                                    ></div>

                                    {index !== mergedData.length - 1 && (
                                        // อารมณ์เส้นคั่น
                                        <div className="w-[2px] h-full bg-gray-400 opacity-40"></div>
                                    )}
                                </div>

                                
                                {/* card ของแต่ละวัน */}
                                <div className="flex-1 rounded-xl px-4 py-3 bg-white shadow-md">

                                    {/* วัน */}
                                    <div className="font-semibold text-gray-800 mb-2">
                                        {item.day}
                                    </div>

                                    <div className="flex justify-between items-center text-sm">

                                        {/* IN */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-[2px] rounded-full text-white"
                                                style={{
                                                    background: 'linear-gradient(to right, #34d399, #059669)'
                                                }}>
                                                IN
                                            </span>

                                            <span className="text-gray-800 font-medium">
                                                {formatTime(item.check_in)}
                                            </span>
                                        </div>

                                        {/* OUT */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-[2px] rounded-full text-white"
                                                style={{
                                                    background: 'linear-gradient(to right, #60a5fa, #2563eb)'
                                                }}>
                                                OUT
                                            </span>

                                            <span className="text-gray-800 font-medium">
                                                {formatTime(item.check_out)}
                                            </span>
                                        </div>

                                    </div>

                                    {/* ตรงที่บอกว่าทำไปกี่ชั่วโมงแล้ว */}
                                    <div className="mt-2 text-xs text-gray-500 font-medium">
                                        {item.check_in && item.check_out
                                            ? `Working time: ${duration}`
                                            
                                            : item.check_in && !item.check_out
                                                ? "Working..."
                                                
                                                : "-"
                                        }
                                    </div>

                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>

        </div>
    )
}

export default WorkHoursTracker