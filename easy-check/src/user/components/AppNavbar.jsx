import { Link } from "react-router-dom"

const AppNavbar = () => {
    return (
        <div className="d-flex justify-content-between bg-warning w-100">
            <Link to={'home'}>
                <i className="bi bi-house-fill text-dark fs-4"></i>
            </Link>
            <Link to={'event'}>
                <i className="bi bi-calendar-event-fill text-dark fs-4"></i>
            </Link>
            <Link to={'setting'}>
                <i className="bi bi-gear-fill text-dark fs-4"></i>
            </Link>
        </div>
    )
}

export default AppNavbar