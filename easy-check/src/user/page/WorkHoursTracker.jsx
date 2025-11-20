import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

const WorkHoursTracker = ({ role }) => {

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

    // ผลลัพธ์คือ todayIndex = 1 todayName = "Monday"
    const todayIndex = new Date().getDay() // วันปัจจุบันจริง ๆ
    const todayName = dayNames[todayIndex]



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

    const MAX_HOURS_PER_DAY = 9;

    // ชั่วโมงที่ทำจริงจนถึงวันนี้
    const workedHours = weekTemplate.reduce((sum, d) => {
        const index = dayNames.indexOf(d.day);
        if (index <= todayIndex) {
            return sum + (hoursData[d.day] ?? 0);
        }
        return sum;
    }, 0);

    // ชั่วโมงสูงสุดที่ทำได้ตามวันปัจจุบัน
    const maxPossibleHours = Math.min(todayIndex, 5) * MAX_HOURS_PER_DAY;

    // สรุปเปอร์เซ็นต์รวม
    const weeklySummaryPercent =
        maxPossibleHours > 0
            ? Math.round((workedHours / maxPossibleHours) * 100)
            : 0;

    // component ของ Approver
    const ApprovePage = (

        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/" className='text-decoration-none'>
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
                            <div
                                style={{
                                    height: '20px',
                                    backgroundColor: '#ccc',  // สี track ด้านหลัง
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* bar สี */}
                                <div
                                    style={{
                                        width: `${item.percent}%`,
                                        height: '100%',
                                        backgroundColor: item.color, // สี progress bar ของเรา
                                    }}
                                />
                            </div>

                        </div>
                    ))}

                </div>
            </div>


            {/* กล่องรวม */}
            <div className='d-flex justify-content-center mt-10'>
                <div className="p-3 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <h4 className="mt-2 mb-4 fw-bold">Weekly Summary</h4>

                    <ProgressBar className='mb-3'
                        style={{ height: '20px', backgroundColor: '#ccc' }}>
                        <ProgressBar
                            now={weeklySummaryPercent}
                            label={`${weeklySummaryPercent}%`}
                            style={{ backgroundColor: '#4CAF50' }}
                        />
                    </ProgressBar>

                    <p className='mt-2'>
                        Total Hours: <span className='fw-bold'>{workedHours}</span> hours
                    </p>

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
                            <div
                                style={{
                                    height: '20px',
                                    backgroundColor: '#ccc',  // สี track ด้านหลัง
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* bar สี */}
                                <div
                                    style={{
                                        width: `${item.percent}%`,
                                        height: '100%',
                                        backgroundColor: item.color, // สี progress bar ของเรา
                                    }}
                                />
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