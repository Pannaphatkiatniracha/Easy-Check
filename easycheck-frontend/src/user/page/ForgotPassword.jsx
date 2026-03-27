import { Link, useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button, Spinner, Modal } from "react-bootstrap";
import { useState, useEffect } from 'react';

import axios from 'axios';

const HOST = 'localhost'
const PORT = '5000'

const ForgotPassword = () => {


    const navigate = useNavigate()
    
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState("")
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [modalType, setModalType] = useState("success")
    const [loading, setLoading] = useState(false) // ไว้เช็คว่าตอนนี้กำลังรอแบคเอนตอบกลับอยู่ไหม (ถ้า true ปุ่มจะกดซ้ำไม่ได้)


    /*
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
    */



    const handleSend = async () => {

        if (!email) {
            setModalType("error")
            setShowModal(true)
            return
        }

        setLoading(true) // เปลี่ยนสถานะเป็น "กำลังส่ง"

        try {
            const response = await axios.post(`http://${HOST}:${PORT}/auth/forgot-password`, {
                email: email
            })

            // ถ้าแบคเอนเจออีเมลและสร้าง token
            if (response.status === 200) {
                setIsEmailValid(true)
                setModalType("success")
                setShowModal(true)
                
                // โชว์ modal เสร็จโชว์วินึงแล้วให้ redirect กลับไปหน้า login
                setTimeout(() => {
                    setShowModal(false)
                    navigate('/login')
                }, 1100)
            }

        } catch (error) {
            console.error("Error from backend: ", error.response?.data)
            setIsEmailValid(false)
            setModalType("error")
            setShowModal(true)
        } finally {
            setLoading(false)
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
                <Button 
                    className="w-25 rounded-5 fw-semibold d-flex align-items-center justify-content-center mx-auto" 
                    style={{ backgroundColor: '#636CCB', border: 'none', height: '45px' }} // เพิ่ม height ให้ปุ่มไม่ขยับตอน Spinner มา
                    onClick={handleSend}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2" // เว้นระยะห่างจากข้อความนิดนึง
                            />
                            
                        </>
                    ) : (
                        "SEND"
                    )}
                </Button>
            </div>



            <Modal size="sm" show={showModal} onHide={modalType === "success" ? handleSuccessClose : handleErrorClose} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    {modalType === "success" ? (
                        <>
                            <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                            <h5 className="fw-bold mt-2">Email Sent</h5>
                            <p className="mt-3">The system has sent the password reset link to your email.</p>
                        </>
                    ) 
                    
                    : 
                    
                    (
                        <>
                            <i className="bi bi-x-circle-fill fs-1 text-danger"></i>
                            <h5 className="fw-bold mt-2">
                                { !email ? "Missing Email" : "Email Not Found" }
                            </h5>
                            <p className="mt-3">
                                { !email ? "Please enter your email address before sending." : "The email you entered does not match our records. Please check and try again." }
                            </p>
                            
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