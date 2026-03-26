import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // ❗ อย่าลืม import axios

function LeaveRequestApprove() {
  const [requests, setRequests] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลจริงจาก Backend (รายชื่อที่รออนุมัติ)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // เรียก API ไปที่ backend ของคุณ (แก้พอร์ต 5000 ให้ตรงกับเครื่องคุณถ้าจำเป็น)
        const res = await axios.get("http://localhost:5000/leave/pending");
        
        // ข้อมูลที่ได้จาก Backend จัดรูปแบบมาให้แล้ว เอาไปใช้ได้เลย
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

  // 2. ฟังก์ชันอนุมัติ (ยิง API ไปอัปเดต DB ด้วย)
  const handleApprove = async (req) => {
    try {
      await axios.put(`http://localhost:5000/leave/${req.id}/approve`);
      
      // อัปเดตหน้าจอเมื่อ Backend อัปเดตสำเร็จ
      setApproved([...approved, req]);
      setRequests(requests.filter((r) => r.id !== req.id));
    } catch (error) {
      console.error("Error approving:", error);
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  // 3. ฟังก์ชันไม่อนุมัติ (ยิง API พร้อมส่งเหตุผลไปลง DB)
  const handleReject = async (req) => {
    const reason = window.prompt(`ระบุเหตุผลที่ไม่อนุมัติการลาของ ${req.name}:`, "ไม่ระบุ");
    
    // ถ้ากดยกเลิกในหน้าต่าง Prompt จะไม่ทำอะไรต่อ
    if (reason === null) return;

    try {
      await axios.put(`http://localhost:5000/leave/${req.id}/reject`, { reason });
      
      // อัปเดตหน้าจอเมื่อ Backend อัปเดตสำเร็จ
      setRejected([...rejected, { ...req, rejectReason: reason }]);
      setRequests(requests.filter((r) => r.id !== req.id));
    } catch (error) {
      console.error("Error rejecting:", error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธคำขอ");
    }
  };

  return (
    <div className="app-container min-h-screen bg-[#3C467B] p-4 sm:p-6 md:p-8 flex flex-col items-center relative overflow-hidden">
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link
          to="/home"
          className="text-white text-2xl hover:scale-110 transition"
        >
          <i className="bi bi-chevron-left"></i>
        </Link>
        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">
          LEAVE APPROVE
        </h1>
        <div className="w-8" />
      </div>

      <div className="max-w-md w-full space-y-5">
        {loading && <div className="text-white text-center">กำลังโหลดข้อมูล...</div>}
        {!loading && requests.length === 0 && (
          <div className="text-white/70 text-center">ไม่มีคำขอลางานที่รออนุมัติ</div>
        )}

        {requests.map((req) => (
          <div
            key={req.id}
            className="relative bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 transform hover:-translate-y-2 hover:shadow-lg transition duration-300 flex items-center gap-3"
          >
            <img
              // ใส่รูประบบในกรณีที่ไม่ได้ตั้งรูปโปรไฟล์มา
              src={req.profile || `https://ui-avatars.com/api/?name=${req.name}`}
              alt={req.name}
              className="w-14 h-14 rounded-full border-2 border-[#ff00c8] object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-[0.9rem] sm:text-sm md:text-base leading-snug">
                {req.name}
              </div>
              <div className="text-xs text-gray-500">ID: {req.employeeId}</div>
              <div className="text-xs text-gray-700 mt-1">
                {req.reasons && req.reasons.includes("Other") ? `Other: ${req.otherReason}` : req.reasons?.join(", ")}
              </div>
              <div className="text-xs text-gray-700">
                วันที่ลา: {new Date(req.leaveStart).toLocaleDateString("th-TH")} → {new Date(req.leaveEnd).toLocaleDateString("th-TH")}
              </div>

              {/* แสดงปุ่มดูรูปแนบเฉพาะถ้ามี evidencePreview จริงๆ */}
              {req.evidencePreview && (
                <button
                  onClick={() => setSelectedEvidence(req.evidencePreview)}
                  className="mt-2 text-blue-500 underline text-xs font-medium hover:text-blue-700"
                >
                  ดูรูปแนบ
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleApprove(req)}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-[#34ffb9] to-[#12c27e] text-black font-semibold text-xs shadow hover:shadow-[0_0_18px_#34ffb9] transition"
              >
                อนุมัติ
              </button>
              <button
                onClick={() => handleReject(req)}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-[#ff5b5b] to-[#c71616] text-white font-semibold text-xs shadow hover:shadow-[0_0_18px_#ff5b5b] transition"
              >
                ไม่อนุมัติ
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvidence && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvidence(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2 border-b border-gray-300">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedEvidence}
              alt="evidence"
              className="w-full h-auto object-cover rounded-b-lg"
            />
          </div>
        </div>
      )}

      {/* --- ส่วนแสดงรายการที่เพิ่งอนุมัติ/ไม่อนุมัติ (อัปเดตสดๆ บนหน้าจอ) --- */}
      <div className="max-w-md w-full mt-8 space-y-4">
        {approved.length > 0 && (
          <div>
            <div className="inline-block bg-green-400/20 text-green-300 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              เพิ่งอนุมัติ
            </div>
            <div className="space-y-2">
              {approved.map((r) => (
                <div
                  key={r.id}
                  className="bg-white/10 p-3 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-white font-medium">
                    {r.name} ({new Date(r.leaveStart).toLocaleDateString("th-TH")})
                  </span>
                  <span className="text-green-400 text-sm">✓ Approved</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {rejected.length > 0 && (
          <div>
            <div className="inline-block bg-red-400/20 text-red-300 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              เพิ่งไม่อนุมัติ
            </div>
            <div className="space-y-2">
              {rejected.map((r) => (
                <div
                  key={r.id}
                  className="bg-white/10 p-3 rounded-xl shadow-sm flex flex-col"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-white font-medium">
                      {r.name} ({new Date(r.leaveStart).toLocaleDateString("th-TH")})
                    </span>
                    <span className="text-red-400 text-sm">✗ Rejected</span>
                  </div>
                  <span className="text-gray-300 text-xs mt-1">เหตุผล: {r.rejectReason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveRequestApprove;