import { Outlet } from "react-router-dom"
import Sidebar from "../component/Sidebar"


const AppLayouts = () => {
    return (
        <div>
            

            <div className="layout">
                <Sidebar />
            </div>  


            <main sclassName="mainContent">
                <Outlet /> 
            </main>

        </div>
    )
}

export default AppLayouts