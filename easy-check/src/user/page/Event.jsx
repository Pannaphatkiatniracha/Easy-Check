import { Link } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';

const Event = () => {
  return (
    <div>

      {/* สไลด์รูปภาพ */}
      <Carousel>
        <Carousel.Item>
          <img
            src="/easycheck/img/blood.png"
            alt="Blood"
            className="d-block w-100"
          />
          <Carousel.Caption>
            <h1 className='fw-bold'>EVENT</h1>
            <p>กำลังจะเปิดให้ลงทะเบียนเร็ว ๆ นี้</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            src="/easycheck/img/mic.webp"
            alt="Mic"
            className="d-block w-100"
          />
          <Carousel.Caption>
            <h1 className='fw-bold'>EVENT</h1>
            <p>กำลังจะเปิดให้ลงทะเบียนเร็ว ๆ นี้</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            src="/easycheck/img/joy.png"
            alt="Joy"
            className="d-block w-100"
          />
          <Carousel.Caption>
            <h1 className='fw-bold'>EVENT</h1>
            <p>กำลังจะเปิดให้ลงทะเบียนเร็ว ๆ นี้</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Internal Event */}
      <div className="w-80 mx-auto mb-6 mt-24">
        <Link to="/internalevent" className="text-decoration-none group">
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3 shadow-2xl border border-[#7f5cff]/40 
          p-4 flex items-center gap-4 transform transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_#7f5cff] w-full h-24">
            
            <i className="bi bi-building-fill text-3xl text-[#7f5cff] flex-shrink-0"></i>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">Internal Event</h4>
              <p className="text-gray-600 text-sm">กิจกรรมภายในองค์กร</p>
            </div>
            <i className="bi bi-arrow-right-circle-fill text-2xl text-[#7f5cff] ml-auto transition-transform duration-300 group-hover:rotate-90 flex-shrink-0"></i>
          </div>
        </Link>
      </div>

      {/* External Event */}
      <div className="w-80 mx-auto">
        <Link to="/externalevent" className="text-decoration-none group">
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3 shadow-2xl border border-[#7f5cff]/40 
          p-4 flex items-center gap-4 transform transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_#7f5cff] w-full h-24">
            
            <i className="bi bi-globe2 text-3xl text-[#7f5cff] flex-shrink-0"></i>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">External Event</h4>
              <p className="text-gray-600 text-sm">กิจกรรมภายนอกองค์กร</p>
            </div>
            <i className="bi bi-arrow-right-circle-fill text-2xl text-[#7f5cff] ml-auto transition-transform duration-300 group-hover:rotate-90 flex-shrink-0"></i>
          </div>
        </Link>
      </div>

    </div>
  );
}

export default Event;
