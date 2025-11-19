import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


const AppNavbar = () => {

    // เอาไว้เก็บ path ของหน้าที่เราเปิดอยู่ปัจจุบัน
    const location = useLocation()

    return (

        <div className="flex justify-between w-full bg-[#252A46] p-3">
            
            {/* 
                transition-all = เปลี่ยนทั้งหมดแบบสมูท ๆ
                duration-200 = ความเร็วในการเปลี่ยน 0.2 s
                `` for code + string ผสมกัน ซึ่งโค้ดก็คือ ${...} ส่วนที่เหลือเป็น string หมด
            */}

            <Link  to="/home"
                className={`transition-all duration-200 flex flex-col items-center text-decoration-none
                    ${location.pathname === "/home" ? "text-white scale-110" // ใหญ่ขึ้น 10%
                        : "text-[#636CCB] hover:text-white hover:scale-105" // ใหญ่ขึ้น 10 %
                    }`}>
                <i className="bi bi-house-fill text-2xl"></i>
                <span className="text-sm mt-1">Home</span>
            </Link>



            <Link to="/event"
                className={`transition-all duration-200 flex flex-col items-center text-decoration-none
                    ${location.pathname === "/event" ? "text-white scale-110"
                        : "text-[#636CCB] hover:text-white hover:scale-105"
                    }`}>
                <i className="bi bi-calendar-event-fill text-2xl"></i>
                <span className="text-sm mt-1">Event</span>
            </Link>



            <Link to="/setting"
                className={`transition-all duration-200 flex flex-col items-center text-decoration-none
                    ${location.pathname === "/setting" ? "text-white scale-110"
                        : "text-[#636CCB] hover:text-white hover:scale-105"
                    }`}>
                <i className="bi bi-gear-fill text-2xl"></i>
                <span className="text-sm mt-1">Setting</span>
            </Link>


        </div>
    )
}

export default AppNavbar