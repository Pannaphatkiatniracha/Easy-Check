import './User.css'
import { Button, FormSelect, InputGroup, FormControl } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useRef } from 'react'; // เพิ่ม useRef มาเป็นนิ้ววิเศษเหมือนเดิม
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

// import axios from 'axios';
import Api from '../../Api'; // ตรงนี้ใช้แทน axios

const HOST = 'localhost'
const PORT = '5000'

const ApproveProfile = () => {

    const [showModal, setShowModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false) // สร้าง Modal สำหรับ Error แยกออกมา
    const [errorMessage, setErrorMessage] = useState("") // เก็บข้อความ Error ภาษาอังกฤษ
    
    const fileInputRef = useRef(null) // สร้าง Ref สำหรับปุ่มแก้ไขรูป


    // setUser ใช้ตอนเปลี่ยนค่า user
    const [user, setUser] = useState(
        {
            name: "", //ค่าตั้งต้น
            userid: "",
            email: "",
            phone: "",
            joinDate: "",
            position: "",
            department: "",
            branch: "",
            gender: "Female",
            avatar: "/easycheck/img/who.webp",
            shift: ""
        }
    )

    // ตอนรันเว็บครั้งแรกให้ไปดึงข้อมูลจาก Mock API

    // async คือเป็นเป็นนางประกาศ บอกชาวบ้านเขาว่ากำลังจะมีงานใหญ่มานะแก
    // const res = await fetch ("") ก็คือให้ res นางเป็นตัวรับค่าข้อมูลในลิ้งมา ซึ่งพอมี await ก็คือบอกให้รอโหลดให้เสร็จก่อนนะ
    // const data = await res.json() ก็คือเอาให้ res แปลงสภาพตัวเองเป็น json แต่อยู่ในนาม data เพราะ res คือตัวแปรข้อมูลดิบ และให้ รอนางแปลงสภาพเสร็จก่อน


    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem('token')
                
                // จาก Api.jsx จะมีการส่ง `Bearer ${token}` ไปอยู่แล้ว
                const response = await Api.get('/users/profile')

                // axios จะเอาข้อมูลใส่ไว้ใน .data ให้เลย
                const data = response.data
                console.log("Data from Backend (Axios):", data)

                // เช็คว่ามีรูปจากแบคเอนไหม
                const avatarPath = data.avatar // ถามว่าใน db มีรูปไหม
                    ? (data.avatar.startsWith('http') // ถ้ามีมันขึ้นต้นด้วย http ไหม
                        ? data.avatar  // ถ้ามีแล้วขึ้นต้นด้วย http ก็เอามาใช้เลย
                        : `${Api.defaults.baseURL}/uploads/avatars/${data.avatar}`) // ถ้าไม่ใช่ให้เติมชื่อ server เราไปมันจะได้ใช้ได้ซึ่งตรงนี้นี่แหละคือรูปที่ user อัพเอง
                    : "/easycheck/img/an.jpg"

                setUser({
                    name: (data.firstname && data.lastname) 
                        ? data.firstname + " " + data.lastname 
                        : "",
                    userid: data.id_employee || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    joinDate: data.joindate ? data.joindate.substring(0, 10) : "", // ตัดเหลือแค่ 10 ตัวแรก
                    position: data.position || "",
                    department: data.department || "",
                    branch: data.branch || "Bangkok",
                    gender: data.gender || "Female",
                    avatar: avatarPath,
                    shift: data.shift || "",
                })

            } catch (error) {
                console.error("Error loading data:", error.response?.data?.message || error.message) // ตอบกลับตามที่แบคเอนส่งมา
            }
        }
        loadData()
    }, [])   //ทำครั้งเดียวตอนหน้าเว็บโหลด



    // แก้ข้อมูลใน input

    // เวลามีเปลี่ยนแปลงที่ input จะส่งค่ามาที่ e
    const handleChange = (e) => {
        const { name, value } = e.target
        // ...oldUser  คือเหมือนก็อปสำเนาเก็บไว้ เพราะเราจะเปลี่ยนค่า user โดยใช้ setUser เพื่อเปลี่ยนข้อความในกล่อง input
        // แต่เพราะว่าอาจจะไม่ใช่ input ทุกตัวที่โดนเปลี่ยนเลยต้องสำเนาตัวเดิมไว้ แล้วแก้เฉพาะ [name]: value นั้น ส่วนตัวอื่นจะยังเหมือนเดิม
        setUser((oldUser) => ({ ...oldUser, [name]: value }))
    }

    // อัพโหลดรูปภาพจริง ๆ ตรงนี้
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData() // new FormData() อันนี้สร้างขึ้นมารับ-ส่งไฟล์รูปภาพโดยเฉพาะ
        // avatar ตรงนี้ต้องตรงกับใน userRouter
        formData.append('avatar', file) // เอา file ไปเก็บไว้ใน avatar

        try {
            const token = localStorage.getItem('token');
            const response = await Api.post('/users/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.status === 200) {
                const newAvatarName = response.data.avatar //แบคเอนส่งชื่อไฟล์ใหม่มาว่า

                // เปลี่ยนรูปตรงนี้ 🤍
                setUser((old) => ({ 
                    ...old, 
                    avatar: `http://${HOST}:${PORT}/uploads/avatars/${newAvatarName}` 
                }))
                setShowModal(true)
            }
        } catch (error) {
            console.error("Upload error:", error.response?.data?.message || error.message)
            setErrorMessage(error.response?.data?.message || "Upload failed. Please try again.")
            setShowErrorModal(true)
        }
    }



    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token')
            
            // สิ่งที่จะส่งกลับไปให้แบคเอน
            const bodyData = {
                full_name: user.name,
                phone: user.phone,
                email: user.email,
                branch: user.branch,
                gender: user.gender
            }

            // ใช้ axios.put ส่งของไปหลังบ้าน
            const response = await Api.put('/users/profile', bodyData)

            // ถ้าฝั่งแบคโอนส่งกลับมาว่าโอเก
            if (response.status === 200) {
                setShowModal(true)
            }
        } catch (error) {
            console.error("Save error:", error.response?.data?.message || error.message)
            setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.")
            setShowErrorModal(true)
        }
    }
    
    
    return (
        <div className="app-container">

            {/* <div className="text-center text-white mt-16">
                <h2 className="fw-bold">Edit Profile</h2>
            </div> */}

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/setting" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <div className="d-flex flex-column align-items-center">
                        <h3 className="fw-bold m-0">Edit Profile</h3>
                        <small className="text-warning fw-semibold mb-2">
                            <i className="bi bi-crown-fill me-1"></i> Approver 👑
                        </small>
                </div>

                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>

            {/* รูปโปรไฟล์ + icon */}
            {/* position-relative เป็นตัวแม่สำหรับ position-absolute ซึ่งคุณสมบัติคือจะให้ชีอยู่ตรงไหนก็ได้ */}
            <div className="mx-auto mt-6 position-relative"
                style={{width: "100px", height: "100px"}}>

                {/* objectFit: "cover" = ไม่ให้รูปโดนบีบ */}
                <img src={user.avatar} className="rounded-circle w-100 h-100" 
                style={{width: "100%", height: "100%", objectFit: "cover"}}/>

                {/* icon edit */}
                <button className='position-absolute bottom-0 end-0 rounded-circle btn-sm btn'
                    style={{ transform: "translate(25%, 10%)", backgroundColor: '#636CCB', border: 'none', color: 'white' }}
                    onClick={() => fileInputRef.current.click()} // คลิกปุ่มดินสอแล้วเปิดหน้าต่างเลือกไฟล์
                >
                    <i className="bi bi-camera-fill"></i>
                </button>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleFileChange} 
                />
            </div>

            {/* form ต่าง ๆ */}
            {/* พอใช้ d-flex แล้วก็กลายเป็น inline ต้องใช้ flex-column มา set ให้นางเป็นแนวตั้งอีกที */}
            <div className="d-flex flex-column align-items-center">

                {/* ชื่อ */}
                <div className='mt-4 mb-3 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Information</label>
                    <input className='fw-semibold form-control' type="text"
                        name="name" value={user.name} onChange={handleChange} readOnly />
                </div>

                {/* รหัสพนักงาน */}
                <div className='mb-3 w-75'>
                    <InputGroup>
                        <InputGroup.Text className='text-secondary'>
                            <i className="bi bi-person-fill"></i>
                        </InputGroup.Text>
                        <FormControl className='fw-semibold' type='text' placeholder='Employee ID'
                            name='userid' value={user.userid} onChange={handleChange} readOnly />
                    </InputGroup>
                </div>

                {/* อีเมล */}
                <div className="mb-3 w-75">
                    <InputGroup>
                        <InputGroup.Text className='text-secondary'>
                            <i className="bi bi-envelope-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='text' placeholder='Email'
                            name="email" value={user.email} onChange={handleChange} />
                    </InputGroup>
                </div>

                {/* เบอร์โทร */}
                <div className="mb-4 w-75">
                    <InputGroup>
                        <InputGroup.Text className='text-secondary'>
                            <i className="bi bi-telephone-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='text' placeholder='Phone Number'
                            name="phone" value={user.phone} onChange={handleChange} />
                    </InputGroup>
                </div>

                {/* ข้อมูลการทำงาน */}
                <div className='w-75'>
                    <label className="text-white fw-light form-label">Work Information</label>
                </div>

                {/* ตำแหน่ง */}
                <div className='mb-3 w-75'>
                    <InputGroup>
                        <InputGroup.Text className='text-secondary'>
                            <i className="bi bi-briefcase-fill"></i>
                        </InputGroup.Text>
                        <FormControl className='fw-semibold' type="text"
                            name='position' value={user.position} onChange={handleChange} readOnly />
                    </InputGroup>
                </div>

                {/* แผนก */}
                <div className='mb-3 w-75'>
                    <InputGroup>
                        <InputGroup.Text className='text-secondary'>
                            <i className="bi bi-building-fill"></i>
                        </InputGroup.Text>
                        <FormControl className='fw-semibold' type="text"
                            name='department' value={user.department} onChange={handleChange} readOnly />
                    </InputGroup>
                </div>

                {/* สาขา */}
                <div className='mb-3 w-75'>
                    <InputGroup>
                        <InputGroup.Text className='text-secondary'>
                            <i className="bi bi-geo-alt-fill"></i>
                        </InputGroup.Text>
                        <Form.Select aria-label='Select branch' className='fw-semibold'
                            name='branch' value={user.branch} onChange={handleChange}>
                            <option value="Bangkok">กรุงเทพมหานคร</option>
                            <option value="ChiangMai">เชียงใหม่</option>
                            <option value="Phuket">ภูเก็ต</option>
                            <option value="Chonburi">ชลบุรี</option>
                            <option value="Khonkaen">ขอนแก่น</option>
                        </Form.Select>
                    </InputGroup>
                </div>

                {/* กะงาน */}
                <div className='mb-4 w-75'>
                    <InputGroup>
                        <InputGroup.Text className='text-secondary'>
                            <i className="bi bi-clock-fill"></i>
                        </InputGroup.Text>
                        <FormControl className='fw-semibold' type="text"
                            name='shift' value={user.shift} onChange={handleChange} readOnly />
                    </InputGroup>
                </div>

            </div>

            {/* ข้อมูลส่วนตัว */}
            <div className='px-5 mt-2'>
                <label className='text-white fw-light form-label'>Personal Information</label>
            </div>

            <div className='px-5'>
                <InputGroup className='mb-3'>
                    <InputGroup.Text className='text-secondary'>
                        <i className="bi bi-calendar3"></i>
                    </InputGroup.Text>
                    <FormControl type="date"
                        name='joinDate' value={user.joinDate} readOnly />
                </InputGroup>
            </div>

            <div className='px-5'>
                <InputGroup>
                    <InputGroup.Text className='text-secondary'>
                        <i className="bi bi-gender-ambiguous"></i>
                    </InputGroup.Text>
                    <Form.Select aria-label="Select gender"
                        name='gender' value={user.gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </Form.Select>
                </InputGroup>
            </div>

            {/* ปุ่ม */}
            <Link to="/changepassword" className='text-decoration-none'>
                <div className='text-center mt-5'>
                    <Button className='rounded-5 w-50 fw-semibold' style={{ backgroundColor: '#636CCB', border: 'none' }}>Chang Password &nbsp; <i className="bi bi-lock-fill"></i></Button>
                </div>
            </Link>

            <div className='text-center mt-3 mb-5'>
                <Button className='rounded-5 w-25 fw-semibold' style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleSave}>SAVE</Button>
            </div>

            {/* centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ */}
            {/* Modal สำหรับ Success */}
            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                    <h5 className="fw-bold mt-2">Update complete</h5>
                </Modal.Body>
            </Modal>

            {/* Modal สำหรับ Error */}
            <Modal size="sm" show={showErrorModal} onHide={() => setShowErrorModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-exclamation-circle-fill fs-1 text-danger"></i>
                    <h5 className="fw-bold mt-2">Update Failed</h5>
                    <p className="text-secondary small">{errorMessage}</p>
                    <Button variant="secondary" size="sm" className="mt-2 rounded-pill px-4" onClick={() => setShowErrorModal(false)}>Close</Button>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default ApproveProfile