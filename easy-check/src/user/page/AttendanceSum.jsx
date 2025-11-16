import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const AttendanceSum = () => {

    const onTimes = [
        "2025-10-01",
        "2025-10-02",
        "2025-10-03",
        "2025-10-06",
        "2025-10-07",
        "2025-10-08",
        "2025-10-10",
        "2025-10-13",
        "2025-10-15",
        "2025-10-16",
        "2025-10-17",
        "2025-10-20",
        "2025-10-21",
        "2025-10-22",
        "2025-10-24",
        "2025-10-27",
        "2025-10-29"
    ]

    const lates = [
        "2025-10-09",
        "2025-10-14",
        "2025-10-23",
        "2025-10-28",
    ]

    const leaves = [
        "2025-10-30"
    ]


    // ระเบิด array ตรงนี้เหมือนเอาทุก array มารวมกันอะ
    const allRecords = [...onTimes, ...lates, ...leaves]


    const scrollToSection = (id) => {
        // เหมือนบอกนางว่าพี่สาวช่วยหากล่องที่ตรงกับ id นี้หน่อยจ่ะ 👁️👄👁️ ?. ก็คือถ้าหา id นี้ไม่เจอก็ไม่เป็น ไม่ error จ่ะ จะอยู่อย่างสงบเสงี่ยม
        document.getElementById(id)?.
        scrollIntoView({behavior: "smooth"})
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


            {/* กล่องรวม */}
            <div className='d-flex justify-content-center mt-10'>

                <div className="p-2 px-1 text-center fw-semibold rounded-3 text-dark w-80"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <h4 className="mt-3 fw-bold">October 2025 Summary</h4>

                    {/* เนื้อหาข้างใน */}
                    <div className='grid grid-cols-2 gap-2 p-3 mt-3'>

                        <Button className='w-100 p-1 text-white fw-semibold
                        hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#1CA983', border: 'none', borderRadius: '12px' }}
                            onClick={() => scrollToSection("ontime")}>
                            On time: {onTimes.length} times
                        </Button>
                        {/* <span>{onTimes.length} times</span> */}


                        <Button className='w-100 p-1 text-white fw-semibold
                        hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#D06356', border: 'none', borderRadius: '12px' }}
                            onClick={() => scrollToSection("late")}>
                            Late: {lates.length} times
                        </Button>
                        {/* <span>{lates.length} times</span> */}


                        <Button className='w-100 p-1 text-white fw-semibold mt-3
                        hover:scale-105 transition-all duration-200 ease-in-out'
                            style={{ backgroundColor: '#C7C76E', border: 'none', borderRadius: '12px' }}
                            onClick={() => scrollToSection("leave")}>
                            Leave: {leaves.length} times
                        </Button>
                        {/* <span className='mt-3'>{leaves.length} times</span> */}


                        <Button className='w-100 p-1 text-white fw-semibold mt-3
                        hover:scale-105 transition-all duration-200 ease-in-out'
                            onClick={() => scrollToSection("all")}
                            style={{ backgroundColor: '#252A46', border: 'none', borderRadius: '12px' }}>
                            All: {allRecords.length} times
                        </Button>
                        {/* <span className='mt-3'>{allRecords.length} times</span> */}

                    </div>

                </div>

            </div>


            <div className='d-flex justify-content-center mt-8 mb-12'>
                <div className='rounded-3 text-dark w-80'
                style={{ background: 'linear-gradient(to bottom right, #D9D9D9, #636CCB)' }}>

                <div className="mt-1 p-4">

                    {/* On Time */}
                    <h3 id="ontime" className='fw-bold'>
                        On Time Details
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {/* 
                            มันเป็นค่า default ของ .map() ว่าตัวแรกคือค่าหรือข้อมูลของตัวนั้น ตัวสองคือลำดับหรือ index ไรงี้
                            d = ค่าของวันนั้นๆ / i = เลขลำดับของวันนั้นใน array
                         */}
                        {onTimes.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>


                    {/* Late */}
                    <h3 id="late" className="mt-6 fw-bold">
                        Late Details
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {lates.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>


                    {/* Leave */}
                    <h3 id="leave" className="mt-6 fw-bold">
                        Leave Details
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {leaves.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>


                    {/* All */}
                    <h3 id="all" className="mt-6 fw-bold">
                        All Records
                    </h3>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {allRecords.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>

                </div>
                </div>

            </div>




        </div>
    )
}

export default AttendanceSum