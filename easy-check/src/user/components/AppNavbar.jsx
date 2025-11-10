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
                className={`transition-all duration-200 
                    ${location.pathname === "/home" ? "text-white scale-125" // ใหญ่ขึ้น 25%
                        : "text-[#636CCB] hover:text-white hover:scale-110" // ใหญ่ขึ้น 10 %
                    }`}
            >
                <i className="bi bi-house-fill text-2xl"></i>
            </Link>



            <Link to="/event"
                className={`transition-all duration-200 
                    ${location.pathname === "/event" ? "text-white scale-125"
                        : "text-[#636CCB] hover:text-white hover:scale-110"
                    }`}
            >
                <i className="bi bi-calendar-event-fill text-2xl"></i>
            </Link>



            <Link to="/setting"
                className={`transition-all duration-200 
                    ${location.pathname === "/setting" ? "text-white scale-125"
                        : "text-[#636CCB] hover:text-white hover:scale-110"
                    }`}
            >
                <i className="bi bi-gear-fill text-2xl"></i>
            </Link>


        </div>
    )
}

export default AppNavbar