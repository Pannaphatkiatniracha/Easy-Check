import './User.css'
import { Button } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Accordion from 'react-bootstrap/Accordion';
import { Link } from "react-router-dom";

const Support = () => {
    return (

        <div className="app-container">


            {/* หัวข้อ + icon back */}
            <div className="d-flex justify-content-between text-warning mt-16">
                
                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก เพราะนางจะมี padding ติดมาอัตโนมัติ */}
                <Link to="/home" className='text-decoration-none'>                
                    <Button variant="link" className="text-warning p-0">
                        <i className="bi bi-chevron-left ms-3"></i>
                    </Button>
                </Link>
                
                <h2 className="fw-normal">Support</h2>

                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-5"></div>

            </div>


            {/* search bar */}

            {/* InputGroup จะรวม icon กับ input เวลาเสิร์ช
            Form.Control จะเป็นกล่อง input */}
            <div className="d-flex justify-content-center mt-4">

                <InputGroup className="w-75">
                    <Form.Control aria-label="Search" placeholder="Search something..." />

                    <Button variant="warning">
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
                            -
                        </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            อยู่นอกพื้นที่กำหนดทำอย่างไร
                        </Accordion.Header>
                        <Accordion.Body>
                            -
                        </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            ลืมรหัสผ่านรีเซ็ตอย่างไร
                        </Accordion.Header>
                        <Accordion.Body>
                            -
                        </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="3">
                        <Accordion.Header>
                            วิธีขออนุมัติลา
                        </Accordion.Header>
                        <Accordion.Body>
                            -
                        </Accordion.Body>
                    </Accordion.Item>
                    

                    <Accordion.Item eventKey="4" >
                        <Accordion.Header>
                            ลงเวลาผิดพลาดแก้ไขอย่างไร
                        </Accordion.Header>
                        <Accordion.Body>
                            -
                        </Accordion.Body>
                    </Accordion.Item>


                </Accordion>
            </div>

        </div>
    )
}
export default Support