import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import { verifyUser } from "../data/users";
import { Modal } from 'react-bootstrap';


const Login = ({ setToken, setRole }) => {


    const [showModal, setShowModal] = useState(false)

    // state ที่เอาไว้เก็บค่าต่าง ๆ
    // ซึ่ง set ค่าเริ่มต้นตัวแรกทุกตัวเป็นค่าว่างจ่ะ เจอ set... เมื่อไหร่ก็คือกำลังอัปเดตค่าให้นางอยู่
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    // ก็ฟีลคล้าย ๆ link แหละ นำทางไปหน้านั้นหน้านี้
    const navigate = useNavigate()


    // result มันคือสิ่งที่ verifyUser จะ return ค่ากลับมาเว้ย
    const handleLogin = () => {

        // result คือคำตอบจากการตรวจสอบ verifyUser
        const result = verifyUser(username, password)

        // ถ้าเช็คแล้ว username กับ password เป็นจริง จะเข้าสู่ {} แรก
        if (result) {

            // ถ้าใช่จะเอา token จาก verifyUser มายัดใส่ token ปัจจุบันด้วย setToken
            // แล้ว navigate ไปที่หน้า home เลยถ้าใช่ โดย replace: true ก็คือแทนที่ login ด้วยหน้า home เลยจ่ะ แบบ back กลับไม่ได้ด้วย

            // บันทึกลง localStorage
            // .setItem(key, value)
            localStorage.setItem('token', result.token)
            localStorage.setItem('role', result.role)

            // อัปเดต state ของ App.jsx ด้วย
            setToken(result.token)
            setRole(result.role)

            navigate('/home', { replace: true })
        } else {
            setError('Username or Password is incorrect')
            setShowModal(true)
        }
    }


    return (

        <div className='app-container'>

            {/* profile เปล่า แต่น่าจะเปลี่ยนเป็น logo */}
            <div className="w-25 mx-auto mt-28">
                <img src="/easy-check/img/who.webp" className="rounded-circle w-100 h-100" />
            </div>



            <div className='d-flex flex-column align-items-center'>

                {/* user */}
                <div className='mt-12 w-75'>
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-person-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='text' placeholder='Employee ID'
                            value={username}

                            // ทุกครั้งที่พิมพ์จะมาอัปเดต username
                            onChange={(e) => {

                                // let enter = e.target.value = ดึงค่าที่พิมพ์มา
                                let enter = e.target.value.replace(/\D/g, "") // ตัดทุกอย่างที่ไม่ใช่ตัวเลขออก
                                enter = enter.slice(0, 6)
                                setUsername(enter)
                            }} />


                            {/* 
                                >>>>> text.replace(สิ่งที่อยากหา, สิ่งที่อยากแทนที่)
                                \D = ไม่ใช่ตัวเลข
                                /…/g = / สิ่งที่อยากหา / ตัวเลือก
                                g = ช่วยลบตัวที่ไม่ใช่ตัวเลขทุกตัวที่กรอกมาเลย ไม่งั้นมันจะลบแค่ตัวแรกที่มันเจอ
                                ส่วนที่ลบก็แทนที่ด้วยค่าว่าง "" นั่นเองง ✨ 
                            */}

                            {/* 
                                "123456789".slice(3,6)
                                = 456 
                                เพราะ(ตัวแรก,ตัวสอง) ตัวแรกคือตัวแรกที่เริ่มนับ ตัวสอง
                            */}

                    </InputGroup>

                </div>


                {/* password */}
                <div className='mt-6 w-75'>
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='password' placeholder='Password'
                            value={password} onChange={e => setPassword(e.target.value)} />
                    </InputGroup>


                    {/* forgot password */}
                    <Link to="/forgotpassword" className='text-decoration-none'>
                        <p className='text-white text-end fw-lighter mt-2'>Forget Password?</p>
                    </Link>



                    {/* 
                        AND
                        condition && <SomeComponent />
                        ถ้าไม่ตรง condition ก็คือจะไม่แสดงอะไรไปเลย
                        แต่ถ้าตรงก็จะแสดงสิ่งที่อยู่หลัง &&
                    */}

                    {error && <p className="text-danger text-center fw-semibold mt-4">{error}</p>}

                </div>


            </div>


            {/* ปุ่ม login */}
            <div className='text-center mt-14'>
                <Button className='rounded-3 w-25 fw-semibold'
                    style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleLogin}>LOGIN</Button>
            </div>


            {/* centered คือตัวที่กำหนดให้ modal มัน show ตรงกลางเว็บ */}
            <Modal size="sm" show={showModal} onHide={() => setShowModal(false)} centered backdrop={true} keyboard={true}>
                <Modal.Body className="text-center py-5">
                    <i className="bi-x-circle-fill fs-1 text-danger"></i>
                    <h5 className="fw-bold mt-2">Login Failed</h5>
                    <p>{error}</p>

                </Modal.Body>
            </Modal>


        </div>
    )
}

export default Login