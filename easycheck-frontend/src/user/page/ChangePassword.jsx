import { Link } from "react-router-dom";
import { InputGroup, FormControl, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
// import axios from 'axios';
import Api from '../../Api'; // ตรงนี้ใช้แทน axios

const HOST = 'localhost'
const PORT = '5000'

const ChangePassword = () => {
    
    // State สำหรับควบคุม Modal และข้อความ
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)
    const [modalMessage, setModalMessage] = useState("")


    // setUser ใช้ตอนเปลี่ยนค่า user
    const [user, setUser] = useState({
        current: "", //ค่าตั้งต้น
        new: "",
        confirm: "",
    })


    // เปิดหน้าเว็บมาให้นางเป้นค่าว่าง
    useEffect(() => {
        setUser({ current: "", new: "", confirm: "" })
    }, [])


    // แก้ข้อมูลใน input

    // เวลามีเปลี่ยนแปลงที่ input จะส่งค่ามาที่ e
    const handleChange = (e) => {
        const { name, value } = e.target
        // ...oldUser  คือเหมือนก็อปสำเนาเก็บไว้ เพราะเราจะเปลี่ยนค่า user โดยใช้ setUser เพื่อเปลี่ยนข้อความในกล่อง input
        // แต่เพราะว่าอาจจะไม่ใช่ input ทุกตัวที่โดนเปลี่ยนเลยต้องสำเนาตัวเดิมไว้ แล้วแก้เฉพาะ [name]: value นั้น ส่วนตัวอื่นจะยังเหมือนเดิม
        setUser((oldUser) => ({ ...oldUser, [name]: value }))
    }


    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
        
        // ถ้ารหัสใหม่กับรหัสคอนเฟิร์มไม่ตรงกัน
        if (user.new !== user.confirm) {
            setIsSuccess(false)
            setModalMessage("New password and confirm password do not match")
            setShowModal(true)
            return
        }

        // บังคับให้รหัสต้อง 6 ตัวเป็นอย่างต่ำ
        if (user.new.length < 6) {
            setIsSuccess(false)
            setModalMessage("Password must be at least 6 characters")
            setShowModal(true)
            return
        }

        try {
            // รับ token
            const token = localStorage.getItem('token')

            const response = await Api.put(`http://${HOST}:${PORT}/users/change-password`, 
                {
                    currentPassword: user.current, // รหัสปัจจุบัน
                    newPassword: user.new // รหัสใหม่
                }, 
                {
                    headers: { Authorization: `Bearer ${token}` } // ส่ง token ให้ middleware เช็ค
                }
            )

            if (response.data.success) {
                setIsSuccess(true)
                setModalMessage("Password changed successfully")
                setShowModal(true)
                setUser({ current: "", new: "", confirm: "" }) // ล้างข้อมูลในช่อง input ให้หลังเปลี่ยนรหัสแล้ว
            }

        } catch (err) {
            setIsSuccess(false)
            const errorMsg = err.response?.data?.message || "Something went wrong"
            setModalMessage(errorMsg)
            setShowModal(true)
        }
    }


    return (
        <div className="app-container">
            {/* ส่วน Header */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/userprofile" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Change your password</h3>
                <div className="me-4"></div>
            </div>

            <div className="d-flex flex-column align-items-center">
                {/* Current Password */}
                <div className='mt-16 w-75'>
                    <InputGroup>
                        <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FormControl type='password' placeholder='Current password' name="current" value={user.current} onChange={handleChange} />
                    </InputGroup>
                    <Link to="/forgotpassword" data-bs-theme="dark" className='text-decoration-none'>
                        <p className='text-white text-end fw-lighter mt-2'>Forget Password?</p>
                    </Link>
                </div>

                <hr className="w-75 mx-auto my-4 border-white opacity-75" />

                {/* New Password */}
                <div className="mt-3 mb-4 w-75">
                    <InputGroup>
                        <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FormControl type='password' placeholder='New password' name="new" value={user.new} onChange={handleChange} />
                    </InputGroup>
                </div>

                {/* Confirm Password */}
                <div className="w-75">
                    <InputGroup>
                        <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                        <FormControl type='password' placeholder='Confirm password' name="confirm" value={user.confirm} onChange={handleChange} />
                    </InputGroup>
                </div>
            </div>

            {/* ปุ่ม SAVE */}
            <div className='text-center mt-20'>
                <Button className='rounded-5 w-25 fw-semibold' style={{ backgroundColor: '#636CCB', border: 'none' }} onClick={handleSave}>SAVE</Button>
            </div>

            {/* Modal */}
            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    {isSuccess ? (
                        <i className="bi bi-check-circle-fill fs-1" style={{ color: '#50AE67' }}></i>
                    ) : (
                        <i className="bi bi-x-circle-fill fs-1 text-danger"></i>
                    )}
                    <h5 className="fw-bold mt-3">{isSuccess ? "Success" : "Error"}</h5>
                    <p className="text-muted mb-0">{modalMessage}</p>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default ChangePassword