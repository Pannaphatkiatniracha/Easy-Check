import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const ExternalEvent = () => {

    const exevents = [
  {
    id: 1,
    title: "งานวิ่งการกุศลประจำปี",
    date: "2 พฤศจิกายน 2025",
    location: "สวนสาธารณะเมือง",
  },
  {
    id: 2,
    title: "สัมมนาเทรนด์ธุรกิจปี 2025",
    date: "8 พฤศจิกายน 2025",
    location: "โรงแรม Grand Palace",
  },
  {
    id: 3,
    title: "กิจกรรม CSR ร่วมกับชุมชน",
    date: "12 พฤศจิกายน 2025",
    location: "โรงเรียนบ้านหนองบัว",
  },
  {
    id: 4,
    title: "ประชุมผู้ถือหุ้นประจำปี",
    date: "18 พฤศจิกายน 2025",
    location: "โรงแรม The Plaza",
  },
  {
    id: 5,
    title: "อบรมเทคนิคการตลาดดิจิทัล",
    date: "22 พฤศจิกายน 2025",
    location: "ศูนย์ฝึกอบรม AIA Tower",
  },
  {
    id: 6,
    title: "งานแสดงสินค้าและนวัตกรรม",
    date: "27 พฤศจิกายน 2025",
    location: "ศูนย์ประชุมแห่งชาติสิริกิติ์",
  },
  {
    id: 7,
    title: "ทริป Team Building กลางแจ้ง",
    date: "3 ธันวาคม 2025",
    location: "เขาใหญ่ รีสอร์ท",
  },
  {
    id: 8,
    title: "Workshop การพัฒนาทักษะผู้นำ",
    date: "6 ธันวาคม 2025",
    location: "โรงแรม Bangkok Marriott",
  },
  {
    id: 9,
    title: "งานเทศกาลอาหารและวัฒนธรรม",
    date: "12 ธันวาคม 2025",
    location: "ตลาดนัดกลางแจ้ง เซ็นทรัลเวิลด์",
  },
  {
    id: 10,
    title: "งานเลี้ยงสังสรรค์ปีใหม่บริษัท",
    date: "20 ธันวาคม 2025",
    location: "โรงแรม The St. Regis Bangkok",
  },
]


    return (
        <div className='app-container'>

            {/* หัวข้อ + icon */}
            <div className="d-flex justify-content-between text-white mt-16">
                
                {/* variant เป็น link = ปุ่มไม่มีพื้นหลัง แล้วก็ลบ padding ออก */}
                <Link to="/event" className='text-decoration-none'>                
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                
                <h3 className="text-center fw-bold">Corporate <br /> internal event</h3>
                {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
                <div className="me-4"></div>
            </div>


            {/* หัวข้อ + กล่องงาน event */}
            <div className="mt-3 p-3">

                {exevents.map((exevent) => (
                    <Card key={exevent.id} className="mb-3 rounded-3 text-black
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{backgroundColor: '#D9D9D9'}}>
                  {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                    duration-200 = ความเร็ว 0.2 s 
                    ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}
                    
                        <Card.Body>
                            <Card.Title><b>{exevent.title}</b></Card.Title>
                            <Card.Text>
                                วันที่: {exevent.date} <br />
                                สถานที่: {exevent.location}
                            </Card.Text>
                            <Link to="/exregister" className='text-decoration-none'>                            
                              <Button className='text-white fw-semibold' style={{backgroundColor: '#636CCB', border: 'none'}}>REGISTER</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ExternalEvent