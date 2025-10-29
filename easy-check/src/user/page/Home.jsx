import './User.css'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="app-container p-4">
            
            <Link to="/" className='text-decoration-none'>            
                <div className="mb-4 text-end rounded-circle">
                    <Button size='sm' variant='warning' className='rounded-circle'>
                        <i className="bi bi-bell-fill"></i>
                    </Button>
                </div>
            </Link>

            <div className="text-white grid grid-cols-2 gap-4">

                {/* ลบเส้น border ออกเพราะใส่สีแล้วไม่สวย */}
                <Link to="/checkin" className='text-decoration-none'>                
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark"
                    style={{background: 'linear-gradient(to bottom, #FFFF00, #ffffffff)'}}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        CHECK IN
                    </div>
                </Link>

                <Link to="/checkout" className='text-decoration-none'>               
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark"
                    style={{background: 'linear-gradient(to bottom, #FFFF00, #ffffffff )'}}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        CHECK OUT
                    </div>
                </Link>

                <Link to="/delegatecheckin" className='text-decoration-none'>                
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark"
                    style={{background: 'linear-gradient(to bottom, #FFFF00, #ffffffff)'}}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        DELEGATE CHECK-IN
                    </div>
                </Link>

                <Link to="/event" className='text-decoration-none'>              
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark"
                    style={{background: 'linear-gradient(to bottom, #FFFF00, #ffffffff)'}}>
                        <i className="bi bi-calendar2-event-fill fs-2"></i> <br />
                        EVENT
                    </div>
                </Link>

                <Link to="/leaverequest" className='text-decoration-none'>                
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark"
                    style={{background: 'linear-gradient(to bottom, #FFFF00, #ffffffff)'}}>
                        <i className="bi bi-file-earmark-fill fs-2"></i> <br />
                        LEAVE REQUEST
                    </div>
                </Link>

                {/* text-decoration-none เอาไว้ลบเส้นใต้ลิ้งจะได้สวยเริ่ด จึ้ง โบ้ะ */}
                <Link to="/support" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark"
                    style={{background: 'linear-gradient(to bottom, #FFFF00, #ffffffff)'}}>
                        <i className="bi bi-question-octagon-fill fs-2"></i> <br />
                        SUPPORT
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Home