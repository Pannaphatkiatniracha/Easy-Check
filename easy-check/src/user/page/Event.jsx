import './User.css'
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const Event = () => {

    const events = [
{
      id: 1,
      title: "อบรมความปลอดภัยในการทำงาน",
      date: "25 ตุลาคม 2025",
      location: "ห้องประชุมใหญ่ อาคาร A",
    },
    {
      id: 2,
      title: "บริจาคโลหิตประจำปี",
      date: "1 พฤศจิกายน 2025",
      location: "ห้องประชุมกลาง ชั้น 3",
    },
    {
      id: 3,
      title: "Workshop การทำงานเป็นทีม",
      date: "5 พฤศจิกายน 2025",
      location: "ห้องอบรม อาคาร B",
    },
    {
      id: 4,
      title: "อบรมการใช้ซอฟต์แวร์ใหม่",
      date: "10 พฤศจิกายน 2025",
      location: "ห้องคอมพิวเตอร์ ชั้น 2",
    },
    {
      id: 5,
      title: "กิจกรรมสร้างความสัมพันธ์พนักงาน",
      date: "15 พฤศจิกายน 2025",
      location: "สวนหย่อมอาคาร A",
    },
    {
      id: 6,
      title: "งานเปิดตัวสินค้า",
      date: "20 พฤศจิกายน 2025",
      location: "ห้องประชุม C",
    },
    {
      id: 7,
      title: "อบรมเทคนิคการสื่อสารภายในองค์กร",
      date: "25 พฤศจิกายน 2025",
      location: "ห้องประชุมใหญ่ อาคาร A",
    },
    {
      id: 8,
      title: "กิจกรรมกีฬาเพื่อสุขภาพ",
      date: "30 พฤศจิกายน 2025",
      location: "สนามกีฬาในบริษัท",
    },
    {
      id: 9,
      title: "Workshop การแก้ไขปัญหาเชิงสร้างสรรค์",
      date: "5 ธันวาคม 2025",
      location: "ห้องอบรม อาคาร B",
    },
    {
      id: 10,
      title: "งานเลี้ยงบริษัท",
      date: "10 ธันวาคม 2025",
      location: "ห้องประชุมใหญ่ อาคาร A",
    }
    ]


    return (

        <div className="app-container">

            {/* สไลด์รูป event */}
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


            {/* หัวข้อ + กล่องงาน event */}
            <div className="text-white mt-3 p-3">
                <h2 className="text-warning text-center fw-normal mb-8">Event</h2>

                {events.map((event) => (
                    <Card key={event.id} className="mb-3 bg-transparent border border-warning rounded-3 text-white
                    hover:scale-105 transition-all duration-200 ease-in-out">
                  {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                    duration-200 = ความเร็ว 0.2 s 
                    ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}
                    
                        <Card.Body>
                            <Card.Title>{event.title}</Card.Title>
                            <Card.Text>
                                วันที่: {event.date} <br />
                                สถานที่: {event.location}
                            </Card.Text>
                            <Link to="/register" className='text-decoration-none'>                            
                              <Button variant="warning">ลงทะเบียน</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            
        </div>
    )
}

export default Event