import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const DataCheck = () => {
    

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

                <h3 className="fw-bold">Status Check</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            {/* รายชื่อ */}
            <div className='d-flex justify-content-center mt-10'>
                <div className='w-80 space-y-4'>

                    {data.map((person) => (

                        // กล่องขาว
                        <div key={person.id}
                        className='bg-white rounded-2xl p-3 shadow-md flex items-center gap-3'>

                            <img src={person.profile} alt="profile"
                            className="w-12 h-12 rounded-full object-cover"/>


                            <div className="flex-1">
                                <div className="text-gray-800 font-semibold">{person.name}</div>
                                <div className="text-xs text-black">ID: {person.employeeId}</div>
                            </div>


                            <div className="flex flex-col gap-2 items-center">

                                <Link to="/attendancesummary" 
                                      state={{ 
                                        employeeData: {
                                            name: person.name,
                                            employeeId: person.employeeId,
                                            profile: person.profile
                                        }
                                      }}>
                                    <button className="px-3 py-1 rounded-full bg-[#6D29F6] text-white text-xs fw-semibold">
                                        Attendance
                                    </button>
                                </Link>
                                <Link to="/workhourstracker"
                                      state={{ 
                                        employeeData: {
                                            name: person.name,
                                            employeeId: person.employeeId,
                                            profile: person.profile
                                        }
                                      }}>                               
                                    <button className="px-3 py-1 rounded-full bg-[#6D29F6] text-white text-xs fw-semibold">
                                        Work Hours
                                    </button>
                                </Link>
                            </div>


                        </div>
                    ))}

                </div>
            </div>



        </div>
    )
}

export default DataCheck