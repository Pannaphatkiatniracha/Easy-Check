import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const InRegister = () => {


    const [showModal, setShowModal] = useState(false)

    // setUser ใช้ตอนเปลี่ยนค่า user
    const [user, setUser] = useState(
        {
            name: "", //ค่าตั้งต้น
            userid: "",
            position: "",
            department: "",
            branch: "",
            events: ""
        }
    )

    // ตอนรันเว็บครั้งแรกให้ไปดึงข้อมูลจาก Mock API

    // async คือเป็นเป็นนางประกาศ บอกชาวบ้านเขาว่ากำลังจะมีงานใหญ่มานะแก
    // const res = await fetch ("") ก็คือให้ res นางเป็นตัวรับค่าข้อมูลในลิ้งมา ซึ่งพอมี await ก็คือบอกให้รอโหลดให้เสร็จก่อนนะ
    // const data = await res.json() ก็คือเอาให้ res แปลงสภาพตัวเองเป็น json แต่อยู่ในนาม data เพราะ res คือตัวแปรข้อมูลดิบ และให้ รอนางแปลงสภาพเสร็จก่อน


    useEffect(() => {
        const loadData = async () => {
            const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/register/1")
            const data = await res.json()
            setUser({
                name: data.name || "",
                userid: data.userid || "",
                position: data.position || "",
                department: data.department || "",
                branch: data.branch || "",
                events: data.events || ""
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
        setUser((oldUSer) => ({ ...oldUSer, [name]: value }))
    }



    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
        await fetch("https://68fbd77794ec960660275293.mockapi.io/register/1", {
            method: "PUT", // อัปเดต
            headers: { "Content-Type": "application/json" },  // ข้อมูลที่ส่งไปเป็น JSON
            body: JSON.stringify(user),  // แปลง state เป็นตัวหนังสือ JSON เพื่อส่งไปที่ API
        })
        setShowModal(true)
    }

    return (

        <div className='app-container'>


            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/internalevent" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h3 className="fw-bold">Register</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            {/* form ต่าง ๆ */}
            {/* ใช้ flex เป็นคอลัมน์ กับให้อยู่กลางแนวนอน */}
            <div className="d-flex flex-column align-items-center">

                <div className="mt-4 mb-3 w-75">
                    {/* form-label มาจาก bootstrap ไว้จัดเลเอ้าระหว่าง label กับ input ให้เริ่ด
                    ส่วน form-control ก็จุดประสงค์เดิมแต่ไว้ใช้กับ input */}
                    <label className="text-white fw-light form-label" htmlFor="">Employee ID</label>
                    <input className="rounded-1 form-control" type="text" placeholder=''
                        // onChange คือเวลาเปลี่ยนค่าอะไรให้ใช้ function handleChange 
                        name='userid' value={user.userid} onChange={handleChange} />
                </div>


                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label" htmlFor="">Name</label>
                    <input className="rounded-1 form-control" type="text" placeholder=''
                        name='name' value={user.name} onChange={handleChange} />
                </div>


                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label" htmlFor="">Position</label>
                    <Form.Select aria-label="Select position"
                        name='position' value={user.position} onChange={handleChange}>
                        <option value="Animator">Animator</option>
                        <option value="Content Creator">Content Creator</option>
                        <option value="Copywriter">Copywriter</option>
                        <option value="Brand Manager">Brand Manager</option>
                        <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                        <option value="SEO Specialist">SEO Specialist</option>
                        <option value="Market Research Analyst">Market Research Analyst</option>
                        <option value="Account Executive">Account Executive</option>
                        <option value="Business Development Officer">Business Development Officer</option>
                        <option value="Database Administrator">Database Administrator</option>
                        <option value="Network Engineer">Network Engineer</option>
                        <option value="Software Developer">Software Developer</option>
                        <option value="Finance Manager">Finance Manager</option>
                        <option value="Payroll Officer">Payroll Officer</option>
                        <option value="Customer Service Officer">Customer Service Officer</option>
                        <option value="Support Specialist">Support Specialist</option>
                    </Form.Select>
                </div>


                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Department</label>
                    <Form.Select aria-label="Select department"
                        name='department' value={user.department} onChange={handleChange}>
                        <option value="Creative">Creative</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Customer Service">Customer Service</option>
                    </Form.Select>
                </div>


                <div className='mb-6 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Branch</label>
                    <Form.Select aria-label="Select position"
                        name='branch' value={user.branch} onChange={handleChange}>
                        <option value="Bangkok">กรุงเทพมหานคร</option>
                        <option value="ChiangMai">เชียงใหม่</option>
                        <option value="Phuket">ภูเก็ต</option>
                        <option value="Chonburi">ชลบุรี</option>
                        <option value="Khonkaen">ขอนแก่น</option>
                    </Form.Select>
                </div>

            </div>


            {/* opacity = ความโปร่งความทึบของเส้น */}
            <hr className="w-100 my-4 border-white opacity-75" />


            {/* ข้อมูลที่ให้เลือก */}
            <div className='px-5 mt-2'>
                <label className="text-white fw-light form-label">Event</label>
                <Form.Select aria-label="Select event"
                    name='events' value={user.events} onChange={handleChange}>
                    <option value="อบรมความปลอดภัยในการทำงาน">อบรมความปลอดภัยในการทำงาน</option>
                    <option value="บริจาคโลหิตประจำปี">บริจาคโลหิตประจำปี</option>
                    <option value="Workshop การทำงานเป็นทีม">Workshop การทำงานเป็นทีม</option>
                    <option value="อบรมการใช้ซอฟต์แวร์ใหม่">อบรมการใช้ซอฟต์แวร์ใหม่</option>
                    <option value="กิจกรรมสร้างความสัมพันธ์พนักงาน">กิจกรรมสร้างความสัมพันธ์พนักงาน</option>
                    <option value="งานเปิดตัวสินค้า">งานเปิดตัวสินค้า</option>
                    <option value="อบรมเทคนิคการสื่อสารภายในองค์กร">อบรมเทคนิคการสื่อสารภายในองค์กร</option>
                    <option value="กิจกรรมกีฬาเพื่อสุขภาพ">กิจกรรมกีฬาเพื่อสุขภาพ</option>
                    <option value="Workshop การแก้ไขปัญหาเชิงสร้างสรรค์">Workshop การแก้ไขปัญหาเชิงสร้างสรรค์</option>
                    <option value="งานเลี้ยงบริษัท">งานเลี้ยงบริษัท</option>
                </Form.Select>
            </div>


            {/* ปุ่ม */}
            <div className='text-center mt-12'>
                <Button className='rounded-5 w-50 fw-semibold' style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleSave}>DONE</Button>
            </div>


            {/* centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ */}
            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center py-5">
                    <h5 className="fw-bold mb-3">ลงทะเบียนสำเร็จ!</h5>
                    <p>ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว 🎉</p>

                    <Button variant="primary" className='fw-semibold' style={{ backgroundColor: '#636CCB', border: 'none' }}
                        onClick={() => setShowModal(false)}>
                        CLOSE
                    </Button>

                </Modal.Body>
            </Modal>


        </div>
    )
}

export default InRegister