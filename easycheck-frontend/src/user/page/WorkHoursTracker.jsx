import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Api from '../../Api';

const WorkHoursTable = ({ role }) => {
    const location = useLocation()
    const employeeData = location.state?.employeeData

    const [userProfile, setUserProfile] = useState({
        name: "",
        userid: "",
        avatar: ""
    })

    const profileData = {
        name: employeeData?.name || userProfile.name,
        userid: employeeData?.employeeId || userProfile.userid,
        avatar: employeeData?.profile || userProfile.avatar
    }

    const [timelineData, setTimelineData] = useState([])

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await Api.get('/users/profile')
                const data = response.data

                const avatarPath = data.avatar
                    ? (data.avatar.startsWith('http')
                        ? data.avatar
                        : `${Api.defaults.baseURL}/uploads/avatars/${data.avatar}`)
                    : "/easycheck/img/an.jpg"

                setUserProfile({
                    name: `${data.firstname} ${data.lastname}`,
                    userid: data.id_employee || "",
                    avatar: avatarPath
                })
            }
            catch (error) {
                console.error("Error loading profile:", error.response?.data?.message || error.message)
            }
        }

        loadUserProfile()
    }, [])

    useEffect(() => {
        const fetchTimeline = async () => {
            const id = employeeData?.employeeId || userProfile.userid
            if (!id) return

            try {
                const res = await Api.get(`/attendance/timeline?userId=${id}`)
                
                // 🔥 ตัด Saturday / Sunday ออกตรงนี้เลย
                const filtered = res.data.filter(item => {
                    const day = new Date(item.date).getDay()
                    return day !== 0 && day !== 6
                })

                setTimelineData(filtered)
            } catch (err) {
                console.error("Error fetching timeline:", err.response?.data?.message || err.message)
            }
        }

        fetchTimeline()
    }, [employeeData?.employeeId, userProfile.userid])

    return (
        <div className="app-container">

            {/* Header */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to={role === "approver" ? "/datatocheck" : "/home"} className='text-decoration-none'>
                    <Button variant="link" className="p-0">
                        <i className="bi bi-chevron-left ms-3 text-white"></i>
                    </Button>
                </Link>
                <h3 className="fw-bold">Work Hours Tracker</h3>
                <div className="me-4"></div>
            </div>

            {/* Profile */}
            <div className='d-flex justify-content-center mt-6'>
                <div className="flex flex-col items-center w-80">
                    <img
                        src={profileData.avatar}
                        alt="profile"
                        className="w-28 h-28 rounded-full object-cover mb-3"
                    />
                    <div className="text-white font-semibold fs-5 text-center">
                        {profileData.name}
                    </div>
                    <div className="text-sm text-white text-center">
                        ID: {profileData.userid}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className='d-flex justify-content-center mt-8 mb-10'>
                <div className="w-80 space-y-4">

                    {timelineData.map((item, index) => (
                        <div key={index}
                            className="bg-white rounded-3 p-3 shadow-md flex justify-between items-center">

                            <div>
                                <div className="fw-bold text-dark">
                                    {item.date}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {item.day}
                                </div>
                            </div>

                            <div className="text-end">
                                <div className="text-sm">
                                    <span className="fw-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                                        IN:
                                    </span>{" "}
                                    {item.check_in || "-"}
                                </div>
                                <div className="text-sm">
                                    <span className="fw-bold bg-gradient-to-r from-red-400 to-pink-600 text-transparent bg-clip-text">
                                        OUT:
                                    </span>{" "}
                                    {item.check_out || "-"}
                                </div>
                            </div>

                        </div>
                    ))}

                    {timelineData.length === 0 && (
                        <div className="text-center text-white mt-4">
                            ไม่มีข้อมูล
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}

export default WorkHoursTable