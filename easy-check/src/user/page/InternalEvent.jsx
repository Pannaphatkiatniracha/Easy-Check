import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const InternalEvent = () => {


    const inevents = [
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
    location: "สวนหย่อม อาคาร A",
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
        <div className='app-container'>


            {/* หัวข้อ + icon */}
            <div className="d-flex justify-content-between text-warning mt-16">
                
                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/event" className='text-decoration-none'>                
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                
                <h3 className="text-white text-center fw-bold">Corporate <br /> internal event</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            {/* หัวข้อ + กล่องงาน event */}
            <div className="mt-3 p-3">

                {inevents.map((inevent) => (
                    <Card key={inevent.id} className="mb-3 rounded-3 text-black
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{backgroundColor: '#D9D9D9'}}>
                  {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                    duration-200 = ความเร็ว 0.2 s 
                    ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}
                    
                        <Card.Body>
                            <Card.Title><b>{inevent.title}</b></Card.Title>
                            <Card.Text>
                                วันที่: {inevent.date} <br />
                                สถานที่: {inevent.location}
                            </Card.Text>
                            <Link to="/inregister" className='text-decoration-none'>                            
                              <Button className='text-white fw-semibold' style={{backgroundColor: '#636CCB', border: 'none'}}>REGISTER</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    )
}
export default InternalEvent