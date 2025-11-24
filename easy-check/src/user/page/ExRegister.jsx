import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ExRegister = ({ role }) => {

    const location = useLocation() // รับข้อมูลจาก state
    const selectedEvent = location.state?.selectedEvent || "" // ข้อมูล event ที่เลือก

    const [showModal, setShowModal] = useState(false)
    const [notes, setNotes] = useState("") // State สำหรับเก็บหมายเหตุเพิ่มเติม

    // กำหนด API URL ตาม role
    const getApiUrls = () => {
        if (role === "approver") {
            return {
                profile: "https://6918ce1c21a9635948713999.mockapi.io/users/1",
                register: "https://69037e5cd0f10a340b249323.mockapi.io/register/1"
            }
        } else {
            return {
                profile: "https://68fbd77794ec960660275293.mockapi.io/users/6",
                register: "https://69037e5cd0f10a340b249323.mockapi.io/register/1"
            }
        }
    }

    const apiUrls = getApiUrls()

    // setUser ใช้ตอนเปลี่ยนค่า user
    const [user, setUser] = useState(
        {
            name: "", //ค่าตั้งต้น
            userid: "",
            position: "",
            department: "",
            branch: "",
            events: selectedEvent || ""  // เซ็ตค่าเริ่มต้นจาก event ที่เลือกกดเข้ามา
        }
    )

    // ตอนรันเว็บครั้งแรกให้ไปดึงข้อมูลจาก Mock API

    // async คือเป็นเป็นนางประกาศ บอกชาวบ้านเขาว่ากำลังจะมีงานใหญ่มานะแก
    // const res = await fetch ("") ก็คือให้ res นางเป็นตัวรับค่าข้อมูลในลิ้งมา ซึ่งพอมี await ก็คือบอกให้รอโหลดให้เสร็จก่อนนะ
    // const data = await res.json() ก็คือเอาให้ res แปลงสภาพตัวเองเป็น json แต่อยู่ในนาม data เพราะ res คือตัวแปรข้อมูลดิบ และให้ รอนางแปลงสภาพเสร็จก่อน

    useEffect(() => {
        const loadData = async () => {
            const res = await fetch(apiUrls.profile)
            const data = await res.json()
            setUser({
                name: data.name || "",
                userid: data.userid || "",
                position: data.position || "",
                department: data.department || "",
                branch: data.branch || "",
                events: selectedEvent || ""
            })
        }
        loadData()
    }, [selectedEvent])   //ทำครั้งเดียวตอนหน้าเว็บโหลด

    // บันทึกข้อมูลที่แก้ไข
    const handleSave = async () => {
        const registrationData = {
            ...user,
            notes: notes // เพิ่มหมายเหตุในการลงทะเบียน
        }
        
        await fetch(apiUrls.register, {
            method: "PUT", // อัปเดต
            headers: { "Content-Type": "application/json" },  // ข้อมูลที่ส่งไปเป็น JSON
            body: JSON.stringify(registrationData),  // แปลง state เป็นตัวหนังสือ JSON เพื่อส่งไปที่ API
        })
        setShowModal(true)
    }



    
    const UserPage = (
        <div className='app-container'>

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/externalevent" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold">Register to</h3>
                    <h5 className="text-white mb-0">{selectedEvent}</h5>
                </div>

                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>

            {/* ข้อมูลอีเว้น*/}
            <div className="mt-6">
                <div className="mb-3 rounded-3 text-black mx-3"
                    style={{ backgroundColor: '#D9D9D9' }}>

                    <div className="p-3">
                        <div className="d-flex align-items-start">

                            {/* icon  */}
                            <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: '45px', height: '45px', backgroundColor: 'white', opacity: 0.9 }}>

                                <i className="bi bi-calendar-event fs-5 text-[#6D29F6]"></i>

                            </div>

                            {/* เนื้อหา */}
                            <div className="flex-grow-1">

                                <div className="h6 mb-2">
                                    <b>{selectedEvent}</b>
                                </div>

                                <div className="small mb-2">
                                    <i className="bi bi-calendar3 me-1"></i> วันที่: ข้อมูลวันที่ <br />
                                    <i className="bi bi-geo-alt me-1"></i> สถานที่: ข้อมูลสถานที่
                                </div>

                                <div className="small text-success">
                                    <i className="bi bi-globe me-1"></i> External Event
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ข้อมูลที่ลิ้งมาจาก profile */}
            <div className="d-flex flex-column align-items-center mt-6">

                <div className="mb-3 w-75">
                    {/* form-label มาจาก bootstrap ไว้จัดเลเอ้าระหว่าง label กับ input ให้เริ่ด
                    ส่วน form-control ก็จุดประสงค์เดิมแต่ไว้ใช้กับ input */}
                    <label className="text-white fw-light form-label" htmlFor="">Employee ID</label>
                    <input className="rounded-1 form-control fw-semibold" type="text" 
                        name='userid' value={user.userid} readOnly />
                </div>

                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label" htmlFor="">Name</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='name' value={user.name} readOnly />
                </div>

                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label" htmlFor="">Position</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='position' value={user.position} readOnly />
                </div>

                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Department</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='department' value={user.department} readOnly />
                </div>

                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Branch</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='branch' value={user.branch} readOnly />
                </div>

                {/* กล่องหมายเหตุ */}
                <div className='mb-6 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Additional Notes</label>
                    <textarea 
                        className="rounded-1 form-control fw-semibold" 
                        rows="3"
                        placeholder="เช่น วัตถุประสงค์การเข้าร่วม, รายละเอียดเพิ่มเติม, หรือคำขอพิเศษ..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="form-text text-white-50">
                        ระบุหมายเหตุเพิ่มเติมเกี่ยวกับการเข้าร่วมงาน (ถ้ามี)
                    </div>
                </div>

            </div>


            {/* ปุ่ม */}
            <div className='text-center mt-12 mb-12'>
                <Button className='rounded-5 w-50 fw-semibold' style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleSave}>DONE</Button>
            </div>

            {/* 
                centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ
                backdrop = ให้คลิกด้านนอก modal ก็ปิดตัว modal ได้
                keyboard = กด esc ที่ปุ่มคีย์บอร์ดก็ปิดได้
             */}

            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                    <h5 className="fw-bold mt-2">You're registered!</h5>
                    <p><i>{user.name}</i> registered for<br />{selectedEvent}</p>
                    {notes && (
                        <div className="mt-3 p-2 bg-light rounded">
                            <small className="text-muted">
                                <strong>หมายเหตุ:</strong> {notes}
                            </small>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    )





    const ApprovePage = (
        <div className='app-container'>

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-white mt-16">

                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/externalevent" className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <div className="d-flex flex-column align-items-center">
                    <h3 className="fw-bold">Register to</h3>
                    <h5 className="text-white">{selectedEvent}</h5>
                    <small className="text-warning">👑 Approver</small>
                </div>

                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>

            {/* ข้อมูลอีเว้น*/}
            <div className="mt-6">
                <div className="mb-3 rounded-3 text-black mx-3"
                    style={{ backgroundColor: '#D9D9D9' }}>

                    <div className="p-3">
                        <div className="d-flex align-items-start">

                            {/* icon  */}
                            <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: '45px', height: '45px', backgroundColor: 'white', opacity: 0.9 }}>

                                <i className="bi bi-calendar-event fs-5 text-[#6D29F6]"></i>

                            </div>

                            {/* เนื้อหา */}
                            <div className="flex-grow-1">

                                <div className="h6 mb-2">
                                    <b>{selectedEvent}</b>
                                </div>

                                <div className="small mb-2">
                                    <i className="bi bi-calendar3 me-1"></i> วันที่: ข้อมูลวันที่ <br />
                                    <i className="bi bi-geo-alt me-1"></i> สถานที่: ข้อมูลสถานที่
                                </div>

                                <div className="small text-success">
                                    <i className="bi bi-globe me-1"></i> External Event
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ข้อมูลที่แสดงลิ้งมาจากหน้า profile */}
            <div className="d-flex flex-column align-items-center mt-6">

                <div className="mb-3 w-75">
                    {/* form-label มาจาก bootstrap ไว้จัดเลเอ้าระหว่าง label กับ input ให้เริ่ด
                    ส่วน form-control ก็จุดประสงค์เดิมแต่ไว้ใช้กับ input */}
                    <label className="text-white fw-light form-label" htmlFor="">Employee ID</label>
                    <input className="rounded-1 form-control fw-semibold" type="text" 
                        name='userid' value={user.userid} readOnly />
                </div>

                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label" htmlFor="">Name</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='name' value={user.name} readOnly />
                </div>

                <div className="mb-3 w-75">
                    <label className="text-white fw-light form-label" htmlFor="">Position</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='position' value={user.position} readOnly />
                </div>

                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Department</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='department' value={user.department} readOnly />
                </div>

                <div className='mb-3 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Branch</label>
                    <input className="rounded-1 form-control fw-semibold" type="text"
                        name='branch' value={user.branch} readOnly />
                </div>

                {/* กล่องหมายเหตุ */}
                <div className='mb-6 w-75'>
                    <label className="text-white fw-light form-label" htmlFor="">Additional Notes</label>
                    <textarea 
                        className="rounded-1 form-control fw-semibold" 
                        rows="3"
                        placeholder="เช่น วัตถุประสงค์การเข้าร่วม, รายละเอียดเพิ่มเติม, หรือคำขอพิเศษ..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="form-text text-white-50">
                        ระบุหมายเหตุเพิ่มเติมเกี่ยวกับการเข้าร่วมงาน (ถ้ามี)
                    </div>
                </div>

            </div>

            {/* ปุ่ม */}
            <div className='text-center mt-12 mb-12'>
                <Button className='rounded-5 w-50 fw-semibold' style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleSave}>DONE</Button>
            </div>

            {/* 
                centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ
                backdrop = ให้คลิกด้านนอก modal ก็ปิดตัว modal ได้
                keyboard = กด esc ที่ปุ่มคีย์บอร์ดก็ปิดได้
             */}

            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    <i className="bi bi-check-circle-fill fs-1 text-[#50AE67]"></i>
                    <h5 className="fw-bold mt-2">You're registered!</h5>
                    <p><i>{user.name}</i> (Approver) registered for<br />{selectedEvent}</p>
                    {notes && (
                        <div className="mt-3 p-2 bg-light rounded">
                            <small className="text-muted">
                                <strong>หมายเหตุ:</strong> {notes}
                            </small>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    )

    return role === "approver" ? ApprovePage : UserPage

}

export default ExRegister