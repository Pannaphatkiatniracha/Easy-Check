import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

// 
const API = "http://localhost:5000/api/earlyleave";

// Reusable Card component
const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 text-gray-800 shadow-lg space-y-4">
    {title && <h2 className="text-lg font-bold text-[#3C467B]">{title}</h2>}
    {children}
  </div>
);

const Header = ({ title }) => (
  <div className="flex items-center justify-between py-6 px-4">
    <div className="w-8 flex justify-start">
      <Link to="/home" className="text-white text-2xl hover:text-gray-200 transition">
        <i className="bi bi-chevron-left"></i>
      </Link>
    </div>
    <h1 className="text-xl font-bold text-center flex-1 tracking-wide">{title}</h1>
    <div className="w-8"></div>
  </div>
);

function EarlyLeave() {
  const [tab, setTab] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึง ID ของ Approver ที่ล็อกอินอยู่จาก SessionStorage หรือ LocalStorage เพื่อใช้กรองสาขา
  const currentApproverId = sessionStorage.getItem("userId") || localStorage.getItem("userId"); 

  const fetchRequests = async () => {
    if (!currentApproverId) {
      console.error("No Approver ID found in storage.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // ส่ง approverId ไปให้ Backend เพื่อกรองเอาเฉพาะคำขอใน "สาขาเดียวกัน"
      const res = await axios.get(`${API}/requests?approverId=${currentApproverId}`);
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      alert("ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบระบบ Backend");
      setRequests([]); // เคลียร์ข้อมูลหากดึงไม่สำเร็จ
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentApproverId]);

  const handleApproval = async (reqId, empName, isApprove) => {
    const actionText = isApprove ? "อนุมัติ" : "ไม่อนุมัติ";
    if (!window.confirm(`คุณต้องการ ${actionText} คำขอออกก่อนเวลาของ ${empName} ใช่หรือไม่?`)) return;

    try {
      const status = isApprove ? "approved" : "rejected";
      // ส่งคำสั่งอัปเดตสถานะไปที่ Backend
      await axios.put(`${API}/${reqId}/status`, { status, approverId: currentApproverId });
      alert(`ดำเนินการ ${actionText} สำเร็จ!`);
      fetchRequests(); // โหลดข้อมูลใหม่จาก DB ทันที
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการทำรายการ");
    }
  };

  const pendingList = requests.filter(r => r.status === "pending");
  const historyList = requests.filter(r => r.status !== "pending");

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-xl mx-auto min-h-screen">
        <Header title="Early Leave Approval" />

        {/* Tabs */}
        <div className="flex gap-3 mb-6 px-2">
          {["pending", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition shadow-md ${
                tab === t
                  ? "bg-white text-[#3C467B] scale-105"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {t === "pending" ? (
                <>รออนุมัติ {pendingList.length > 0 && <span className="ml-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{pendingList.length}</span>}</>
              ) : "ประวัติ"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-white/80 flex justify-center items-center gap-2">
            <i className="bi bi-arrow-repeat animate-spin text-xl"></i> กำลังโหลดข้อมูลจากฐานข้อมูล...
          </div>
        ) : (
          <div className="px-2 pb-10">

            {tab === "pending" && (
              <div className="space-y-4">
                {pendingList.length === 0 ? (
                  <Card><div className="text-center py-6 text-gray-400">ไม่มีคำขอที่รออนุมัติ</div></Card>
                ) : (
                  pendingList.map((req) => (
                    <div key={req.id} className="bg-white rounded-xl p-4 shadow-md border-l-4 border-[#F59E0B] hover:shadow-lg transition">
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                        <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-lg flex-shrink-0">
                          {req.firstname?.charAt(0) || "-"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{req.firstname} {req.lastname}</p>
                          <p className="text-xs text-gray-400">รหัส: {req.id_employee} | สาขา: {req.branch_name}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between bg-gray-50 p-2 rounded-lg">
                          <span className="text-gray-500"><i className="bi bi-clock-history mr-1"></i> กะงานปกติ:</span>
                          <span className="font-semibold text-gray-700">{req.shift_start} - {req.shift_end} น.</span>
                        </div>
                        <div className="flex justify-between bg-red-50 p-2 rounded-lg">
                          <span className="text-red-500 font-semibold"><i className="bi bi-box-arrow-right mr-1"></i> ขอออกเวลา:</span>
                          <span className="font-bold text-red-600">{req.request_time} น.</span>
                        </div>
                        <div className="p-2">
                          <span className="text-gray-500 block text-xs mb-1">เหตุผล:</span>
                          <p className="text-gray-800 font-medium text-sm">{req.reason}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproval(req.id, req.firstname, false)}
                          className="flex-1 py-2 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition">
                          ไม่อนุมัติ
                        </button>
                        <button 
                          onClick={() => handleApproval(req.id, req.firstname, true)}
                          className="flex-1 py-2 bg-[#636CCB] text-white hover:bg-[#4E56A6] rounded-xl text-sm font-bold shadow-md transition">
                          อนุมัติ
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "history" && (
              <div className="space-y-4">
                {historyList.length === 0 ? (
                  <Card><div className="text-center py-6 text-gray-400">ไม่มีประวัติการอนุมัติ</div></Card>
                ) : (
                  historyList.map((req) => (
                    <div key={req.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 opacity-90 ${req.status === 'approved' ? 'border-green-500' : 'border-red-500'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{req.firstname} {req.lastname}</p>
                          <p className="text-xs text-gray-500 mt-1">ขอออก: <span className="font-semibold">{req.request_time} น.</span></p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {req.status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default EarlyLeave;