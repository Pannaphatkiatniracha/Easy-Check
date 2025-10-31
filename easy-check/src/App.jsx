import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Register from "./user/page/Register";
import CheckOut from "./user/page/CheckOut";
import DelegateCheckin from "./user/page/DelegateCheckin";
import Support from "./user/page/Support";
import ForgotPassword from "./user/page/ForgotPassword";
import ChangePassword from "./user/page/ChangePassword";





function App() {
  return (
    
    <>
      
      <BrowserRouter basename="/easycheck/">
      <Routes>

        <Route path="/" element={<AppLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<Home />} />
          <Route path="event" element={<Event />} />
          <Route path="setting" element={<Setting />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/" element={<AppNobar />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="leaverequest" element={<LeaveRequest />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="delegatecheckin" element={<DelegateCheckin />} />
          <Route path="support" element={<Support />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="changepassword" element={<ChangePassword />} />
        </Route>

      </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;