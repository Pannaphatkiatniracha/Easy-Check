import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/leave-approve";

function LeaveRequestApprove() {
  const [requests, setRequests] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      setRequests(res.data || []);
    } catch (error) {
      console.error("Error loading leave requests:", error);
      alert("ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบว่า Backend ทำงานอยู่หรือไม่");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (req) => {
    try {
      await axios.put(
        `${API}/${req.id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      alert("อนุมัติการลาสำเร็จ");
      loadData();
    } catch (error) {
      console.error("Error approving:", error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (req) => {
    const reason = window.prompt(
      `ระบุเหตุผลที่ไม่อนุมัติการลาของ ${req.name}:`,
      "ไม่ระบุ"
    );
    if (reason === null) return;

    try {
      await axios.put(
        `${API}/${req.id}/reject`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      alert("ปฏิเสธคำขอลาสำเร็จ");
      loadData();
    } catch (error) {
      console.error("Error rejecting:", error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการปฏิเสธคำขอ");
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
            ไม่มีคำขอลางานที่รอ approver อนุมัติ
          </div>
        )}

        {requests.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-2xl shadow flex gap-3">
            <img
              src={req.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}`}
              alt={req.name}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="font-semibold">{req.name}</div>
              <div className="text-xs text-gray-500">ID: {req.employeeId}</div>

              {req.department && (
                <div className="text-xs text-gray-500">
                  {req.department}
                  {req.position ? ` • ${req.position}` : ""}
                </div>
              )}

              <div className="text-xs mt-1">
                {req.reasons?.includes("Other")
                  ? `Other: ${req.otherReason || "-"}`
                  : req.reasons?.join(", ")}
              </div>

              <div className="text-xs mt-1">
                {new Date(req.leaveStart).toLocaleDateString("th-TH")} →{" "}
                {new Date(req.leaveEnd).toLocaleDateString("th-TH")}
              </div>

              <div className="text-xs mt-1">จำนวนวันลา: {req.leaveDays} วัน</div>

              {req.hasEvidence && req.evidencePreview && (
                <button
                  onClick={() => setSelectedEvidence(req.evidencePreview)}
                  className="text-blue-500 text-xs underline mt-1"
                >
                  ดูรูปแนบ
                </button>
              )}

              {req.hasEvidence && !req.evidencePreview && (
                <div className="text-xs text-gray-600 mt-1">
                  มีไฟล์แนบ ({req.evidenceMime || "unknown"})
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleApprove(req)}
                className="px-3 py-1 bg-green-500 text-white rounded text-xs"
              >
                อนุมัติ
              </button>

              <button
                onClick={() => handleReject(req)}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs"
              >
                ไม่อนุมัติ
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvidence && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvidence(null)}
        >
          <img
            src={selectedEvidence}
            alt="evidence"
            className="max-w-lg max-h-[80vh] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

export default LeaveRequestApprove;