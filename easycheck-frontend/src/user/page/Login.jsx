import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import { Modal } from 'react-bootstrap';

// import axios from 'axios';
import Api from '../../Api'; // ตรงนี้ใช้แทน axios

// const HOST = 'localhost'
// const PORT = '5000'

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
    const handleLogin = async () => {
        // ล้างค่า Error เก่าก่อน
        setError('')

        try {
            const response = await Api.post('/auth/login', { // ตรงนี้เรียก axios ที่ 'Api' แล้ว
                id_employee: username,
                password: password // ส่ง username,password ไปแบคเอนในนาม employee_id,password ตาม db
            })

            // ถ้าผ่าน axios จะเอาข้อมูลเก็บใส่ .data ให้เลย ก็คือส่งกลับ token,refreshToken,role คืนมา
            const { token, refreshToken, role } = response.data

            // 🐷🐷 ตรวจสอบสิทธิ์ก่อน
            const isAdmin = role === "admin" || role === "super admin"
        

            if (isAdmin) {
                // 🐷🐷 ถ้าเป็น Admin ให้เตะออกไปทาง catch เลยจ้า
                throw new Error("Admins must login through the Admin page")
            }

            // 🐷🐷 แปลงนัง level มาเป็น role ของเราโดยมีค่าเริ่มต้นเป็น user
            let mappedRole = "user"
            
            if (role === "approver") {
                mappedRole = "approver";
            } else {
                mappedRole = "user";
            }

            // เก็บข้อมูลที่แบคเอนส่งมาลงเครื่องเหมือนเดิม
            localStorage.setItem('token', token)
            localStorage.setItem('role', mappedRole) // 🐷🐷 ใช้ mappedRole ที่เราแปลงแล้วแทน
            localStorage.setItem('refreshToken', refreshToken) // เก็บ refreshToken ลงในเครื่อง เพื่อเอาไว้ใช้ต่ออายุ token

            // อัปเดต State และนำทาง
            setToken(token)
            setRole(mappedRole) // 🐷🐷 ใช้ mappedRole เพื่อให้หน้า Setting/Home เช็คเงื่อนไขผ่าน
            navigate('/home', { replace: true })

        } catch (err) {
            // 🐷🐷 ถ้าโดน throw Error มา หรือ Backend พัง จะมาจบที่นี่
            const errMsg = err.response?.data?.message || err.message
            setError(errMsg)
            setShowModal(true)
        }
    }


    return (

        <div className='app-container'>

            {/* profile เปล่า แต่น่าจะเปลี่ยนเป็น logo */}
            <div className="w-25 mx-auto mt-28">
                <img src="/easycheck/img/who.webp" className="rounded-circle w-100 h-100" />
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


                        {/* >>>>> text.replace(สิ่งที่อยากหา, สิ่งที่อยากแทนที่)
                                \D = ไม่ใช่ตัวเลข
                                /…/g = / สิ่งที่อยากหา / ตัวเลือก
                                g = ช่วยลบตัวที่ไม่ใช่ตัวเลขทุกตัวที่กรอกมาเลย ไม่งั้นมันจะลบแค่ตัวแรกที่มันเจอ
                                ส่วนที่ลบก็แทนที่ด้วยค่าว่าง "" นั่นเองง ✨ 
                            */}

                        {/* "123456789".slice(3,6)
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



                    {/* AND
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

