import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const getStatusThai = (status) => {
  if (status === "late") return "สาย";
  if (status === "on_time" || status === "ontime") return "ตรงเวลา";
  if (status === "early") return "ออกก่อนเวลา";
  return "ปกติ";
};

function RequestApprove() {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [viewShift, setViewShift] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rejectReasonUser, setRejectReasonUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [savingShift, setSavingShift] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // ดึงข้อมูล User จาก LocalStorage เพื่อหาว่า Approver คนนี้อยู่สาขาอะไร
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const branchId = user?.branch_id || "";

      // ส่ง branch_id แนบไปกับ API ด้วย
      const [reqRes, usersRes, shiftRes] = await Promise.all([
        axios.get(`http://localhost:5000/attendance/pending?branch_id=${branchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/approver/users-with-shifts?branch_id=${branchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/approver/shifts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRequests(reqRes.data || []);
      setUsers(usersRes.data || []);
      setShifts(shiftRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item) => {
    await axios.put(
      `http://localhost:5000/attendance/${item.id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRequests((prev) => prev.filter((r) => r.id !== item.id));
  };

  const submitRejectReason = async () => {
    await axios.put(
      `http://localhost:5000/attendance/${rejectReasonUser.id}/reject`,
      { reason: rejectReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRequests((prev) => prev.filter((r) => r.id !== rejectReasonUser.id));
    setRejectReasonUser(null);
    setRejectReason("");
  };

  const handleAssignShift = async (userId, shiftId) => {
    setSavingShift(userId);
    try {
      const parsedShiftId = shiftId ? Number(shiftId) : null;

      await axios.post(
        "http://localhost:5000/approver/assign-shift",
        { userId, shiftId: parsedShiftId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, shift_id: parsedShiftId } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "กำหนดกะไม่สำเร็จ");
    } finally {
      setSavingShift(null);
    }
  };

  const renderRequest = (item) => {
    const statusThai = getStatusThai(item.status);

    return (
      <div
        key={item.id}
        className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4"
      >
        <img
          src={item.checkPhoto}
          alt="check"
          className="w-14 h-14 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="text-sm font-semibold">
            {item.name} ({item.type === "checkout" ? "เช็คเอาท์" : "เช็คอิน"})
          </div>

          <div className="text-xs">
            เวลา: {item.displayTime} - {statusThai}
          </div>

          {item.reason && (
            <div className="text-orange-500 text-xs">เหตุผล: {item.reason}</div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleApprove(item)}
              className="bg-green-500 text-white px-3 py-1 rounded-full text-xs"
            >
              อนุมัติ
            </button>

            <button
              onClick={() => setRejectReasonUser(item)}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-xs"
            >
              ไม่อนุมัติ
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderShift = (user) => {
    return (
      <div
        key={user.id}
        className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4"
      >
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {user.firstname} {user.lastname}
          </div>

          <div className="text-xs text-gray-500">{user.id_employee}</div>

          <select
            value={user.shift_id ? String(user.shift_id) : ""}
            onChange={(e) => handleAssignShift(user.id, e.target.value)}
            className="mt-2 w-full border rounded p-1 text-xs"
            disabled={savingShift === user.id}
          >
            <option value="">เลือกกะ</option>
            {shifts.map((s) => (
              <option key={s.shift_id} value={String(s.shift_id)}>
                {String(s.start_time).slice(0, 5)} - {String(s.end_time).slice(0, 5)}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container min-h-screen bg-[#3C467B] p-4 flex flex-col items-center">
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <Link to="/home">
          <Button variant="link">
            <i className="bi bi-chevron-left text-white"></i>
          </Button>
        </Link>

        <h1 className="text-white text-xl font-bold flex-1 text-center">
          คำขอพิเศษ
        </h1>

        <div className="w-8" />
      </div>

      <div className="flex gap-2 mb-4 w-full max-w-md">
        <button
          onClick={() => setViewShift(false)}
          className={`w-1/2 py-2 rounded-full ${
            !viewShift ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          คำขอพิเศษ
        </button>

        <button
          onClick={() => setViewShift(true)}
          className={`w-1/2 py-2 rounded-full ${
            viewShift ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          จัดการกะ
        </button>
      </div>

      <div className="w-full max-w-md space-y-3">
        {loading ? (
          <div className="text-white text-center">กำลังโหลด...</div>
        ) : viewShift ? (
          users.map((u) => renderShift(u))
        ) : (
          requests.map((r) => renderRequest(r))
        )}
      </div>

      {rejectReasonUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-4 rounded-xl w-64">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border p-2"
              placeholder="เหตุผลที่ไม่อนุมัติ..."
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={submitRejectReason}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ยืนยัน
              </button>

              <button
                onClick={() => setRejectReasonUser(null)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestApprove;