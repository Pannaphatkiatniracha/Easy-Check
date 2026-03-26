import { Link, useParams, useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button, Spinner, Modal } from 'react-bootstrap'; // เพิ่ม Spinner ตรงนี้
import { useState, useEffect } from 'react';

import axios from 'axios';

const HOST = 'localhost'
const PORT = '5000'

const ForgotToChange = () => {


    const { token } = useParams() // ดึง token จาก URL
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState("success") // เพิ่ม state ไว้เช็คว่าเป็น modal เขียวหรือแดง
    const [errorMessage, setErrorMessage] = useState("") // เก็บข้อความด่าของ error
    const [loading, setLoading] = useState(false) // ไว้ทำปุ่มหมุนๆ

    // setUser ใช้ตอนเปลี่ยนค่า user
    const [user, setUser] = useState(
        {
            newpass: "", //ค่าตั้งต้น
            confirmpass: "",
        }
    )

    // ตอนรันเว็บครั้งแรกให้ไปดึงข้อมูลจาก Mock API

    // async คือเป็นเป็นนางประกาศ บอกชาวบ้านเขาว่ากำลังจะมีงานใหญ่มานะแก
    // const res = await fetch ("") ก็คือให้ res นางเป็นตัวรับค่าข้อมูลในลิ้งมา ซึ่งพอมี await ก็คือบอกให้รอโหลดให้เสร็จก่อนนะ
    // const data = await res.json() ก็คือเอาให้ res แปลงสภาพตัวเองเป็น json แต่อยู่ในนาม data เพราะ res คือตัวแปรข้อมูลดิบ และให้ รอนางแปลงสภาพเสร็จก่อน


    /* useEffect(() => {
        const loadData = async () => {
            const res = await fetch("https://69037e5cd0f10a340b249323.mockapi.io/password/1")
            const data = await res.json()
            setUser({
                newpass: data.newpass || "",
                confirmpass: data.confirmpass || "",
            })
        }
        loadData()
    }, [])   //ทำครั้งเดียวตอนหน้าเว็บโหลด
    */



    // แก้ข้อมูลใน input

    // เวลามีเปลี่ยนแปลงที่ input จะส่งค่ามาที่ e
    const handleChange = (e) => {
        const { name, value } = e.target
        // ...oldUser  คือเหมือนก็อปสำเนาเก็บไว้ เพราะเราจะเปลี่ยนค่า user โดยใช้ setUser เพื่อเปลี่ยนข้อความในกล่อง input
        // แต่เพราะว่าอาจจะไม่ใช่ input ทุกตัวที่โดนเปลี่ยนเลยต้องสำเนาตัวเดิมไว้ แล้วแก้เฉพาะ [name]: value นั้น ส่วนตัวอื่นจะยังเหมือนเดิม
        setUser((oldUSer) => ({ ...oldUSer, [name]: value }))
    }



    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {

        // เช็คว่ารหัสผ่านใหม่กับที่ยืนยันพิมตรงกันไหม
        if (user.newpass !== user.confirmpass) {
            setErrorMessage("Passwords do not match")
            setModalType("error")
            setShowModal(true)
            return
        }

        // ตรวจสอบว่ากรอกรหัสหรือยัง
        if (!user.newpass) {
            setErrorMessage("Please enter a new password")
            setModalType("error")
            setShowModal(true)
            return
        }

        setLoading(true) // เปลี่ยนสถานะเป็น "กำลังส่ง"

        try {
            // อันนี้ต้องส่ง token ไปด้วยเพราะว่าใน token จะมี id ด้วยก็จะได้รู้ว่าเออคนนี้คือใคร
            const response = await axios.put(`http://${HOST}:${PORT}/auth/reset-password/${token}`, {
                newPassword: user.newpass,
                confirmPassword: user.confirmpass
            })

            
            // ตอนเปลี่ยนรหัสเสร็จแล้ว
            if (response.status === 200) {
                setModalType("success")
                setShowModal(true)
                
                // ปิด modal + redirect ไปหน้า login
                setTimeout(() => {
                    setShowModal(false)
                    navigate('/login')
                }, 1100)
            }
        } catch (error) {
            console.error("Error resetting password:", error.response?.data)
            setErrorMessage(error.response?.data?.message || "Invalid or Expired Token")
            setModalType("error")
            setShowModal(true)
        } finally {
            setLoading(false)
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

                <h3 className="fw-bold">Change your password</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            <div className="d-flex flex-column align-items-center">




                {/* password ใหม่ */}
                <div className="mt-16 mb-2 w-75">
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='password' placeholder='New password'
                            name="newpass" value={user.newpass} onChange={handleChange} />
                    </InputGroup>
                </div>


                {/* เส้น */}
                {/* <hr className="w-75 mx-auto my-4 border-white opacity-75" /> */}


                {/* confirm password ใหม่ */}
                <div className="w-75 mt-6">
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='password' placeholder='Confirm password'
                            name="confirmpass" value={user.confirmpass} onChange={handleChange} />
                    </InputGroup>
                </div>

            </div>


            {/* ปุ่ม */}
            <div className='text-center mt-20'>
                <Button 
                    className='rounded-5 w-25 fw-semibold d-flex align-items-center justify-content-center mx-auto' 
                    style={{ backgroundColor: '#636CCB', border: 'none', height: '45px' }} 
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            SAVING...
                        </>
                    ) : (
                        "SAVE"
                    )}
                </Button>
            </div>


            {/* centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ */}
            {/* <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                    <h5 className="fw-bold mb-3">Password changed</h5>
                    <p>Your password has been <br /> successfully updated</p>

                    <Button variant="primary" className='fw-semibold' style={{ backgroundColor: '#BE2623', border: 'none' }}
                        onClick={() => setShowModal(false)}>
                        CLOSE
                    </Button>

                </Modal.Body>
            </Modal> */}

            {/* <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0"></Modal.Header>
                <Modal.Body className="text-center py-4">

                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>

                    <h5 className="fw-bold mb-2">Password changed</h5>
                    <p>Your password has been <br /> successfully updated</p>

                </Modal.Body>
            </Modal> */}



            {/* backdrop = ให้คลิกด้านนอก modal ก็ปิดตัว modal ได้
                keyboard = กด esc ที่ปุ่มคีย์บอร์ดก็ปิดได้
            */}
            
            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    {modalType === "success" ? (
                        <>
                            <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                            <h5 className="fw-bold mt-2">Password changed</h5>
                        </>
                    ) : (
                        <>
                            <i className="bi bi-x-circle-fill fs-1 text-danger"></i>
                            <h5 className="fw-bold mt-2">Error</h5>
                            <p className="mt-3 text-muted">{errorMessage}</p>
                            <Button 
                                variant="link" 
                                className="mt-2 text-decoration-none fw-bold" 
                                style={{ color: '#636CCB' }}
                                onClick={() => setShowModal(false)}
                            >
                                TRY AGAIN
                            </Button>
                        </>
                    )}
                </Modal.Body>
            </Modal>


        </div>
    )
}

export default ForgotToChange