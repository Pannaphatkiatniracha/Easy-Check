import { Outlet } from "react-router-dom"
import Sidebar from "../component/Sidebar"


const AppLayouts = () => {
    return (
        <div>
            

            <div>
                <Sidebar />
            </div>  


            <main>
                <Outlet /> 
            </main>

        </div>
    )
}

export default AppLayouts