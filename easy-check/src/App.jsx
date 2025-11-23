import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./user/page/Login";
import AppLayout from "./user/layouts/AppLayout";
import AppNobar from "./user/layouts/AppNobar";
import NotFound from "./user/page/NotFound";
import Profile from "./user/page/Profile";
import Event from "./user/page/Event";
import Setting from "./user/page/Setting";
import Home from "./user/page/Home";
import LeaveRequest from "./user/page/LeaveRequest";
import CheckIn from "./user/page/CheckIn";
import InRegister from "./user/page/InRegister";
import DelegateCheckin from "./user/page/DelegateCheckin";
import Support from "./user/page/Support";
import ForgotPassword from "./user/page/ForgotPassword";
import ChangePassword from "./user/page/ChangePassword";
import InternalEvent from "./user/page/InternalEvent";
import ExternalEvent from "./user/page/ExternalEvent";
import ExRegister from "./user/page/ExRegister";
import AttendanceSum from "./user/page/AttendanceSum";
import PrivacyPolicy from "./user/page/PrivacyPolicy";
import WorkHoursTracker from "./user/page/WorkHoursTracker";
import CheckApporve from "./user/page/CheckApprove";
import ApproveProfile from "./user/page/ApproveProfile";
import LeaveRequestApprove from "./user/page/LeaveRequestApprove";
import DataCheck from "./user/page/DataCheck";
import Settings from "./Admin/Settings";
import CreateEvent from "./Admin/CreateEvent";
import AdminPrivacyPolicy from "./Admin/AdminPrivacyPolicy";
import AccessControl from "./Admin/AccessControl";
import ShiftSchedule from "./Admin/ShiftSchedule";







function App() {

  // () => ... คือเป็นการบอกว่าให้ useState เรียกใช้ฟังก์ชันนี้ตอนเริ่มต้นเท่านั้น
  // เพื่อป้องกันไม่ให้ localStorage.getItem("token") ถูกเรียกใช้ทุกครั้งที่มีการ re-render แบบฟีลฟังก์ชันขี้เกียจเรียกรอบแรกรอบเดียวพอ แล้วก็จะไม่หาย

  const [token, setToken] = useState(() => localStorage.getItem("token") || "")      // ตอนโหลดเว็บครั้งแรก react จะเรียก () => localStorage.getItem("token") || ""  ถ้าเจอ token ก็ค่อยเก็บค่า token ใน state ถ้าไม่เจอ token → เก็บค่าว่าง "" ใน state เพื่อไม่ให้เป็น undefind
  const [role, setRole] = useState(() => localStorage.getItem("role") || "")


  return (

    <>

      <BrowserRouter basename="/easycheck/">
        <Routes>

          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />

          {/* ถ้ายังไม่ได้ login จะกระโดดไปให้ login ก่อน และ replace เพื่อไม่ให้มี history ใน history stack เวลากด back จะได้ไม่งง  */}
          {!token && <Route path="*" element={<Navigate to="/login" replace />} />}

          {/* อันนี้คือกรณีมีการ login แล้วเลยเข้าได้ปกติ */}
          {token && (
            <>
              <Route element={<AppLayout />}>
                <Route path="home" element={<Home
                  role={role} />} />
                <Route path="event" element={<Event />} />
                <Route path="setting" element={<Setting
                  role={role} setToken={setToken} setRole={setRole} />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route element={<AppNobar />}>
                <Route path="userprofile" element={<Profile />} />
                <Route path="approveprofile" element={<ApproveProfile />} />
                <Route path="inregister" element={<InRegister />} />
                <Route path="exregister" element={<ExRegister />} />
                <Route path="leaverequest" element={<LeaveRequest />} />
                <Route path="checkin" element={<CheckIn />} />
                <Route path="delegateCheckin" element={<DelegateCheckin />} />
                <Route path="support" element={<Support />} />
                <Route path="changepassword" element={<ChangePassword />} />
                <Route path="internalevent" element={<InternalEvent />} />
                <Route path="externalevent" element={<ExternalEvent />} />
                <Route path="privacypolicy" element={<PrivacyPolicy />} />


                <Route path='settings' element={<Settings />} />
                <Route path='createevent' element={<CreateEvent />} />
                <Route path='adminprivacypolicy' element={<AdminPrivacyPolicy />} />
                <Route path='accesscontrol' element={<AccessControl />} />
                <Route path='shiftschedule' element={<ShiftSchedule />} />



                <Route path="attendancesummary" element={<AttendanceSum
                  role={role} />} />
                <Route path="workhourstracker" element={<WorkHoursTracker
                  role={role} />} />
                <Route path="checkapprove" element={<CheckApporve />} />
                <Route path="leaveRequestApprove" element={<LeaveRequestApprove />} />

                <Route path="datacheck" element={
                  role === "approver"
                    ? <DataCheck role={role} />
                    : <Navigate to="/home" replace />
                } />

              </Route>
            </>
          )}
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;