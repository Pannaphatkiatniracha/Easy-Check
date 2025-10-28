import './User.css'
import { Button, FormSelect } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';

const Profile = () => {
        // setUser ใช้ตอนเปลี่ยนค่า user
    const [user, setUser] = useState(
        {
            name: "", //ค่าตั้งต้น
            email: "",
            phone: "",
            birth: "",
            position: "",
            department: "",
            branch: "",
            gender: "Female",
            avatar: "/easycheck/img/an.jpg"
        }
    )

    // ตอนรันเว็บครั้งแรกให้ไปดึงข้อมูลจาก Mock API

    // async คือเป็นเป็นนางประกาศ บอกชาวบ้านเขาว่ากำลังจะมีงานใหญ่มานะแก
    // const res = await fetch ("") ก็คือให้ res นางเป็นตัวรับค่าข้อมูลในลิ้งมา ซึ่งพอมี await ก็คือบอกให้รอโหลดให้เสร็จก่อนนะ
    // const data = await res.json() ก็คือเอาให้ res แปลงสภาพตัวเองเป็น json แต่อยู่ในนาม data เพราะ res คือตัวแปรข้อมูลดิบ และให้ รอนางแปลงสภาพเสร็จก่อน

    
    useEffect(() => {
        const loadData = async () => {
            const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users/1")
            const data = await res.json()
            setUser({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                birth: data.birth || "",
                position: data.position || "",
                department: data.department || "",
                branch: data.branch || "",
                gender: data.gender || "Female",
                avatar: data.avatar || "/easycheck/img/an.jpg"
            })
        }
        loadData()
    }, [])   //ทำครั้งเดียวตอนหน้าเว็บโหลด



    // แก้ข้อมูลใน input

    // เวลามีเปลี่ยนแปลงที่ input จะส่งค่ามาที่ e
    const handleChange = (e) => {
        const {name, value} = e.target
        // ...oldUser  คือเหมือนก็อปสำเนาเก็บไว้ เพราะเราจะเปลี่ยนค่า user โดยใช้ setUser เพื่อเปลี่ยนข้อความในกล่อง input
        // แต่เพราะว่าอาจจะไม่ใช่ input ทุกตัวที่โดนเปลี่ยนเลยต้องสำเนาตัวเดิมไว้ แล้วแก้เฉพาะ [name]: value นั้น ส่วนตัวอื่นจะยังเหมือนเดิม
        setUser((oldUSer) => ({ ...oldUSer, [name]: value}))
    }



    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
    await fetch("https://68fbd77794ec960660275293.mockapi.io/users/1", {
      method: "PUT", // อัปเดต
      headers: { "Content-Type": "application/json" },  // ข้อมูลที่ส่งไปเป็น JSON
      body: JSON.stringify(user),  // แปลง state เป็นตัวหนังสือ JSON เพื่อส่งไปที่ API
    })
    alert("บันทึกข้อมูลสำเร็จ ❕❗")
  }

    return (
        <div className="app-container">
            {/* หัวข้อ */}
            <div className="text-center text-warning mt-16">
                <h2 className="fw-normal">My Profile</h2>
            </div>

            {/* รูปโปรไฟล์ + icon */}
            {/* position-relative เป็นตัวแม่สำหรับ position-absolute ซึ่งคุณสมบัติคือจะให้ชีอยู่ตรงไหนก็ได้ */}
            <div className="w-25 mx-auto mt-6 position-relative">
                <img src={user.avatar} className="rounded-circle w-100 h-100" />


                {/* icon edit */}
                <Button size='sm' variant='warning' className='position-absolute bottom-0 end-0 rounded-circle'
                // 25 คือแกน x 10 คือแกน y
                style={{ transform: "translate(25%, 10%)" }}>
                    <i className="bi bi-pencil-fill"></i>
                </Button>
            </div>

            {/* form ต่าง ๆ */}
            {/* พอใช้ d-flex แล้วก็กลายเป็น inline ต้องใช้ flex-column มา set ให้นางเป็นแนวตั้งอีกที */}
            <div className="d-flex flex-column align-items-center">


                {/* ชื่อ */}
                <div className="mt-4 mb-3 w-75">
                    {/* form-label มาจาก bootstrap ไว้จัดเลเอ้าระหว่าง label กับ input ให้เริ่ด
                    ส่วน form-control ก็จุดประสงค์เดิมแต่ไว้ใช้กับ input */}
                    <label className="text-warning fw-light form-label" htmlFor="">Name</label><br />
                    <input className="rounded-1 form-control" type="text" 
                    // onChange คือเวลาเปลี่ยนค่าอะไรให้ใช้ function handleChange 
                    name='name' value={user.name} onChange={handleChange} />
                </div>

                {/* อีเมล */}
                <div className="mb-3 w-75">
                    <label className="text-warning fw-light form-label" htmlFor="">Email</label><br />
                    <input className="rounded-1 form-control" type="text"
                    name='email' value={user.email} onChange={handleChange} />
                </div>

                {/* เบอร์โทร */}
                <div className='mb-12 w-75'>
                    <label className="text-warning fw-light form-label" htmlFor="">Phone Number</label><br />
                    <input className="rounded-1 form-control" type="text" 
                    name='phone' value={user.phone} onChange={handleChange} />
                </div>

                {/* ตำแหน่ง */}
                <div className='mb-3 w-75'>
                    <label className="text-light fw-normal form-label" htmlFor="">Position -</label><br />
                    <input className="rounded-1 form-control fw-semibold" type="text" 
                    name='position' value={user.position} onChange={handleChange} readOnly  />
                </div>

                {/* แผนก */}
                <div className='mb-3 w-75'>
                    <label className="text-warning fw-light form-label" htmlFor="">Department</label><br />
                    <Form.Select aria-label='Select dapartment'
                    name='department' value={user.department} onChange={handleChange}>
                        <option value="IT">IT</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Sales">Sales</option>
                        <option value="Customer Service">Customer Service</option>
                    </Form.Select>
                    {/* <input className="rounded-1 form-control" type="text" 
                     /> */}
                </div>

                {/* สาขา */}
                <div className='w-75'>
                    <label className="text-warning fw-light form-label" htmlFor="">Branch</label><br />
                    <Form.Select aria-label='Select branch'
                    name='branch' value={user.branch} onChange={handleChange}>
                        <option value="Bangkok">กรุงเทพมหานคร</option>
                        <option value="ChiangMai">เชียงใหม่</option>
                        <option value="Phuket">ภูเก็ต</option>
                        <option value="Chonburi">ชลบุรี</option>
                        <option value="Khonkaen">ขอนแก่น</option>
                    </Form.Select>
                    {/* <input className="rounded-1 form-control" type="text" 
                     /> */}
                </div>


            </div>

            {/* ข้อมูลที่ให้เลือก */}
            <div className='px-5 mt-12'>
                <label className='text-warning fw-light form-label' htmlFor="">Birth</label>
                <input className='form-control' type="date" 
                name='birth' value={user.birth} onChange={handleChange} />
            </div>

            

            <div className='px-5 mt-2'>
                <label className="text-warning fw-light form-label">Gender</label>
                <Form.Select aria-label="Select gender" 
                name='gender' value={user.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                </Form.Select>
            </div>

            {/* ปุ่ม */}
            <div className='text-center mt-5'>
                <Button className='rounded-5 w-50' variant='warning'>Chang Password &nbsp; <i className="bi bi-lock-fill"></i></Button>
            </div>
            <div className='text-center mt-3 mb-5'>
                <Button className='rounded-5 w-25' variant='warning' 
                onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}

export default Profile