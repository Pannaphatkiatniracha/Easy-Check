import { Button } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Accordion from 'react-bootstrap/Accordion';
import { Link } from "react-router-dom";

const Support = () => {
    return (

        <div className="app-container">


            {/* หัวข้อ + icon back */}
            <div className="d-flex justify-content-between text-white mt-16">
                
                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก เพราะนางจะมี padding ติดมาอัตโนมัติ */}
                <Link to="/home" className='text-decoration-none'>                
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                
                <h2 className="fw-bold">Support</h2>

                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-5"></div>

            </div>


            {/* search bar */}

            {/* InputGroup จะรวม icon กับ input เวลาเสิร์ช
            Form.Control จะเป็นกล่อง input */}
            <div className="d-flex justify-content-center mt-4">

                <InputGroup className="w-75">
                    <Form.Control aria-label="Search" placeholder="Search something..." />

                    <Button style={{backgroundColor: '#636CCB', border: 'none'}}>
                        <i className="bi bi-search" ></i>
                    </Button>

                </InputGroup>
            </div>



            <div className="text-white fw-semibold mt-6 ml-6">
                <h5>คำถามที่พบบ่อย</h5>
            </div>


            <div className="mt-4">
                <Accordion>

                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            ทำไมลงเวลาไม่ได้แก้อย่างไร
                        </Accordion.Header>
                        <Accordion.Body>
                            <b>หากไม่สามารถลงเวลาได้ ให้ตรวจสอบว่า:</b>
                            <ul>
                                <li>เปิด GPS/Location ของมือถือแล้ว</li>
                                <li>อยู่ในพื้นที่กำหนดของบริษัท</li>
                                <li>เชื่อมต่ออินเทอร์เน็ต</li>
                            </ul>
                            หากยังไม่สามารถลงเวลาได้ ให้ติดต่อฝ่าย HR หรือ IT Support
                        </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            อยู่นอกพื้นที่กำหนดทำอย่างไร
                        </Accordion.Header>
                        <Accordion.Body>
                            <b>ระบบจะไม่สามารถลงเวลาได้หากอยู่นอกพื้นที่กำหนด หากเป็นกรณีจำเป็น:</b>
                            <ul>
                                <li>แจ้งผู้บังคับบัญชาผ่านแอปหรืออีเมล</li>
                                <li>ลงเวลาแบบ Manual พร้อมแนบเหตุผล</li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            ลืมรหัสผ่านรีเซ็ตอย่างไร
                        </Accordion.Header>
                        <Accordion.Body>
                            กด “ลืมรหัสผ่าน” บนหน้าเข้าสู่ระบบ ระบบจะส่งอีเมลหรือ SMS สำหรับรีเซ็ตรหัสผ่านตามที่ลงทะเบียนไว้ หากไม่ได้รับอีเมล ให้ตรวจสอบโฟลเดอร์ Spam หรือแจ้งฝ่าย IT
                        </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="3">
                        <Accordion.Header>
                            วิธีขออนุมัติลา
                        </Accordion.Header>
                        <Accordion.Body>
                            1. เข้าเมนู “Leave Request” ในแอป  <br />
                            2. เลือกประเภทการลา และกรอกวันที่ที่ต้องการลา  <br />
                            3. แนบเอกสารประกอบ (ถ้ามี)  <br />
                            4. กดส่งคำขอ รอผู้บังคับบัญชาอนุมัติ  <br />
                            5. ระบบจะแจ้งผลอนุมัติผ่านแอป
                        </Accordion.Body>
                    </Accordion.Item>
                    

                    <Accordion.Item eventKey="4" >
                        <Accordion.Header>
                            ลงเวลาผิดพลาดแก้ไขอย่างไร
                        </Accordion.Header>
                        <Accordion.Body>
                            <b>หากลงเวลาเข้า/ออกผิดพลาด:</b>
                            <ul>
                                <li>ไปที่เมนู “แก้ไขเวลา” หรือ “Time Correction”</li>
                                <li>เลือกวันที่และเวลาที่ต้องการแก้ไข</li>
                                <li>ระบุเหตุผล แล้วส่งให้ผู้บังคับบัญชาอนุมัติ</li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>


                </Accordion>
            </div>

        </div>
    )
}
export default Support