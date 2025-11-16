import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const AttendanceSum = () => {

    const onTimes = [
        "2025-01-02",
        "2025-01-03",
        "2025-01-06",
        "2025-01-07",
        "2025-01-08",
        "2025-01-09",
        "2025-01-10",
        "2025-01-13",
        "2025-01-14",
        "2025-01-15",
        "2025-01-17",
        "2025-01-20",
        "2025-01-21",
        "2025-01-22",
        "2025-01-24",
        "2025-01-27",
        "2025-01-29",
        "2025-01-30",
    ]

    const lates = [
        "2025-01-16",
        "2025-01-23",
        "2025-01-31",
    ]

    const leaves = [
        "2025-01-28", 
    ]

    const allRecords = [...onTimes, ...lates, ...leaves]


    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth"
        })
    }

    return (

        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/home" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="fw-bold">Attendance Summary</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>



            <div className='d-flex justify-content-center mt-10'>

                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>


                    <div className='grid grid-cols-4 gap-1 p-3 mt-6'>

                        <Button className='rounded w-100 p-1 text-white fw-semibold
                        hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#1CA983', border: 'none' }}
                            onClick={() => scrollToSection("ontime")}>
                            On time
                        </Button>
                        <span>{onTimes.length} times</span>


                        <Button className='rounded w-100 p-1 text-white fw-semibold
                        hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#D06356', border: 'none' }}
                            onClick={() => scrollToSection("late")}>
                            Late
                        </Button>
                        <span>{lates.length} times</span>


                        <Button className='rounded w-100 p-1 text-white fw-semibold
                        hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#C7C76E', border: 'none' }}
                            onClick={() => scrollToSection("leave")}>
                            Leave
                        </Button>
                        <span>{leaves.length} times</span>


                        <Button className='rounded w-100 p-1 text-white fw-semibold
                        hover:scale-105 transition-all duration-200 ease-in-out'
                        onClick={() => scrollToSection("all")}
                            style={{ backgroundColor: '#252A46', border: 'none' }}>
                            All
                        </Button>
                        <span>{allRecords.length} records</span>

                    </div>

                </div>

            </div>



            <div className="mt-1 p-4 text-white">

                {/* On Time */}
                <h3 id="ontime" className="mt-4">
                    On Time Details
                </h3>
                <ul>
                    {onTimes.map((d, i) => <li key={i}>{d}</li>)}
                </ul>


                {/* Late */}
                <h3 id="late" className="mt-6">
                    Late Details
                </h3>
                <ul>
                    {lates.map((d, i) => <li key={i}>{d}</li>)}
                </ul>


                {/* Leave */}
                <h3 id="leave" className="mt-6">
                    Leave Details
                </h3>
                <ul>
                    {leaves.map((d, i) => <li key={i}>{d}</li>)}
                </ul>


                {/* All */}
                <h3 id="all" className="mt-6">
                    All Records
                </h3>
                <ul>
                    {allRecords.map((d, i) => <li key={i}>{d}</li>)}
                </ul>

            </div>



        </div>
    )
}

export default AttendanceSum