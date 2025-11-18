import { Link } from "react-router-dom";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Modal } from 'react-bootstrap';
import { useState } from 'react';

const ForgotPassword = () => {

    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState("")


    const handleSend = () => {

        setShowModal(true)
    }

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


                <div className="w-75 mt-16">
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-envelope-fill"></i>
                        </InputGroup.Text>

                        <FormControl type='email' placeholder='Enter your email'
                            value={email} onChange={(e) => setEmail(e.target.value)} />

                    </InputGroup>
                </div>


            </div>



            {/* ปุ่ม */}
            {/* <Link to="/forgottochange" className="text-decoration-none"> */}
            <div className="text-center mt-20">
                <Button className="w-25 rounded-5 fw-semibold" style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleSend}>SEND</Button>
            </div>
            {/* </Link> */}



            {/* centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ */}
            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                    <h5 className="fw-bold mt-2">Email Sent</h5>

                </Modal.Body>
            </Modal>


        </div>
    )
}

export default ForgotPassword