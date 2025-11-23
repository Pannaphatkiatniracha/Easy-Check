import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const DataToCheck = () => {
    
    const data = [
        {
            id: 1,
            name: "ปัณณพรรธน์ เกียรตินิรชา",
            employeeId: "010889",
            profile: "https://i.pinimg.com/736x/2f/a6/bb/2fa6bb34b6f86794f5917989a427e0a4.jpg",
        },
        {
            id: 2,
            name: "ฐิติฉัตร ศิริบุตร",
            employeeId: "010101",
            profile: "https://i.pinimg.com/736x/b4/a4/f1/b4a4f1b302296b6621b89c7d91ee9352.jpg",
        },
        {
            id: 3,
            name: "ภทรพร แซ่ลี้",
            employeeId: "110400",
            profile: "https://i.pinimg.com/736x/53/e5/ce/53e5ce1aec6f6dec22bb137680163136.jpg",
        },
    ]

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

            {/* รายชื่อ */}
            <div className="w-full space-y-4 px-4 mt-8">
                {data.map((person) => (

                    <div key={person.id}
                    className="relative bg-[#ffffff]/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-[#7f5cff]/40 
                    transform hover:-translate-y-1 hover:shadow-[0_0_15px_#7f5cff] transition duration-300 flex items-center gap-3">

                        {/* รูป profile */}
                        <img className="w-12 h-12 rounded-full border-2 border-[#7f5cff] object-cover"
                        src={person.profile} alt={person.name}/>

                        {/* กล่องชื่อ + id + ปุ่ม */}
                        <div className="flex-1">
                            <div className="font-bold text-gray-800 text-base">{person.name}</div>
                            <div className="text-xs text-gray-500">ID: {person.employeeId}</div>

                            {/* ปุ่ม */}
                            <div className="flex gap-2 mt-1">
                                <Link to="/workhourstracker"
                                      state={{ 
                                        employeeData: {
                                            name: person.name,
                                            employeeId: person.employeeId,
                                            profile: person.profile
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

        </div>
    )
}

export default DataToCheck