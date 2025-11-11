import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import CheckInForFriend from "./user/page/CheckInForFriend";
import PrivacyPolicy from "./user/page/PrivacyPolicy";
import { useState } from "react";





function App() {

  const [token, setToken] = useState("x")
  const [role, setRole] = useState("")


  return (

    <>

      <BrowserRouter basename="/easycheck/">
        <Routes>

          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />

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
                setToken={setToken} />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route element={<AppNobar />}>
                <Route path="profile" element={<Profile />} />
                <Route path="inregister" element={<InRegister />} />
                <Route path="exregister" element={<ExRegister />} />
                <Route path="leaverequest" element={<LeaveRequest />} />
                <Route path="checkin" element={<CheckIn />} />
                <Route path="delegatecheckin" element={<DelegateCheckin />} />
                <Route path="support" element={<Support />} />
                <Route path="forgotpassword" element={<ForgotPassword />} />
                <Route path="changepassword" element={<ChangePassword />} />
                <Route path="internalevent" element={<InternalEvent />} />
                <Route path="externalevent" element={<ExternalEvent />} />
                <Route path="checkinforfriend" element={<CheckInForFriend />} />
                <Route path="privacypolicy" element={<PrivacyPolicy />} />
              </Route>
            </>
          )}
        </Routes>
      </BrowserRouter>

      {/* <BrowserRouter basename="/easycheck/">
      <Routes >

        <Route element={<AppLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<Home />} />
          <Route path="event" element={<Event />} />
          <Route path="setting" element={<Setting />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AppNobar />}>
          <Route path="login" element={<Login />} />
          <Route path="inregister" element={<InRegister />} />
          <Route path="exregister" element={<ExRegister />} />
          <Route path="leaverequest" element={<LeaveRequest />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="delegatecheckin" element={<DelegateCheckin />} />
          <Route path="support" element={<Support />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="internalevent" element={<InternalEvent />} />
          <Route path="externalevent" element={<ExternalEvent />} />
          <Route path="checkinforfriend" element={<CheckInForFriend />} />
          <Route path="privacypolicy" element={<PrivacyPolicy />} />
        </Route>

      </Routes>
      </BrowserRouter> */}

    </>
  );
}

export default App;