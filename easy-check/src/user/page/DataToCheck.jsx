import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';

const DataToCheck = () => {
    
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users")
                const employees = await res.json()
                setData(employees)
            } catch (error) {
                console.error("Error loading employees:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])   //ทำครั้งเดียวตอนหน้าเว็บโหลด



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

                <h3 className="fw-bold">Work Hours Check</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            {/* Loading State */}
            {loading && (
                <div className="text-center text-white mt-8">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading...</p>
                </div>
            )}

            {/* รายชื่อ */}
            {!loading && (
                <div className="w-full space-y-4 px-4 mt-8">
                    {data.map((person) => (

                        <div key={person.id}
                        className="relative bg-[#ffffff]/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-[#7f5cff]/40 
                        transform hover:-translate-y-1 hover:shadow-[0_0_15px_#7f5cff] transition duration-300 flex items-center gap-3">

                            {/* รูป profile - ใช้ avatar จาก MockAPI */}
                            <img className="w-12 h-12 rounded-full border-2 border-[#7f5cff] object-cover"
                            src={person.avatar} alt={person.name}/>

                            {/* กล่องชื่อ + id + ปุ่ม */}
                            <div className="flex-1">
                                <div className="font-bold text-gray-800 text-base">{person.name}</div>
                                <div className="text-xs text-gray-500">ID: {person.userid}</div>

                                {/* ปุ่ม */}
                                <div className="flex gap-2 mt-1">
                                    <Link to="/workhourstracker"
                                          state={{ 
                                            employeeData: {
                                                name: person.name,
                                                employeeId: person.userid,
                                                profile: person.avatar,
                                                shift: person.shift
                                            }}}
                                          className="flex-1">
                                        <button className="w-full py-1 rounded-full bg-gradient-to-r from-[#6D29F6] to-[#4c1ca3] text-white font-semibold text-xs shadow hover:shadow-[0_0_10px_#6D29F6] transition">
                                            Work Hours
                                        </button>
                                    </Link>
                                </div>

                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default DataToCheck