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
            profile: "https://img.hankyung.com/photo/202509/BF.41797059.1.jpg",
        },
        {
            id: 3,
            name: "ภทรพร แซ่ลี้",
            employeeId: "110400",
            profile: "https://pbs.twimg.com/media/GurZlQBagAA3-Z0.jpg:large",
        },
        {
            id: 4,
            name: "ฐนิก ทรัพย์โนนหวาย",
            employeeId: "130901",
            profile: "https://cnc-magazine.oramiland.com/parenting/images/Sungchan_2.width-800.format-webp.webp",
        },
        {
            id: 5,
            name: "สราสินีย์ บุญมา",
            employeeId: "030996",
            profile: "https://pm1.aminoapps.com/7490/987663ecbeba45008c74d8dfc5c7332094bf4780r1-540-515v2_hq.jpg",
        },
        {
            id: 6,
            name: "กรณ์นภัส เศรษฐรัตนพงศ์",
            employeeId: "270502",
            profile: "https://www.workpointtoday.com/_next/image?url=https%3A%2F%2Fimages.workpointtoday.com%2Fworkpointnews%2F2025%2F08%2F22145353%2F1755849232_726522-workpointtoday.webp&w=2048&q=75",
        },
        {
            id: 7,
            name: "ศิริลักษณ์ คอง",
            employeeId: "1110495",
            profile: "https://www.siamzone.com/ig/media/6927166/3418396622193635427-1.jpg",
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
                                <Link to="/attendancesummary" 
                                      state={{ 
                                        employeeData: {
                                            name: person.name,
                                            employeeId: person.employeeId,
                                            profile: person.profile
                                        }}}
                                      className="flex-1">
                                    <button className="w-full py-1 rounded-full bg-gradient-to-r from-[#34ffb9] to-[#12c27e] text-black font-semibold text-xs shadow hover:shadow-[0_0_10px_#34ffb9] transition">
                                        Attendance
                                    </button>
                                </Link>


                                {/* <Link to="/workhourstracker"
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
                                </Link> */}
                            </div>


                        </div>

                    </div>
                ))}
            </div>



        </div>
    )
}

export default DataCheck