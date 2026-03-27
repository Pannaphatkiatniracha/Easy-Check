import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/leave-approve"; // ✅ แก้ตรงนี้ครั้งเดียวจบ

function LeaveRequestApprove() {
  const [requests, setRequests] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ โหลดข้อมูล pending
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/pending`); // ✅ FIX แล้ว
        setRequests(res.data);
      } catch (error) {
        console.error("Error loading leave requests:", error);
        alert("ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบว่า Backend ทำงานอยู่หรือไม่");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ อนุมัติ
  const handleApprove = async (req) => {
    try {
      await axios.put(`${API}/${req.id}/approve`); // ✅ FIX แล้ว

      setApproved((prev) => [...prev, req]);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (error) {
      console.error("Error approving:", error);
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  // ✅ ไม่อนุมัติ
  const handleReject = async (req) => {
    const reason = window.prompt(`ระบุเหตุผลที่ไม่อนุมัติการลาของ ${req.name}:`, "ไม่ระบุ");
    if (reason === null) return;

    try {
      await axios.put(`${API}/${req.id}/reject`, { reason }); // ✅ FIX แล้ว

      setRejected((prev) => [...prev, { ...req, rejectReason: reason }]);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธคำขอ");
    }
  };

  return (
    <div className="app-container min-h-screen bg-[#3C467B] p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link to="/home" className="text-white text-2xl">
          <i className="bi bi-chevron-left"></i>
        </Link>
        <h1 className="text-white text-xl font-bold text-center flex-1">
          LEAVE APPROVE
        </h1>
        <div className="w-8" />
      </div>

      <div className="max-w-md w-full space-y-5">
        {loading && <div className="text-white text-center">กำลังโหลดข้อมูล...</div>}

        {!loading && requests.length === 0 && (
          <div className="text-white/70 text-center">
            ไม่มีคำขอลางานที่รออนุมัติ
          </div>
        )}

        {requests.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-2xl shadow flex gap-3">
            <img
              src={req.profile || `https://ui-avatars.com/api/?name=${req.name}`}
              alt={req.name}
              className="w-14 h-14 rounded-full"
            />

            <div className="flex-1">
              <div className="font-semibold">{req.name}</div>
              <div className="text-xs text-gray-500">ID: {req.employeeId}</div>

              <div className="text-xs mt-1">
                {req.reasons?.includes("Other")
                  ? `Other: ${req.otherReason}`
                  : req.reasons?.join(", ")}
              </div>

              <div className="text-xs">
                {new Date(req.leaveStart).toLocaleDateString("th-TH")} →
                {new Date(req.leaveEnd).toLocaleDateString("th-TH")}
              </div>

              {req.evidencePreview && (
                <button
                  onClick={() => setSelectedEvidence(req.evidencePreview)}
                  className="text-blue-500 text-xs underline"
                >
                  ดูรูปแนบ
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleApprove(req)}
                className="px-2 py-1 bg-green-400 rounded text-xs"
              >
                อนุมัติ
              </button>

              <button
                onClick={() => handleReject(req)}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs"
              >
                ไม่อนุมัติ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* popup รูป */}
      {selectedEvidence && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={() => setSelectedEvidence(null)}
        >
          <img src={selectedEvidence} alt="evidence" className="max-w-lg" />
        </div>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <div className="mt-6 text-green-300">
          อนุมัติแล้ว {approved.length} รายการ
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <div className="mt-2 text-red-300">
          ไม่อนุมัติ {rejected.length} รายการ
        </div>
      )}
    </div>
  );
}

export default LeaveRequestApprove;