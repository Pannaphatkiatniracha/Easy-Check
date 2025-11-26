import { Outlet } from "react-router-dom"
import Sidebar from "../component/Sidebar"

const AppLayout = () => {
    return (

        

        <div className="app-container">

            <div>
                <Sidebar />
            </div>  

            {/* flex-grow-1 ทำให้ชิดขอบ / overflow-auto เผื่อข้อมูลมันล้นจะได้ scroll ได้  */}
            <main>
                <Outlet /> 
            </main>


        </div>

    )
}

export default AppLayout