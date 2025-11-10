import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Setting = ({ setToken }) => {
    return (

        <div>


            {/* หัวข้อ */}
            <div className="text-center text-white mt-16">
                <h2 className="fw-bold">Setting</h2>
            </div>


            {/* โนติ */}
            <div className="d-flex justify-content-center mt-5">
                {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                    duration-200 = ความเร็ว 0.2 s 
                    ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}

                <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold
                hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                    <i className="bi bi-bell-fill fs-4 "></i> &nbsp; Notification


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



            {/* ไพรเวทซี่ชีกึม */}
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



            {/* log out */}
            {/* <Link to="/login" className='text-decoration-none d-block'>
                <div className="d-flex justify-content-center mt-3">
                    <div className="w-75 p-2 rounded text-black d-flex align-items-center fw-semibold text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        &nbsp; Log out

                        <div className='ms-auto'>
                            <i className="bi bi-box-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </Link> */}


            {/* logout ของใหม่ไฉไลกว่าเดิม logout ได้จริงแล้วจ่ะ 😭😭 */}
            <div className="d-flex justify-content-center mt-3"
                onClick={() => {
                    // ล้าง token เพื่อ logout
                    setToken('') }}
                style={{ cursor: 'pointer' }}>


                {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                duration-200 = ความเร็ว 0.2 s 
                ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}

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
}

export default Setting