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


    const hoursData = {
        Monday: 80,
        Tuesday: 60,
        Wednesday: 100,
        Thursday: 50,
        Friday: 90,
    }


    // กำหนดชื่อวันโดยเรียงตาม date 0-6
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    // new Date() บอกว่าวันนี้วันที่ 17 ซึ่งตรงกับวันจันทร์ getDay() ก็จะส่งเลข 1
    // และ dayNames ที่เรากำหนดไว้ก็คือเรียงให้มันตรงกับค่าของมัน

    const todayIndex = new Date().getDay() // วันปัจจุบันจริง ๆ แต่เป็นเลข 0-6
    const todayName = dayNames[todayIndex] // วันปัจจุบันที่เป็นชื่อวัน เช่น todayIndex คือ 1 / todayName คือ Monday



    // item มันก็คือ objects ของวันนั้น ๆ
    const weeklyData = weekTemplate.map(item => {


        // dayNames.indexOf(item.day) จะได้ ตำแหน่งของวันนั้นในสัปดาห์ เช่นแบบ dayNames.indexOf("Wednesday") คืนค่า 3 
        const itemIndex = dayNames.indexOf(item.day) // itemIndex = เลขลำดับวันนั้นๆ

        const reached = itemIndex <= todayIndex
        return {
            ...item,
            percent: reached ? (hoursData[item.day] ?? 0) : 0, // ให้เห็นภาพก็แบบ hoursData["Monday"] → 80 ?? คือเช็คว่ามีวันไหนเป็น undefind ไหม ถ้ามีจะเป็น 0 ซึ่งสมมติใน array มีค่าเป็น 0 ก็ถือว่ามีนะ ต้องไม่ใส่ค่าให้มันถึงเป็น undefind
            color: reached ? item.color : "#ccc"
        }
    })


    // .find() มันคือของอย่างที่แรกที่ระบบเจอและตรงตามเงื่อนไข
    // today อันนี้คือพอเช็คแล้วว่า d => d.day === todayName ถูกไหม ถ้าถูกมันจะได้ชุดผลลัพธ์ทั้งหมดเลย เช่น วันจันทร์ สีเหลือง 80%
    const today = weeklyData.find(d => d.day === todayName) ?? { percent: 0, color: "#ccc" }

    // d = ตัวแทนของ แต่ละออบเจ็กต์ใน weeklyData (แบบทั้งหมด day,color,percent) ทีละตัว ซึ่ง d.day ก็คือเฉพาะ day
    // ซึ่ง todayName = วันของปัจจุบัน
    // d => d.day === todayName อันนี้คือเฉพาะวันแบบ Monday Tuesday Wednesday / weeklyData ถึงจะเป็นวันที่แบบตัวเลข



    const MAX_HOURS_PER_DAY = 9
    
    // sum = ผลรวม   day = ของใน array  -------------------- เวลาทำงานจริงจ้า --------------------
    // .reduce คือการเอาของใน array มาค่อยๆ ทำอะไรสักอย่างกัน โดยส่งผลลัพธ์ไปเรื่อยๆ ในทีนี้คือ บวก
    const workedHours = weeklyData.reduce((sum, day) => {
        // แปลง % เป็นชั่วโมง (9 ชม. = 100%)
        const hours = (day.percent / 100) * MAX_HOURS_PER_DAY
        return sum + hours
    }, 0) // 0 ตรงนี้คือให้ sum มีค่าเริ่มต้นเป็น 0


    // เอาไว้บอกว่าตอนนี้เราทำงานไปกี่วันแล้ว
    const daysWorked = Math.min(todayIndex, 5) // Math.min(.., ..) คือมันเลือกตัวที่น้อยที่สุดระหว่างสองตัวนี้ ดังนั้นค่าของ daysWorked คือจำนวนวันที่ทำงานไปแล้วในวีคนี้
    const maxPossibleHours = daysWorked * MAX_HOURS_PER_DAY // จำนวนชั่วโมงสูงสุดที่เข้าทำงาน *นับแค่วันที่ทำงานแล้ว*

    
    // สรุปเปอร์เซ็นต์รวม
    const weeklySummaryPercent = maxPossibleHours > 0 
        // Math.round คือปัดเศษตามค่าความเป็นจริง
        ? Math.round((workedHours / maxPossibleHours) * 100) : 0 // ถ้าหล่อนไม่เคยทำงานเลยก็ 0 จ่ะ


    // ส่วนแสดงโปรไฟล์พนักงาน (สำหรับ Approver เท่านั้น)
    const EmployeeProfile = employeeData ? (
        <div className='d-flex justify-content-center mt-6'>
            <div className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 w-80">
                <img src={employeeData.profile} alt="profile"
                    className="w-16 h-16 rounded-full object-cover"/>
                <div className="flex-1">
                    <div className="text-gray-800 font-semibold fs-5">{employeeData.name}</div>
                    <div className="text-sm text-black">ID: {employeeData.employeeId}</div>
                </div>
            </div>
        </div>
    ) : null


    // component ของ Approver
    const ApprovePage = (

        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/datacheck" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="fw-bold">Work Hours Tracker</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>

            {/* แสดงโปรไฟล์พนักงาน (สำหรับ Approver) */}
            {EmployeeProfile}

            {/* ขแงวันนี้ */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <h4 className="mt-3 mb-3 fw-bold">Today</h4>
                    <div className='p-1'>

                        <ProgressBar className='mb-3'
                            style={{ height: '20px', backgroundColor: '#ccc' }}>

                            <ProgressBar className='text-black' now={today.percent} key={1} label={`${today.percent}%`}
                                style={{ backgroundColor: today.color }} />

                        </ProgressBar>

                    </div>

                </div>
            </div>



            {/* รายสัปดาห์ */}
            <div className='d-flex justify-content-center mt-8'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <h4 className="mt-3 mb-6 fw-bold">Weekly</h4>


                    {weeklyData.map((item, index) => (
                        <div key={index} className='mb-3 ml-1 mr-1'>

                            {/* ชื่อกับเปอร์เซนต์ที่แสดง */}
                            <div className='d-flex justify-content-between mb-1'>
                                <span>{item.day}</span>
                                <span>{item.percent}%</span>
                            </div>

                            {/* container ของ progress bar */}
                            <div style={{ height: '20px', backgroundColor: '#ccc', borderRadius: '4px', overflow: 'hidden', }}>

                                {/* bar สี */}
                                <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: item.color }} />

                            </div>


                        </div>
                    ))}

                </div>
            </div>


            {/* กล่องรวม */}
            <div className='d-flex justify-content-center mt-10 mb-3'>
                <div className="p-3 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>


                    <h4 className="mt-2 mb-4 fw-bold">Weekly Summary</h4>

                    <ProgressBar className='mb-6'
                        style={{ height: '20px', backgroundColor: '#ccc' }}>

                        <ProgressBar className='text-black' now={weeklySummaryPercent} label={`${weeklySummaryPercent}%`}
                            style={{ backgroundColor: '#6D29F6' }}/>

                    </ProgressBar>


                    <div>
                        {/* <mark className="p-1 rounded-3 mr-2">Total Hours: </mark>
                        <span className='fw-bold'>{workedHours.toFixed(1)} hours By {maxPossibleHours} hours</span> */}
                        <span className='fw-bold'>Total Hours: </span>
                        <mark className="p-1 rounded-3">{workedHours.toFixed(1)} hours By {maxPossibleHours} hours</mark>
                    </div>


                </div>
            </div>



        </div>
    )



    // component ของ User ทั่วไป
    const Userpage = (

        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/home" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="fw-bold">Work Hours Tracker</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            {/* ขแงวันนี้ */}
            <div className='d-flex justify-content-center mt-10'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <h4 className="mt-3 mb-3 fw-bold">Today</h4>
                    <div className='p-1'>

                        <ProgressBar className='mb-3'
                            style={{ height: '20px', backgroundColor: '#ccc' }}>

                            <ProgressBar className='text-black' now={today.percent} key={1} label={`${today.percent}%`}
                                style={{ backgroundColor: today.color }} />

                        </ProgressBar>

                    </div>

                </div>
            </div>



            {/* รายสัปดาห์ */}
            <div className='d-flex justify-content-center mt-8'>
                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <h4 className="mt-3 mb-6 fw-bold">Weekly</h4>


                    {weeklyData.map((item, index) => (
                        <div key={index} className='mb-3 ml-1 mr-1 text-start'>

                            {/* ชื่อกับเปอร์เซนต์ที่แสดง */}
                            <div className='d-flex justify-content-between mb-1'>
                                <span>{item.day}</span>
                                <span>{item.percent}%</span>
                            </div>

                            {/* container ของ progress bar */}
                            <div style={{ height: '20px', backgroundColor: '#ccc', borderRadius: '4px', overflow: 'hidden', }}>

                                {/* bar สี */}
                                <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: item.color }} />

                            </div>


                        </div>
                    ))}

                </div>
            </div>



        </div>
    )

    //  ถ้า user ที่ login เข้ามาเป็น role approver ให้แสดงหน้า ApprovePage ถ้าไม่ใช่ค่อยให้แสดงหน้า Userpage
    return role === "approver" ? ApprovePage : Userpage



}

export default WorkHoursTracker