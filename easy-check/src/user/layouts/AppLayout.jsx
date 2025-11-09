import { Outlet } from "react-router-dom"
import AppNavbar from "../components/AppNavbar"

const AppLayout = () => {
    return (

        

        <div className="app-container">
            <div className="flex-grow-1 overflow-auto">
                {/* ใน route จะมาแสดงใน Outlet */}
                <Outlet /> 
            </div>

            <div className="bg-[#252A46] p-3">
                <AppNavbar />
            </div>
        </div>

    )
}

export default AppLayout