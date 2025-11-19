import { Outlet } from "react-router-dom"
import AppNavbar from "../components/AppNavbar"

const AppLayout = () => {
    return (

        

        <div className="app-container">
            
            {/* flex-grow-1 ทำให้ชิดขอบ / overflow-auto เผื่อข้อมูลมันล้นจะได้ scroll ได้  */}
            <div className="flex-grow-1 overflow-auto">
                <Outlet /> 
            </div>

            <div className="bg-[#252A46] p-1">
                <AppNavbar />
            </div>
        </div>

    )
}

export default AppLayout