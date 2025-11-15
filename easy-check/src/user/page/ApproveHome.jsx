import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ApproveHome = () => {
    return (

        <div className="p-4">
            
            <Link to="/" className='text-decoration-none'>            
                <div className="mt-2 mb-4 mr-2 text-end rounded-circle">
                    <Button size='sm' className='rounded-circle'
                    style={{backgroundColor: '#636CCB', border: 'none'}}>
                        <i className="bi bi-bell-fill text-black"></i>
                    </Button>
                </div>
            </Link>

            <div className="grid grid-cols-2 gap-4 mt-12">


                <Link to="/" className='text-decoration-none'>    
                {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                  duration-200 = ความเร็ว 0.2 s 
                  ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}

                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)'}}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        CHECK APPROVE
                    </div>
                </Link>


                <Link to="/" className='text-decoration-none'>                
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)'}}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        DELEGATE APPROVE
                    </div>
                </Link>


                <Link to="/" className='text-decoration-none'>                
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)'}}>
                        <i className="bi bi-file-earmark-fill fs-2"></i> <br />
                        LEAVE APPROVE
                    </div>
                </Link>

                {/* text-decoration-none เอาไว้ลบเส้นใต้ลิ้งจะได้สวยเริ่ด จึ้ง โบ้ะ */}
                <Link to="/" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                    style={{background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)'}}>
                        <i className="bi bi-calendar-range-fill fs-2"></i> <br />
                        STATUS
                        <br />
                        &nbsp;
                    </div>
                </Link>

            </div>


        </div>
    )
}

export default ApproveHome