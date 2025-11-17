import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from "react-router-dom";

const Setting = ({ role }) => {


    const navigate = useNavigate()


    // ฟังก์ชัน logout
    const handleLogout = () => {
        localStorage.removeItem('token') // ล้าง token
        navigate('/login')            // redirect ไปหน้า login
    }


    // component ของ Approver
    const ApprovePage = (

        // หัวข้อ
        <div>
            <div className="text-center text-white mt-16">
                <h2 className="fw-bold">Setting</h2>
            </div>


            {/* โนติ */}
            <div className="d-flex justify-content-center mt-5">

                <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold
                hover:scale-105 transition-all duration-200 ease-in-out"
                style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <i className="bi bi-bell-fill fs-4 "></i> &nbsp; Notification
                    <Form.Check className="ms-auto"
                        type="switch"
                        id="custom-switch"
                    />
                </div>
            </div>


            {/* Edit Profile */}
            <Link to="/approveprofile" className='text-decoration-none d-block'>
                <div className="d-flex justify-content-center mt-3">

                    <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                        <i className="bi bi-pencil-fill"></i> &nbsp; Edit Profile
                        <div className='ms-auto'>
                            <i className="bi bi-chevron-right"></i>
                        </div>

                    </div>
                </div>
            </Link>


            {/* Privacy Policy */}
            <Link to="/privacypolicy" className='text-decoration-none d-block'>

                <div className="d-flex justify-content-center mt-3">

                    <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                        <i className="bi bi-shield-lock-fill"></i> &nbsp; Privacy Policy
                        <div className='ms-auto'>
                            <i className="bi bi-chevron-right"></i>
                        </div>

                    </div>
                </div>
            </Link>


            {/* Log out */}
            <div className="d-flex justify-content-center mt-3"
            onClick={handleLogout} style={{ cursor: 'pointer' }}>

                <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold text-dark
                hover:scale-105 transition-all duration-200 ease-in-out"
                style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    &nbsp; Log out

                    <div className="ms-auto">
                        <i className="bi bi-box-arrow-right"></i>
                    </div>

                </div>
            </div>
        </div>
    )



    // component ของ User ทั่วไป
    const Userpage = (

        <div>

            {/* หัวข้อฉ่ำๆ */}
            <div className="text-center text-white mt-16">
                <h2 className="fw-bold">Setting</h2>
            </div>


            {/* Notification */}
            <div className="d-flex justify-content-center mt-5">

                <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold
                hover:scale-105 transition-all duration-200 ease-in-out"
                style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>

                    <i className="bi bi-bell-fill fs-4 "></i> &nbsp; Notification
                    <Form.Check className="ms-auto"
                        type="switch"
                        id="custom-switch"
                    />
                </div>
            </div>


            {/* Edit Profile */}
            <Link to="/userprofile" className='text-decoration-none d-block'>
                <div className="d-flex justify-content-center mt-3">

                    <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        
                        <i className="bi bi-pencil-fill"></i> &nbsp; Edit Profile
                        <div className='ms-auto'>
                            <i className="bi bi-chevron-right"></i>
                        </div>

                    </div>
                </div>
            </Link>


            {/* Privacy Policy */}
            <Link to="/privacypolicy" className='text-decoration-none d-block'>
                <div className="d-flex justify-content-center mt-3">
                    <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold text-dark
            hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-shield-lock-fill"></i> &nbsp; Privacy Policy
                        <div className='ms-auto'>
                            <i className="bi bi-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </Link>


            {/* Log out */}
            <div className="d-flex justify-content-center mt-3"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}>
                <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold text-dark
          hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    &nbsp; Log out
                    <div className="ms-auto">
                        <i className="bi bi-box-arrow-right"></i>
                    </div>
                </div>
            </div>
        </div>
    )

    //  ถ้า user ที่ login เข้ามาเป็น role approver ให้แสดงหน้า ApprovePage ถ้าไม่ใช่ค่อยให้แสดงหน้า Userpage
    return role === "approver" ? ApprovePage : Userpage

}

export default Setting