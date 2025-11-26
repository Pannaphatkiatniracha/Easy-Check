import { Link } from "react-router-dom";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const ForgotPassword = () => {

    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState("")
    const [profileEmail, setProfileEmail] = useState("") // state ที่รับอีเมลมาจากหน้า profile
    const [isEmailValid, setIsEmailValid] = useState(false) // ตรวจว่าอีเมลตรงไหม
    const [modalType, setModalType] = useState("success") // ถ้าตรงก็ success ไม่ตรงก็ error


    // ลิ้งข้อมูลจากหน้า profile
    useEffect(() => {
        const loadProfileEmail = async () => {
            try {
                const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users/6")
                const data = await res.json()
                setProfileEmail(data.email || "")
            } catch (error) {
                console.error("Error loading profile email : ", error)
            }
        }
        loadProfileEmail()
    }, [])


    const handleSend = () => {

        // ตรวจสอบว่าอีเมลที่กรอกตรงกับอีเมลที่อยู่ใน profile ไหม
        if (email === profileEmail) {
            setIsEmailValid(true)
            setModalType("success")
            setShowModal(true)

        } else {
            setIsEmailValid(false)
            setModalType("error")
            setShowModal(true)

        }
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


            {/* กล่องกรอกอีเมล */}
            <div className="d-flex flex-column align-items-center">


                <div className="w-75 mt-16">
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-envelope-fill"></i>
                        </InputGroup.Text>

                        <FormControl type='email' placeholder='Enter your email'
                            value={email} onChange={(e) => setEmail(e.target.value)} />

                    </InputGroup>
                    

                    <div className="text-white-50 mt-2 small">
                        Please enter the email address registered in the system.
                    </div>
                </div>


            </div>



            {/* ปุ่ม */}
            {/* <Link to="/forgottochange" className="text-decoration-none"> */}
            <div className="text-center mt-20">
                <Button className="w-25 rounded-5 fw-semibold" style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleSend}>SEND</Button>
            </div>
            {/* </Link> */}



            {/* 
                centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ
                backdrop = ให้คลิกด้านนอก modal ก็ปิดตัว modal ได้
                keyboard = กด esc ที่ปุ่มคีย์บอร์ดก็ปิดได้
             */}


            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    {modalType === "success" ? (

                        <>
                            <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                            <h5 className="fw-bold mt-2">Email Sent</h5>
                            <p className="mt-3">The system has sent the OTP password reset link to your email.</p>
                        </>
                    ) 
                    
                    : 
                    
                    (
                        <>
                            <i className="bi bi-x-circle-fill fs-1 text-danger"></i>
                            <h5 className="fw-bold mt-2">Email Not Found</h5>
                            <p className="mt-3">The email you entered does not match our records. <br /> Please check and try again.</p>
                        </>
                    )}
                </Modal.Body>
            </Modal>


        </div>
    )
}

export default ForgotPassword