import { Link } from "react-router-dom"

const AppNavbar = () => {
    return (
        <div className="d-flex justify-content-between w-100">
            <Link to={'home'}>
                <i className="bi bi-house-fill text-[#636CCB] fs-4"></i>
            </Link>
            <Link to={'event'}>
                <i className="bi bi-calendar-event-fill text-[#636CCB] fs-4"></i>
            </Link>
            <Link to={'setting'}>
                <i className="bi bi-gear-fill text-[#636CCB] fs-4"></i>
            </Link>
        </div>
    )
}

export default AppNavbar