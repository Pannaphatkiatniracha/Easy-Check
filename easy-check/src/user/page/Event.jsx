import { Link } from "react-router-dom";

const Event = () => {

    return (

        <div className="app-container">

          {/* หัวข้อ */}
          <div className="text-center text-[#F26623] mt-16">
            <h2 className="fw-normal">Event</h2>
          </div>


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