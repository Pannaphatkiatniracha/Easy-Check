import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './User.css'

const Login = () => {
    return (

        <div className='app-container'>


            {/* รอมี logo มาใส่เพิ่มตรงนี้แล้วค่อยจัด lay out ใหม่อีกรอบ */}
            
            
            {/* รูปโปรไฟล์ */}
            <div className="w-25 mx-auto mt-28">
                <img src="/easycheck/img/who.webp" className="rounded-circle w-100 h-100" />
            </div>


            {/* กรอก user + password */}
            <div className='d-flex flex-column align-items-center'>

                {/* FormControl คือกล่อง input */}
                <div className='mt-12 w-75'>
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-person-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='text' placeholder='Username' />
                    </InputGroup>
                </div>

                <div className='mt-6 w-75'>
                    <InputGroup>
                        <InputGroup.Text>
                        <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='password' placeholder='Password' />
                    </InputGroup>

                <Link to="/forgotpassword" className='text-decoration-none'>                
                    <p className='text-warning text-end fw-lighter mt-2'>Forget Password?</p>
                </Link>

                </div>
                
            </div>


            {/* ปุ่ม */}
            <Link to="/home" className='text-decoration-none'>            
                <div className='text-center mt-14'>
                    <Button className='rounded-3 w-25' variant='warning' type='submit'>LOGIN</Button>
                </div>
            </Link>

            

        </div>
    )
}

export default Login