import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const Home = ({ role }) => {

    // component ของ Approver
    const ApprovePage = (

        <div className="p-4">

            {/* <Link to="/" className='text-decoration-none'> */}
            <div className="mt-2 mb-4 mr-2 text-end rounded-circle">
                <Button size='sm' className='rounded-circle'
                    style={{ backgroundColor: '#636CCB', border: 'none' }}>
                    <i className="bi bi-bell-fill text-black"></i>
                </Button>
            </div>
            {/* </Link> */}

            <div className="grid grid-cols-2 gap-4 mt-12">


                <Link to="/checkapprove" className='text-decoration-none'>
                    {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                  duration-200 = ความเร็ว 0.2 s 
                  ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}

                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        CHECK APPROVE
                    </div>
                </Link>


                {/* <Link to="/" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        DELEGATE APPROVE
                    </div>
                </Link> */}


                <Link to="/leaveRequestApprove" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-file-earmark-fill fs-2"></i> <br />
                        LEAVE APPROVE
                    </div>
                </Link>

                {/* text-decoration-none เอาไว้ลบเส้นใต้ลิ้งจะได้สวยเริ่ด จึ้ง โบ้ะ */}
                <Link to="/datacheck" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-calendar2-week-fill fs-2"></i> <br />
                        ATTENDANCE SUMMARY
                    </div>
                </Link>



<<<<<<< HEAD
                <Link to="/datatocheck" className='text-decoration-none'>
=======
                <Link to="/datacheck" className='text-decoration-none'>
>>>>>>> d46f83624e1f5b5c79dd5e52eb6e8e7cbaf9a63a
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-hourglass-bottom fs-2"></i> <br />
                        WORKHOURS <br /> TRACKER
                    </div>
                </Link>

            </div>


        </div>
    )



    // component ของ User ทั่วไป
    const Userpage = (

        <div className="p-4">

            {/* <Link to="/" className='text-decoration-none'> */}
            <div className="mt-2 mb-4 mr-2 text-end rounded-circle">
                <Button size='sm' className='rounded-circle'
                    style={{ backgroundColor: '#636CCB', border: 'none' }}>
                    <i className="bi bi-bell-fill text-black"></i>
                </Button>
            </div>
            {/* </Link> */}

            <div className="grid grid-cols-2 gap-4 mt-12">


                <Link to="/checkin" className='text-decoration-none'>
                    {/* hover:scale-105 = hover แล้วขยายฉ่ำๆ 105%
                  duration-200 = ความเร็ว 0.2 s 
                  ease-in-out ก็ให้ตอนเปลี่ยนมันสมูท*/}

                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        CHECK IN <br /> CHECK OUT
                    </div>
                </Link>


                <Link to="/delegatecheckin" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-calendar-check-fill fs-2"></i> <br />
                        DELEGATE CHECK-IN
                    </div>
                </Link>


                <Link to="/leaverequest" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-file-earmark-fill fs-2"></i> <br />
                        LEAVE REQUEST
                    </div>
                </Link>

                {/* text-decoration-none เอาไว้ลบเส้นใต้ลิ้งจะได้สวยเริ่ด จึ้ง โบ้ะ */}
                <Link to="/support" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-question-octagon-fill fs-2"></i> <br />
                        SUPPORT
                        <br />
                        &nbsp;
                    </div>
                </Link>


                <Link to="/attendancesummary" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-calendar2-week-fill fs-2"></i> <br />
                        ATTENDANCE SUMMARY
                    </div>
                </Link>



                <Link to="/workhourstracker" className='text-decoration-none'>
                    <div className="p-4 text-center fw-semibold rounded-3 text-dark
                    hover:scale-105 transition-all duration-200 ease-in-out"
                        style={{ background: 'linear-gradient(to bottom, #D9D9D9, #636CCB)' }}>
                        <i className="bi bi-hourglass-bottom fs-2"></i> <br />
                        WORKHOURS <br /> TRACKER
                    </div>
                </Link>

            </div>


        </div>
    )


    //  ถ้า user ที่ login เข้ามาเป็น role approver ให้แสดงหน้า ApprovePage ถ้าไม่ใช่ค่อยให้แสดงหน้า Userpage
    return role === "approver" ? ApprovePage : Userpage


}

export default Home