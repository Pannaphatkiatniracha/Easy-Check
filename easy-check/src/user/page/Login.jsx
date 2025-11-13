import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import { verifyUser } from "../data/users";


const Login = ({ setToken, setRole }) => {


    // state ที่เอาไว้เก็บค่าต่าง ๆ
    // ซึ่ง set ค่าเริ่มต้นตัวแรกทุกตัวเป็นค่าว่างจ่ะ เจอ set... เมื่อไหร่ก็คือกำลังอัปเดตค่าให้นางอยู่
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    // ก็ฟีลคล้าย ๆ link แหละ นำทางไปหน้านั้นหน้านี้
    const navigate = useNavigate()


    // result มันคือสิ่งที่ verifyUser จะ return ค่ากลับมาเว้ย
    const handleLogin = () => {

        const result = verifyUser(username, password)
        // ถ้าเช็คแล้ว username กับ password เป็นจริง จะเข้าสู่ {} แรก
        if (result) {
            // ถ้าใช่จะเอา token จาก verifyUser มายัดใส่ token ปัจจุบันด้วย setToken
            // แล้ว navigate ไปที่หน้า home เลยถ้าใช่ โดย replace: true ก็คือแทนที่ login ด้วยหน้า home เลยจ่ะ แบบ back กลับไม่ได้ด้วย
            setToken(result.token)
            setRole(result.role)
            navigate('/home', { replace: true })
        } else {
            setError('Username หรือ Password ไม่ถูกต้อง')
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

                        // setUsername(e.target.value)} = เอาค่าที่พิมพ์มา อัพเดตตัวแปร username
                        value={username} onChange={e => setUsername(e.target.value)} />
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


        </div>
    )
}

export default Login