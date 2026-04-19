import { Outlet } from "react-router-dom"
import Sidebar from "../component/Sidebar"
import styles from "./AppLayouts.module.css"

const AppLayouts = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayouts