import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Api from '../../Api'

const WorkHoursTracker = ({ role }) => {
    const location = useLocation()
    const employeeData = location.state?.employeeData

    const [userProfile, setUserProfile] = useState({
        name: "",
        userid: "",
        avatar: ""
    })

    const [timeline, setTimeline] = useState([])

    const profileData = {
        name: employeeData?.name || userProfile.name,
        userid: employeeData?.employeeId || userProfile.userid,
        avatar: employeeData?.profile || userProfile.avatar
    }

    useEffect(() => {
        const loadUserProfile = async () => {
            if (employeeData) return

            try {
                const res = await Api.get('/users/profile')
                const data = res.data

                const avatarPath = data.avatar
                    ? (data.avatar.startsWith('http')
                        ? data.avatar
                        : `${Api.defaults.baseURL}/uploads/avatars/${data.avatar}`)
                    : "/easycheck/img/an.jpg"

                setUserProfile({
                    name: `${data.firstname} ${data.lastname}`,
                    userid: data.id_employee,
                    avatar: avatarPath
                })
            } catch (err) {
                console.error(err)
            }
        }

        loadUserProfile()
    }, [employeeData])

    useEffect(() => {
        const fetchTimeline = async () => {
            const id = employeeData?.employeeId || userProfile.userid
            if (!id) return

            try {
                const res = await Api.get(`/attendance/weekly-timeline?userId=${id}`)
                setTimeline(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchTimeline()
    }, [employeeData?.employeeId, userProfile.userid])

    const formatTime = (time) => {
        if (!time) return "-"
        return new Date(time).toLocaleTimeString("th-TH", {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="app-container">

            {/* Header */}
            <div className="d-flex justify-content-between text-white mt-16">
                <Link to={role === "approver" ? "/datatocheck" : "/home"} className='text-decoration-none'>
                    <i className="bi bi-chevron-left ms-3 text-white"></i>
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
            <div className="d-flex justify-content-center mt-8 mb-12">
                <div className="w-80 flex flex-col gap-4">

                    {timeline.length === 0 && (
                        <div className="text-center text-gray-300">
                            No data this week
                        </div>
                    )}

                    {timeline.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start">

                            {/* timeline line */}
                            <div className="flex flex-col items-center mt-1">
                                <div className="w-3 h-3 bg-[#6D29F6] rounded-full"></div>
                                {index !== timeline.length - 1 && (
                                    <div className="w-[2px] h-full bg-gray-400 opacity-40"></div>
                                )}
                            </div>

                            {/* card ขาว */}
                            <div className="flex-1 rounded-xl px-4 py-3 bg-white shadow-md">

                                {/* day */}
                                <div className="font-semibold text-gray-800 mb-2">
                                    {item.day}
                                </div>

                                {/* times */}
                                <div className="flex justify-between items-center text-sm">

                                    {/* IN */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-2 py-[2px] rounded-full text-white"
                                            style={{
                                                background: 'linear-gradient(to right, #34d399, #059669)'
                                            }}>
                                            IN
                                        </span>
                                        <span className="text-gray-800 font-medium">
                                            {formatTime(item.check_in)}
                                        </span>
                                    </div>

                                    {/* OUT */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-2 py-[2px] rounded-full text-white"
                                            style={{
                                                background: 'linear-gradient(to right, #60a5fa, #2563eb)'
                                            }}>
                                            OUT
                                        </span>
                                        <span className="text-gray-800 font-medium">
                                            {formatTime(item.check_out)}
                                        </span>
                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    )
}

export default WorkHoursTracker