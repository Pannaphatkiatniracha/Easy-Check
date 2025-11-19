import { Link } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';

const Event = () => {

    return (

        <div>


          {/* สไลด์รูปภาพเลื่อนไปเลื่อนมา */}
                <Carousel>
                <Carousel.Item>
                    <img src="/easycheck/img/blood.png" alt="" />
                    <Carousel.Caption>
                    <h1 className='fw-bold'>EVENT</h1>
                    <p>กำลังจะเปิดให้ลงทะเบียนเร็ว ๆ นี้</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img src="/easycheck/img/mic.webp" alt="" />
                    <Carousel.Caption>
                    <h1 className='fw-bold'>EVENT</h1>
                    <p>กำลังจะเปิดให้ลงทะเบียนเร็ว ๆ นี้</p>
                    </Carousel.Caption>
                </Carousel.Item>
                
                <Carousel.Item>
                    <img src="/easycheck/img/joy.png" alt="" />
                    <Carousel.Caption>
                    <h1 className='fw-bold'>EVENT</h1>
                    <p>กำลังจะเปิดให้ลงทะเบียนเร็ว ๆ นี้</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>



          {/* กล่องแยก event */}
            <Link to="/internalevent" className='text-decoration-none'>                
              <div className="mx-auto p-5 text-center rounded-3 text-[#252A46] mt-12 w-75

            {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
              duration-200 = ความเร็ว 0.2 s 
              ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}
              
              hover:scale-105 transition-all duration-200 ease-in-out"
              style={{background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)'}}>
                <h5 className="fw-bold">Corporate <br /> internal event</h5>
              </div>
            </Link>


            <Link to="/externalevent" className='text-decoration-none'>                
              <div className="mx-auto mt-6 p-5 text-center rounded-3 text-[#252A46] mt-12 w-75
              hover:scale-105 transition-all duration-200 ease-in-out"
              style={{background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)'}}>
                <h5 className="fw-bold">Corporate <br /> external event</h5>
              </div>
            </Link>



        </div>
    )
}

export default Event