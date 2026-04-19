import { Outlet } from "react-router-dom"
import Sidebar from "../component/Sidebar"
import styles from "./AppLayouts.module.css"

const AppLayouts = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main
                className={styles.mainContent}
                style={{
                    marginLeft: "260px", 
                    width: "calc(100% - 260px)",
                    minHeight: "100vh"
                }}
            >
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayouts