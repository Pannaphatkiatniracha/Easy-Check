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
              <div className="mx-auto p-5 text-center rounded-3 text-white mt-12 bg-[#F26623] w-75">
                <h5>Corporate <br /> internal event</h5>
              </div>
            </Link>

            <Link to="/" className='text-decoration-none'>                
              <div className="mx-auto mt-6 p-5 text-center rounded-3 text-white mt-12 bg-[#F26623] w-75">
                <h5>Corporate <br /> external event</h5>
              </div>
            </Link>


        </div>
    )
}

export default Event