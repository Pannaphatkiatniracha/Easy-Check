import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const PaymentRequest = () => {
    return (

        <div className='app-container'>

            {/* หัวข้อ + icon */}
            <div className="d-flex justify-content-between text-warning mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/home" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="text-white text-center fw-bold">Payment Request</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>

            
        </div>
    )
}

export default PaymentRequest