import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/notifications";

const Home = ({ role }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const fetchUnread = async () => {
      try {
        const res = await axios.get(`${API}/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        console.error("โหลด unread count ไม่สำเร็จ:", err);
      }
    };

    // โหลดตัวเลขครั้งแรกตอนเปิดหน้า Home
    fetchUnread();

    // ── เปลี่ยนมาใช้ SSE รอรับอัปเดตแบบ Real-time แทน Polling ──
    const eventSource = new EventSource(`${API}/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // ถ้า Backend ส่งสัญญาณ triggerRefresh มา ให้ดึงตัวเลขใหม่ทันที
      if (data.triggerRefresh) {
        fetchUnread();
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error:", error);
      eventSource.close();
    };

    // ปิดการเชื่อมต่อเมื่อผู้ใช้ออกจากหน้านี้
    return () => {
      eventSource.close();
    };
  }, []);

  // ── Bell Button ใช้ร่วมกันทั้ง 2 role ──
  const BellButton = (
    <div className="mt-2 mb-4 mr-2 text-end">
      <Link to="/notification" className="position-relative d-inline-block">
        <Button
          size="sm"
          className="rounded-circle"
          style={{ backgroundColor: "#636CCB", border: "none" }}
        >
          <i className="bi bi-bell-fill text-black"></i>
        </Button>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem", minWidth: "18px" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>
    </div>
  );

  // component ของ Approver
  const ApprovePage = (
    <div className="p-4">
      {/* {BellButton} */}

      <div className="grid grid-cols-2 gap-4 mt-20">
        {/* <Link to="/requestapprove" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-calendar-check-fill fs-2"></i> <br />
            REQUEST APPROVE
          </div>
        </Link> */}

        <Link to="/leaveRequestApprove" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-file-earmark-fill fs-2"></i> <br />
            LEAVE APPROVE
          </div>
        </Link>

        {/* กล่องที่เพิ่มใหม่ เลือกกะงาน (Shift Selection) */}
        <Link to="/shiftselection" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-clock-fill fs-2"></i> <br />
            SHIFT SELECTION
          </div>
        </Link>

        {/* กล่องที่เพิ่มใหม่ ขอออกจากงานกรณีมีธุระ (Early Leave) */}
        <Link to="/earlyleave" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-box-arrow-right fs-2"></i> <br />
            EARLY LEAVE
          </div>
        </Link>
        {/* ---------------------------------------------------- */}

        {/* <Link to="/paymentrequest" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-file-earmark-text-fill fs-2"></i> <br />
            PAYMENT REQUEST
          </div>
        </Link> */}

        <Link to="/approvermanagement" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-people-fill fs-2"></i> <br />
            APPROVER MANAGEMENT
          </div>
        </Link>

        <Link to="/datacheck" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-calendar2-week-fill fs-2"></i> <br />
            ATTENDANCE SUMMARY
          </div>
        </Link>

        <Link to="/datatocheck" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-hourglass-bottom fs-2"></i> <br />
            WORKHOURS <br /> TRACKER
          </div>
        </Link>
      </div>
    </div>
  );

  // component ของ User ทั่วไป
  const Userpage = (
    <div className="p-4">
      {BellButton}

      <div className="grid grid-cols-2 gap-4 mt-12">
        <Link to="/checkin" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-calendar-check-fill fs-2"></i> <br />
            CHECK IN
            <br />
            &nbsp;
          </div>
        </Link>

        <Link to="/checkout" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-calendar-check-fill fs-2"></i> <br />
            CHECK OUT
            <br />
            &nbsp;
          </div>
        </Link>

        <Link to="/leaverequest" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-file-earmark-fill fs-2"></i> <br />
            LEAVE REQUEST
          </div>
        </Link>

        <Link to="/support" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-question-octagon-fill fs-2"></i> <br />
            SUPPORT
            <br />
            &nbsp;
          </div>
        </Link>

        <Link to="/attendancesummary" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-calendar2-week-fill fs-2"></i> <br />
            ATTENDANCE SUMMARY
          </div>
        </Link>

        <Link to="/workhourstracker" className="text-decoration-none">
          <div
            className="p-4 text-center fw-semibold rounded-3 text-dark
                        hover:scale-105 transition-all duration-200 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #D9D9D9, #636CCB)",
            }}
          >
            <i className="bi bi-hourglass-bottom fs-2"></i> <br />
            WORKHOURS <br /> TRACKER
          </div>
        </Link>
      </div>
    </div>
  );

  // ถ้า user ที่ login เข้ามาเป็น role approver ให้แสดงหน้า ApprovePage ถ้าไม่ใช่ค่อยให้แสดงหน้า Userpage
  return role === "approver" ? ApprovePage : Userpage;
};

export default Home;
