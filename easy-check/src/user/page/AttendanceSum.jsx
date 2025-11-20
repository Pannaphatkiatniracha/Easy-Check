import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const AttendanceSum = ({ role }) => {

    const onTimes = [
        "2025-10-01", "2025-10-02", "2025-10-03", "2025-10-06", "2025-10-07", 
        "2025-10-08", "2025-10-10", "2025-10-13", "2025-10-15", "2025-10-16", 
        "2025-10-17", "2025-10-20", "2025-10-21", "2025-10-22", "2025-10-24", 
        "2025-10-27", "2025-10-29"
    ]

    const lates = [
        "2025-10-09", "2025-10-14", "2025-10-23", "2025-10-28",
    ]

    const leaves = [
        "2025-10-30"
    ]

    const allRecords = [...onTimes, ...lates, ...leaves]

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({behavior: "smooth"})
    }

    // Component สำหรับแสดงวันที่ในรูปแบบ Grid - แถวละ 2 วัน
    const DateGrid = ({ dates, title, color }) => (
        <div className="mb-6">
            <h4 className="fw-bold mb-3 text-black">
                {title} <span className="badge bg-dark ms-2">{dates.length} วัน</span>
            </h4>
            <div className="row g-2">
                {dates.map((date, index) => (
                    <div key={index} className="col-6">  {/* ← แก้จาก col-6 col-md-4 col-lg-3 เป็น col-6 */}
                        <div className="bg-white bg-opacity-90 rounded-2 p-2 text-center shadow-sm">
                            <small className="fw-semibold" style={{ color: color }}>{date}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const SummaryCard = (
        <div className="app-container">
            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to={role === "approver" ? "/datacheck" : "/home"} className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Attendance Summary</h3>
                <div className="me-4"></div>
            </div>

            {/* กล่องรวมสถิติ */}
            <div className='d-flex justify-content-center mt-10'>
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
                            onClick={() => scrollToSection("all")}
                            style={{ backgroundColor: '#252A46', border: 'none', borderRadius: '12px' }}>
                            <i className="bi bi-list-ul me-2"></i>
                            All: {allRecords.length}
                        </Button>
                    </div>
                </div>
            </div>

            {/* รายละเอียดแบบ Grid */}
            <div className='d-flex justify-content-center mt-8 mb-12'>
                <div className='rounded-3 w-80 p-4'
                    style={{ background: 'linear-gradient(to bottom right, #D9D9D9, #636CCB)' }}>

                    {/* On Time - สีเขียว */}
                    <div id="ontime" className="mb-6">
                        <DateGrid 
                            dates={onTimes} 
                            title="On Time Details" 
                            color="#1CA983"
                        />
                    </div>

                    {/* Late - สีแดง */}
                    <div id="late" className="mb-6">
                        <DateGrid 
                            dates={lates} 
                            title="Late Details" 
                            color="#D06356"
                        />
                    </div>

                    {/* Leave - สีเหลือง */}
                    <div id="leave" className="mb-6">
                        <DateGrid 
                            dates={leaves} 
                            title="Leave Details" 
                            color="#C7C76E"
                        />
                    </div>

                    {/* All Records - สีดำ */}
                    <div id="all">
                        <DateGrid 
                            dates={allRecords} 
                            title="All Records" 
                            color="#252A46"
                        />
                    </div>

                </div>
            </div>
        </div>
    )

    return SummaryCard
}

export default AttendanceSum