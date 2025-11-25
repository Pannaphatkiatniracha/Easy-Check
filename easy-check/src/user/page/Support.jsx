import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { useState } from "react";


const Support = () => {


    const [search, setSearch] = useState("")
    const [openItem, setOpenItem] = useState(null) // เก็บ id ของ item ที่เปิดอยู่


    const faqs = [
        {
            id: 1,
            question: "ทำไมลงเวลาไม่ได้แก้อย่างไร",
            answer: (
                <>
                    <b>หากไม่สามารถลงเวลาได้ ให้ตรวจสอบว่า:</b>
                    <ul>
                        <li>1. เปิด GPS/Location ของมือถือแล้ว</li>
                        <li>2. อยู่ในพื้นที่กำหนดของบริษัท</li>
                        <li>3. เชื่อมต่ออินเทอร์เน็ต</li>
                    </ul>
                    <br />
                    <b><small>หากยังไม่สามารถลงเวลาได้ ให้ติดต่อฝ่าย HR หรือ IT Support</small></b>
                </>
            ),
        },
        {
            id: 2,
            question: "อยู่นอกพื้นที่กำหนดทำอย่างไร",
            answer: (
                <>
                    <b>ระบบจะไม่สามารถลงเวลาได้หากอยู่นอกพื้นที่กำหนด หากเป็นกรณีจำเป็น:</b>
                    <br />
                    &nbsp;
                    <ul>
                        <li>1. แจ้งหัวหน้าผู้มีสิทธิ์กำหนดพื้นที่ลงเวลา</li>
                        {/* <li>2. ลงเวลาแบบ Manual พร้อมแนบเหตุผล</li> */}
                    </ul>
                </>
            ),
        },
        {
            id: 3,
            question: "ลืมรหัสผ่านรีเซ็ตอย่างไร",
            answer: (
                <>
                    &nbsp; กด <b>"Forgot Password"</b> บน <b>หน้า Log in</b> ระบบจะส่งอีเมลหรือ SMS สำหรับรีเซ็ตรหัสผ่านตามที่ลงทะเบียนไว้
                    หากไม่ได้รับอีเมล ให้ตรวจสอบโฟลเดอร์ Spam หรือแจ้งฝ่าย IT
                </>
            ),
        },
        {
            id: 4,
            question: "วิธีขออนุมัติลา",
            answer: (
                <>
                    1. เข้าเมนู "Leave Request" ในแอป <br />
                    2. เลือกวันที่และเวลาที่ต้องการลา <br />
                    3. ระบุเหตุผลการลา <br />
                    4. แนบเอกสารประกอบ (ถ้ามี) <br />
                    5. กดส่งคำขอ รอผู้บังคับบัญชาอนุมัติ <br />
                    6. ระบบจะแจ้งผลอนุมัติผ่านแอป
                </>
            ),
        },
        // {
        //     id: 5,
        //     question: "ลงเวลาผิดพลาดแก้ไขอย่างไร",
        //     answer: (
        //         <>
        //             <b>หากลงเวลาเข้า/ออกผิดพลาด:</b>
        //             <ul>
        //                 <li>ไปที่เมนู "แก้ไขเวลา" หรือ "Time Correction"</li>
        //                 <li>เลือกวันที่และเวลาที่ต้องการแก้ไข</li>
        //                 <li>ระบุเหตุผล แล้วส่งให้ผู้บังคับบัญชาอนุมัติ</li>
        //             </ul>
        //         </>
        //     ),
        // },
    ]


    // filter = วนดูทุกตัวแล้วค่อยกรองตามเงื่อนไข
    // includes = method ที่เอาไว้ เช็คว่ามีคำนี้อยู่ในประโยคไหม

    const filteredFaqs = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase())
    )

    // ฟังก์ชันเปิดปิด accordion
    const toggleItem = (id) => {
        setOpenItem(openItem === id ? null : id)
    }



    return (

        <div className="app-container">


            {/* หัวข้อ + icon back */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to="/home" className="text-decoration-none">
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>

                <h2 className="fw-bold">Support</h2>
                <div className="me-5"></div>
            </div>


            {/* search bar */}
            <div className="d-flex justify-content-center mt-8">
                <InputGroup className="w-75">
                    <Form.Control
                        aria-label="Search"
                        placeholder="Search something..."

                        // ซึ่ง search ก็คือค่าจริง ๆ ณ ตอนนั้นที่อยู่ใน state
                        value={search}

                        // เวลามีอะไรเกิดขึ้นข้อมูลจะส่งมาที่ e 
                        // e.target = คือเหตุการณ์ที่เกิดขึ้นกับมัน แต่ e.target.value คือค่าที่อยู่ในกล่อง
                        // พอเอา setSearch ครอบเข้าไป ก็คืออัปเดตให้มันเป็น search หรือก็คือข้อมูลปัจจุบันนั่นแหละ

                        onChange={(e) => setSearch(e.target.value)}/>
                        
                    <Button style={{ backgroundColor: "#636CCB", border: "none" }}>
                        <i className="bi bi-search"></i>
                    </Button>
                </InputGroup>
            </div>

            {/* <div className="text-white fw-semibold mt-6 ml-6">
                <h5>คำถามที่พบบ่อย</h5>
            </div> */}

            <div className="mt-14">
                {filteredFaqs.length > 0 ?

                    (
                        filteredFaqs.map((item) => (

                            // กล่อง Accordion
                            <div key={item.id} className="border-bottom border-white">

                                {/* หัวข้อ */}
                                <button
                                    className="w-100 text-start p-3 border-0 text-white fw-semibold d-flex justify-content-between align-items-center"
                                    style={{
                                        background: 'transparent',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => toggleItem(item.id)}>

                                    <span>{item.question}</span>
                                    <i className={`bi bi-chevron-down ${openItem === item.id ? 'rotate-180' : ''}`}
                                       style={{ transition: 'transform 0.3s ease' }}></i>

                                </button>


                                {/* คำตอบ */}
                                <div style={{ 
                                    maxHeight: openItem === item.id ? '500px' : '0',
                                    opacity: openItem === item.id ? '1' : '0',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease'
                                }}>

                                    <div className="p-3 text-dark" style={{backgroundColor: 'rgba(244, 244, 244, 0.69)'}}>
                                        {item.answer}
                                    </div>

                                </div>

                            </div>

                        ))
                    )

                    : (
                        <div className="text-center text-white mt-3">
                            <p>❌ ไม่พบผลลัพธ์ที่ตรงกับ "{search}"</p>
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Support