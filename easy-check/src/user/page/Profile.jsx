import './User.css'
import { Button, FormSelect, InputGroup, FormControl } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const Profile = ( {role} ) => {

    const [showModal, setShowModal] = useState(false)


    // setUser ใช้ตอนเปลี่ยนค่า user
    const [user, setUser] = useState(
        {
            name: "", //ค่าตั้งต้น
            userid: "",
            email: "",
            phone: "",
            birth: "",
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
            const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users/6")
            const data = await res.json()
            setUser({
                name: data.name || "",
                userid: data.userid || "",
                email: data.email || "",
                phone: data.phone || "",
                birth: data.birth || "",
                position: data.position || "",
                department: data.department || "",
                branch: data.branch || "",
                gender: data.gender || "Female",
                avatar: data.avatar || "/easycheck/img/an.jpg",
                shift: data.shift || "",
            })
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



    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
        await fetch("https://68fbd77794ec960660275293.mockapi.io/users/6", {
            method: "PUT", // อัปเดต
            headers: { "Content-Type": "application/json" },  // ข้อมูลที่ส่งไปเป็น JSON
            body: JSON.stringify(user),  // แปลง state เป็นตัวหนังสือ JSON เพื่อส่งไปที่ API
        })
        setShowModal(true)
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

                <h3 className="fw-bold">Edit Profile</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>



            {/* รูปโปรไฟล์ + icon */}
            {/* position-relative เป็นตัวแม่สำหรับ position-absolute ซึ่งคุณสมบัติคือจะให้ชีอยู่ตรงไหนก็ได้ */}
            <div className="mx-auto mt-6 position-relative"
              style={{width: "100px",height: "100px",}}>

                {/* objectFit: "cover" = ไม่ให้รูปโดนบีบ */}
                <img src={user.avatar} className="rounded-circle w-100 h-100" 
                style={{width: "100%",height: "100%",objectFit: "cover"}}/>


                {/* icon edit */}
                <Button size='sm' className='position-absolute bottom-0 end-0 rounded-circle'
                    // เป๊ะไม่พอ 25 คือแกน x 10 คือแกน y
                    style={{ transform: "translate(25%, 10%)", backgroundColor: '#636CCB', border: 'none' }}>
                    <i className="bi bi-pencil-fill"></i>
                </Button>
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
                            {/* <i class="bi bi-telephone"></i> */}
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
                        name='birth' value={user.birth} onChange={handleChange} />
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
            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                    <h5 className="fw-bold mt-2">Update complete</h5>
                    {/* <p>Your information has been <br /> updated successfully.</p> */}

                </Modal.Body>
            </Modal>


        </div>
    )
}

export default Profile