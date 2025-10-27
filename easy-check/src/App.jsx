import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./user/page/login";
import AppLayout from "./user/layouts/AppLayou";
import AppNobar from "./user/layouts/AppNobar";
import NotFound from "./user/page/NotFound";
import Profile from "./user/page/Profile";
import Event from "./user/page/Event";
import Setting from "./user/page/Setting";
import Home from "./user/page/Home";
import LeaveRequest from "./user/page/LeaveRequest";





function App() {
  return (
    
    <>
      
      <BrowserRouter basename="/easycheck/">
      <Routes>

        <Route path="/" element={<AppLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<Home />} />
          <Route path="event" element={<Event />} />
          <Route path="setting" element={<Setting />} />
          <Route path="leaverequest" element={<LeaveRequest />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/" element={<AppNobar />}>

        </Route>

      </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;