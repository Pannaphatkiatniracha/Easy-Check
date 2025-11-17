import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const ForgotPassword = () => {
    return (
        <div className="app-container">
            

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">
                
                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/login" className='text-decoration-none'>                
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                
                <h3 className="fw-bold">Forgot password ?</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            {/* กล่องกรอกเบอร์ / อีเมลล์ */}
            <div className="d-flex flex-column align-items-center">

                <div className='mt-16 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Email or Phone Number *</label><br />
                    <input className="rounded-1 form-control fw-semibold" type="text" />
                </div>

            </div>


            {/* ปุ่ม */}
            <Link to="/forgottochange" className="text-decoration-none">          
                <div className="text-center mt-20">
                    <Button className="w-25 rounded-5 fw-semibold" style={{backgroundColor: '#636CCB', border: 'none'}}>SEND</Button>
                </div>
            </Link>

        </div>
    )
}

export default ForgotPassword