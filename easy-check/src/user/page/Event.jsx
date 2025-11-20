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





      <div className="mt-24">

        {/* internal */}
        <div className="position-relative overflow-hidden"
            style={{background: 'linear-gradient(135deg, rgba(217, 217, 217, 0.7), rgba(99, 108, 203, 0.5))',
              minHeight: '120px'}}>

            <div className="container-fluid">
              <div className="row align-items-center h-100 py-4">

                {/* icon + กล่อง */}
                <div className="col-10">
                  <div className="d-flex align-items-center">

                    <div className="me-4">
                      <i className="bi bi-building-fill fs-1 text-dark"></i>
                    </div>

                    <div>
                      <h4 className="fw-bold text-dark mb-1">Internal Event</h4>
                      <p className="text-dark opacity-75 mb-0">กิจกรรมภายในองค์กร</p>
                    </div>

                  </div>

                </div>


                {/* icon */}
              <div className="col-1">
                <Link to="/internalevent" className="text-decoration-none">

                  <div className="d-flex justify-content-end align-items-center ps-4">
                    <div className="d-inline-block 
                    hover:rotate-90 transition-transform duration-300 ease-out">

                      <i className="bi bi-arrow-right-circle-fill fs-2 text-dark"></i>
                    
                    </div>
                  </div>

                </Link>
              </div>

              </div>
            </div>

          </div>




        {/* external */}
        <div className="position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, rgba(217, 217, 217, 0.7), rgba(99, 108, 203, 0.5))',
            minHeight: '120px'
          }}>

          <div className="container-fluid">
            <div className="row align-items-center h-100 py-4">

              {/* icon + กล่อง */}
              <div className="col-10">
                <div className="d-flex align-items-center">

                  <div className="me-4">
                    <i className="bi bi-globe2 fs-1 text-dark"></i>
                  </div>

                  <div>
                    <h4 className="fw-bold text-dark mb-1">External Event</h4>
                    <p className="text-dark opacity-75 mb-0">กิจกรรมภายนอกองค์กร</p>
                  </div>

                </div>

              </div>


              {/* icon */}
              <div className="col-1">
                <Link to="/externalevent" className="text-decoration-none">

                  <div className="d-flex justify-content-end align-items-center ps-4">
                    <div className="d-inline-block 
                    hover:rotate-90 transition-transform duration-300 ease-out">
                      
                      <i className="bi bi-arrow-right-circle-fill fs-2 text-dark"></i>
                    </div>

                  </div>

                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Event