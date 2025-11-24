import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const ExternalEvent = () => {

  const exevents = [
    {
      id: 1,
      title: "งานวิ่งการกุศลประจำปี",
      date: "2 พฤศจิกายน 2025",
      time: "06:00 - 10:00",
      location: "สวนสาธารณะเมือง",
      icon: "bi-activity"
    },
    {
      id: 2,
      title: "สัมมนาเทรนด์ธุรกิจปี 2025",
      date: "8 พฤศจิกายน 2025",
      time: "09:00 - 17:00",
      location: "โรงแรม Grand Palace",
      icon: "bi-graph-up"
    },
    {
      id: 3,
      title: "กิจกรรม CSR ร่วมกับชุมชน",
      date: "12 พฤศจิกายน 2025",
      time: "08:30 - 15:30",
      location: "โรงเรียนบ้านหนองบัว",
      icon: "bi-heart"
    },
    {
      id: 4,
      title: "ประชุมผู้ถือหุ้นประจำปี",
      date: "18 พฤศจิกายน 2025",
      time: "13:00 - 16:30",
      location: "โรงแรม The Plaza",
      icon: "bi-people"
    },
    {
      id: 5,
      title: "อบรมเทคนิคการตลาดดิจิทัล",
      date: "22 พฤศจิกายน 2025",
      time: "10:00 - 16:00",
      location: "ศูนย์ฝึกอบรม AIA Tower",
      icon: "bi-laptop"
    },
    {
      id: 6,
      title: "งานแสดงสินค้าและนวัตกรรม",
      date: "27 พฤศจิกายน 2025",
      time: "10:00 - 18:00",
      location: "ศูนย์ประชุมแห่งชาติสิริกิติ์",
      icon: "bi-lightbulb"
    },
    {
      id: 7,
      title: "ทริป Team Building กลางแจ้ง",
      date: "3 ธันวาคม 2025",
      time: "07:00 - 19:00",
      location: "เขาใหญ่ รีสอร์ท",
      icon: "bi-tree"
    },
    {
      id: 8,
      title: "Workshop การพัฒนาทักษะผู้นำ",
      date: "6 ธันวาคม 2025",
      time: "09:30 - 16:30",
      location: "โรงแรม Bangkok Marriott",
      icon: "bi-award"
    },
    {
      id: 9,
      title: "งานเทศกาลอาหารและวัฒนธรรม",
      date: "12 ธันวาคม 2025",
      time: "16:00 - 22:00",
      location: "ตลาดนัดกลางแจ้ง เซ็นทรัลเวิลด์",
      icon: "bi-egg-fried"
    },
    {
      id: 10,
      title: "งานเลี้ยงสังสรรค์ปีใหม่บริษัท",
      date: "20 ธันวาคม 2025",
      time: "18:30 - 22:00",
      location: "โรงแรม The St. Regis Bangkok",
      icon: "bi-cup-straw"
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

        <h3 className="text-center fw-bold">Corporate <br /> External event</h3>
        {/* สร้างกล่องปลอมมาแล้วก็ใช้ margin end ช่วยให้เลเอ้ามันตรงกับดีไซน์ */}
        <div className="me-4"></div>
      </div>




      {/* หัวข้อ + กล่องงาน event */}
      <div className="mt-6 px-3">

        {exevents.map((exevent) => (
          <Card key={exevent.id} className="mb-3 rounded-3 text-black
                    hover:scale-105 transition-all duration-200 ease-in-out"
            style={{ backgroundColor: '#D9D9D9' }}>
            {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                    duration-200 = ความเร็ว 0.2 s 
                    ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}

            <Card.Body className="p-3">
              <div className="d-flex align-items-start">


                {/* icon  */}
                <div className="me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '45px', height: '45px', backgroundColor: 'white', opacity: 0.9 }}>

                  <i className={`bi ${exevent.icon} fs-5 text-[#6D29F6]`}></i>

                </div>


                {/* เนื้อหา */}
                <div className="flex-grow-1">


                  {/* ชื่ออีเว้น */}
                  <Card.Title className="h6 mb-2">
                    <b>{exevent.title}</b>
                  </Card.Title>


                  {/* รายละเอียดอีเว้น */}
                  <Card.Text className="small mb-2">
                    <i className="bi bi-calendar3 me-1"></i> วันที่: {exevent.date} <br />
                    <i className="bi bi-clock me-1"></i> เวลา: {exevent.time} <br />
                    <i className="bi bi-geo-alt me-1"></i> สถานที่: {exevent.location}
                  </Card.Text>


                  <Link to="/exregister" className='text-decoration-none'
                    // เป็นการส่งข้อมูล event ที่เลือกไปยังหน้า ExRegister ซึ่งคือการส่งข้อมูลผ่าน state ตรง link
                    state={{ selectedEvent: exevent.title }}>

                    <Button className='text-white mt-1 fw-semibold'
                      style={{ backgroundColor: '#636CCB', border: 'none', padding: '0.375rem 1.25rem', fontSize: '0.8rem', borderRadius: '20px' }}>
                      REGISTER
                    </Button>
                  </Link>

                </div>


              </div>
            </Card.Body>
          </Card>
        ))}
      </div>


    </div>
  )
}

export default ExternalEvent