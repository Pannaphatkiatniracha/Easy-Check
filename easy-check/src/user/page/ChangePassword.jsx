import { Link } from "react-router-dom";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const ChangePassword = () => {

        // setUser ใช้ตอนเปลี่ยนค่า user
        const [user, setUser] = useState(
            {
                current: "", //ค่าตั้งต้น
                new: "",
                confirm: "",
            }
        )
    
        // ตอนรันเว็บครั้งแรกให้ไปดึงข้อมูลจาก Mock API
    
        // async คือเป็นเป็นนางประกาศ บอกชาวบ้านเขาว่ากำลังจะมีงานใหญ่มานะแก
        // const res = await fetch ("") ก็คือให้ res นางเป็นตัวรับค่าข้อมูลในลิ้งมา ซึ่งพอมี await ก็คือบอกให้รอโหลดให้เสร็จก่อนนะ
        // const data = await res.json() ก็คือเอาให้ res แปลงสภาพตัวเองเป็น json แต่อยู่ในนาม data เพราะ res คือตัวแปรข้อมูลดิบ และให้ รอนางแปลงสภาพเสร็จก่อน
    
        
        useEffect(() => {
            const loadData = async () => {
                const res = await fetch("https://69037e5cd0f10a340b249323.mockapi.io/password/1")
                const data = await res.json()
                setUser({
                    current: data.current || "",
                    new: data.new || "",
                    confirm: data.confirm || "",
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
        await fetch("https://69037e5cd0f10a340b249323.mockapi.io/password/1", {
          method: "PUT", // อัปเดต
          headers: { "Content-Type": "application/json" },  // ข้อมูลที่ส่งไปเป็น JSON
          body: JSON.stringify(user),  // แปลง state เป็นตัวหนังสือ JSON เพื่อส่งไปที่ API
        })
        alert("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว")
      }


    return (

        <div className="app-container">

            {/* หัวข้อ */}
            <div className="d-flex justify-content-between text-[#F26623] mt-16">
                
                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/profile" className='text-decoration-none'>                
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-[#F26623]"></i>
                    </Button>
                </Link>
                
                <h3 className="fw-normal">Change your password</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            <div className="d-flex flex-column align-items-center">

                {/* password เก่า */}
                <div className='mt-16 w-75'>
                    <InputGroup>
                        <InputGroup.Text>
                        <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='password' placeholder='Current password'
                        name="current" value={user.current} onChange={handleChange} />
                    </InputGroup>

                <Link to="/forgotpassword" className='text-decoration-none'>                
                    <p className='text-[#F26623] text-end fw-lighter mt-2'>Forget Password?</p>
                </Link>
                </div>


                {/* เส้น */}
                <hr className="w-75 mx-auto my-4 border-[#F26623] opacity-75" />


                {/* password ใหม่ */}
                <div className="mt-3 mb-4 w-75">
                    <InputGroup>
                        <InputGroup.Text>
                        <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='password' placeholder='New password'
                        name="new" value={user.new} onChange={handleChange} />
                    </InputGroup>
                </div>


                {/* confirm password ใหม่ */}
                <div className="w-75">
                    <InputGroup>
                        <InputGroup.Text>
                        <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl type='password' placeholder='Confirm password'
                        name="confirm" value={user.confirm} onChange={handleChange} />
                    </InputGroup>
                </div>

            </div>

                
                {/* ปุ่ม */}
                <div className='text-center mt-20'>
                    <Button className='rounded-5 w-25' style={{backgroundColor: '#F26623', border: 'none'}} onClick={handleSave} >Save</Button>
                </div>


        </div>
    )
}

export default ChangePassword