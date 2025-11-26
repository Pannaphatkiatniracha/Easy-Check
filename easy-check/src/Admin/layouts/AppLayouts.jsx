import { Outlet } from "react-router-dom"
import Sidebar from "../component/Sidebar"


const AppLayouts = () => {
    return (
        <div className="flex min-h-screen">
            

            <div className="w-80 bg-white shadow-lg">
                <Sidebar />
            </div>  


            <main className="flex-1 p-6 overflow-auto">
                <Outlet /> 
            </main>

        </div>
    )
}

export default AppLayouts