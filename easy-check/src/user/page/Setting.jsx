import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

const Setting = () => {
    return (

        <div>

            
            {/* หัวข้อ */}
            <div className="text-center text-[#F26623] mt-16">
                <h2 className="fw-normal">Setting</h2>
            </div>


            {/* โนติ */}
            <div className="d-flex justify-content-center mt-5">
                  {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                    duration-200 = ความเร็ว 0.2 s 
                    ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}
                <div className="w-75 p-2 rounded bg-warning d-flex align-items-center fw-semibold
                hover:scale-105 transition-all duration-200 ease-in-out">
                    <i className="bi bi-bell-fill fs-4"></i> &nbsp; Notification


                        {/* ms คือ margin start พอเป็น ms-auto ก็คือเป็น LTR จาก L ดัน R */}
                        <Form.Check className="ms-auto" // prettier-ignore
                            type="switch"
                            id="custom-switch"
                        />
                </div>
            </div>


            {/* dark/light mode */}
            <div className="d-flex justify-content-center mt-3">
                <div className="w-75 p-2 rounded bg-warning d-flex align-items-center fw-semibold
                hover:scale-105 transition-all duration-200 ease-in-out">
                    <i className="bi bi-circle-half"></i> &nbsp; Dark Mode

                        {/* ms คือ margin start พอเป็น ms-auto ก็คือเป็น LTR จาก L ดัน R */}
                        <Form.Check className="ms-auto" // prettier-ignore
                            type="switch"
                            id="custom-switch"
                        />
                </div>
            </div>



            {/* edit profile */}
            <Link to="/profile" className='text-decoration-none d-block'>            
                <div className="d-flex justify-content-center mt-3">
                    <div className="w-75 p-2 rounded bg-warning d-flex align-items-center fw-semibold text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out">
                        <i className="bi bi-pencil-fill"></i> &nbsp; Edit Profile 

                    <div className='ms-auto'>
                        <i className="bi bi-chevron-right"></i>
                    </div>
                    </div>
                </div>
            </Link>



            {/* ไพรเวทซี่ชีกึม */}
            <Link to="/" className='text-decoration-none d-block'>            
                <div className="d-flex justify-content-center mt-3">
                    <div className="w-75 p-2 rounded bg-warning d-flex align-items-center fw-semibold text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out">
                        <i className="bi bi-shield-lock-fill"></i> &nbsp; Privacy Policy

                    <div className='ms-auto'>
                        <i className="bi bi-chevron-right"></i>
                    </div>
                    </div>
                </div>
            </Link>



            {/* log out */}
            <Link to="/login" className='text-decoration-none d-block'>            
                <div className="d-flex justify-content-center mt-3">
                    <div className="w-75 p-2 rounded bg-warning d-flex align-items-center fw-semibold text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out">
                        &nbsp; Log out

                    <div className='ms-auto'>
                        <i className="bi bi-box-arrow-right"></i>
                    </div>
                    </div>
                </div>
            </Link>

        </div>
    )
}

export default Setting