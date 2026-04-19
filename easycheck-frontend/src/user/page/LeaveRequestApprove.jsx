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
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
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
    const confirmMsg = `ยืนยันการ "อนุมัติ" วันลาของ ${req.name} (${req.leaveDays} วัน) ใช่หรือไม่?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.put(
        `${API}/${req.id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
          },
        },
      );

      alert("อนุมัติการลาสำเร็จ");
      setRequests((prev) => prev.filter((item) => item.id !== req.id));
    } catch (error) {
      console.error("Error approving:", error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (req) => {
    const reason = window.prompt(
      `ระบุเหตุผลที่ไม่อนุมัติการลาของ ${req.name} (จำเป็นต้องระบุ):`,
      "",
    );

    if (reason === null) return;
    if (reason.trim() === "") {
      alert("กรุณาระบุเหตุผลในการไม่อนุมัติ เพื่อแจ้งให้พนักงานทราบครับ");
      return;
    }

    try {
      await axios.put(
        `${API}/${req.id}/reject`,
        { reason: reason.trim() },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
          },
        },
      );

      alert("ปฏิเสธคำขอลาสำเร็จ");
      setRequests((prev) => prev.filter((item) => item.id !== req.id));
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
          LEAVE APPROVALS
        </h1>
        <div className="w-8" />
      </div>

      <div className="max-w-md w-full space-y-5 pb-10">
        {loading && (
          <div className="text-white text-center flex justify-center items-center gap-2">
            <i className="bi bi-arrow-repeat animate-spin"></i>{" "}
            กำลังโหลดข้อมูล...
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="bg-white/10 rounded-xl p-8 border border-white/20 flex flex-col items-center">
            <i className="bi bi-inbox text-5xl text-white/50 mb-3"></i>
            <div className="text-white text-center">
              ไม่มีคำขอลางานที่รออนุมัติ
            </div>
          </div>
        )}

        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={
                  req.profile ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=636CCB&color=fff`
                }
                alt={req.name}
                className="w-16 h-16 rounded-full object-cover shadow-sm border border-gray-200"
              />
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-lg">{req.name}</div>
                <div className="text-sm text-gray-500 font-medium">
                  รหัส: {req.employeeId}
                </div>
                {req.department && (
                  <div className="text-xs text-[#636CCB] font-semibold mt-1 bg-blue-50 w-fit px-2 py-1 rounded">
                    {req.department} {req.position ? ` • ${req.position}` : ""}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="text-gray-500">ประเภทการลา</span>
                <span className="font-semibold text-[#3C467B]">
                  {req.reasons?.includes("Other")
                    ? `Other: ${req.otherReason || "-"}`
                    : req.reasons?.join(", ")}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="text-gray-500">ช่วงวันที่ลา</span>
                <span className="font-medium">
                  {new Date(req.leaveStart).toLocaleDateString("th-TH")} →{" "}
                  {new Date(req.leaveEnd).toLocaleDateString("th-TH")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">จำนวนวันลาหักวันหยุด</span>
                <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                  {req.leaveDays} วัน
                </span>
              </div>

              {req.hasEvidence && (
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-gray-500 text-xs">เอกสารแนบ:</span>
                  {req.evidencePreview ? (
                    <button
                      onClick={() => setSelectedEvidence(req.evidencePreview)}
                      className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <i className="bi bi-image"></i> ดูรูปแนบ
                    </button>
                  ) : (
                    <span className="text-gray-600 text-xs flex items-center gap-1">
                      <i className="bi bi-file-earmark-pdf"></i> แนบไฟล์ (
                      {req.evidenceMime || "pdf"})
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-1">
              <button
                onClick={() => handleReject(req)}
                className="flex-1 py-2 bg-white border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors"
              >
                ไม่อนุมัติ
              </button>
              <button
                onClick={() => handleApprove(req)}
                className="flex-1 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-md transition-colors"
              >
                อนุมัติ
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvidence && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedEvidence(null)}
        >
          <div className="relative">
            <button
              className="absolute -top-4 -right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold"
              onClick={() => setSelectedEvidence(null)}
            >
              ✕
            </button>
            <img
              src={selectedEvidence}
              alt="evidence"
              className="max-w-full md:max-w-lg max-h-[80vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequestApprove;