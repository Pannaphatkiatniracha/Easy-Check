import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useLocation } from 'react-router-dom';

const WorkHoursTracker = ({ role }) => {

    const location = useLocation()
    const employeeData = location.state?.employeeData

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
        }
    }


    // ให้มันโชว์ข้อมูลตาม ID แต่ถ้าผิดพลาดอะไรก็จะให้แสดงของ 010889 ไปก่อน
    const hoursData = employeeData
        ? hoursMap[employeeData.employeeId]
        : hoursMap["010889"]


    // กำหนดชื่อวันโดยเรียงตาม date 0-6
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const todayIndex = new Date().getDay()
    const todayName = dayNames[todayIndex]

    const MAX_HOURS_PER_DAY = 9

    const weeklyData = weekTemplate.map(item => {

        const itemIndex = dayNames.indexOf(item.day)

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

    const today = weeklyData.find(d => d.day === todayName) ?? { hours: 0, percent: 0, color: "#ccc" }

    const workedHours = weeklyData.reduce((sum, day) => {
        return sum + day.hours
    }, 0)

    const daysWorked = Math.min(todayIndex, 5)
    const maxPossibleHours = daysWorked * MAX_HOURS_PER_DAY

    const weeklySummaryPercent = maxPossibleHours > 0
        ? Math.round((workedHours / maxPossibleHours) * 100)
        : 0


    // โปรไฟล์ของพนักงานคนนั้น ๆ
    const EmployeeProfile = employeeData ? (
        <div className='d-flex justify-content-center mt-6'>
            <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center w-80">

                <img
                    src={employeeData.profile}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover mb-3"
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


    

    const ApprovePage = (

        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                <Link to="/datacheck" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="fw-bold">Work Hours Tracker</h3>
                <div className="me-4"></div>
            </div>


            {/* profile พนักงาน */}
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

                        <ProgressBar className='mb-3'
                            style={{ height: '20px', backgroundColor: '#ccc' }}>

                            <ProgressBar now={today.percent} key={1}
                                style={{ backgroundColor: today.color }} />

                        </ProgressBar>

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

                            <div style={{ height: '20px', backgroundColor: '#ccc', borderRadius: '4px', overflow: 'hidden' }}>

                                <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: item.color }} />

                            </div>

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

                    <ProgressBar className='mb-4'
                        style={{ height: '20px', backgroundColor: '#ccc' }}>

                        <ProgressBar now={weeklySummaryPercent}
                            style={{ backgroundColor: '#6D29F6' }} />

                    </ProgressBar>

                    <div className='fw-bold text-center'>
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


            {/* ของวันนี้ */}
            <div className='d-flex justify-content-center mt-10'>
                <div className="p-4 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <h4 className="mt-2 mb-4 fw-bold">Today - {todayName}</h4>
                    <div className='p-2'>

                        <div className='d-flex justify-content-between mb-2'>
                            <span className='fw-bold'>Worked: {today.hours.toFixed(1)}h</span>
                            <span className='fw-bold'>Target: {MAX_HOURS_PER_DAY}h</span>
                        </div>

                        <ProgressBar className='mb-3'
                            style={{ height: '20px', backgroundColor: '#ccc' }}>

                            <ProgressBar now={today.percent} key={1}
                                style={{ backgroundColor: today.color }} />

                        </ProgressBar>

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

                            <div style={{ height: '20px', backgroundColor: '#ccc', borderRadius: '4px', overflow: 'hidden' }}>

                                <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: item.color }} />

                            </div>

                        </div>
                    ))}

                </div>
            </div>

        </div>
    )



    return role === "approver" ? ApprovePage : Userpage

}

export default WorkHoursTracker