import { Link, useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const ForgotPassword = () => {


    const navigate = useNavigate()
    
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState("")
    const [profileEmail, setProfileEmail] = useState("")
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [modalType, setModalType] = useState("success")


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
            
            // โชว์ modal เสร็จ 3s ให้ไปหน้า home
            setTimeout(() => {
                setShowModal(false)
                navigate('/login')
            }, 3000)

        } else {
            setIsEmailValid(false)
            setModalType("error")
            setShowModal(true)
        }
    }


    // ปิด modal success
    const handleSuccessClose = () => {
        setShowModal(false)
        navigate('/login')
    }


    // ปิด modal error
    const handleErrorClose = () => {
        setShowModal(false)
    }


    return (
        <div className="app-container">


            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/login" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="fw-bold">Forgot password ?</h3>
                <div className="me-4"></div>
            </div>


            {/* กล่องกรอกอีเมล */}
            <div className="d-flex flex-column align-items-center">
                <div className="w-75 mt-16">
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-envelope-fill"></i>
                        </InputGroup.Text>
                        <FormControl 
                            type='email' 
                            placeholder='Enter your email'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </InputGroup>
                    
                    <div className="text-white-50 mt-2 small">
                        Please enter the email address registered in the system.
                    </div>
                </div>
            </div>




            {/* ปุ่ม */}
            <div className="text-center mt-20">
                <Button className="w-25 rounded-5 fw-semibold" 
                style={{ backgroundColor: '#636CCB', border: 'none' }}
                onClick={handleSend}>
                    SEND
                </Button>
            </div>



            <Modal size="sm" show={showModal} onHide={modalType === "success" ? handleSuccessClose : handleErrorClose} centered backdrop={true} keyboard={true}>
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
                            
                            <Button className="mt-3 rounded-5 fw-semibold text-decoration-none" variant="link"
                                onClick={handleErrorClose}>
                                TRY AGAIN
                            </Button>
                        </>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default ForgotPassword