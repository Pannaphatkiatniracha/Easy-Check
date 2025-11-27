import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function LeaveRequestApprove() {
  const [requests, setRequests] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users");
        const employees = await res.json();
        
        const employeesWithLeaveRequests = employees.filter(employee => 
          employee.leaveStart && employee.leaveEnd && employee.leaveStatus
        );
        
        const leaveRequests = employeesWithLeaveRequests.map(employee => ({
          id: employee.id,
          profile: employee.avatar,
          name: employee.name,
          employeeId: employee.userid,
          reasons: employee.leaveReasons ? [employee.leaveReasons] : ["Sick-self"],
          leaveStart: employee.leaveStart,
          leaveEnd: employee.leaveEnd,
          otherReason: "",
          evidencePreview: employee.leaveEvidence || null,
          department: employee.department,
          position: employee.position
        }));
        
        setRequests(leaveRequests);
      } catch (error) {
        console.error("Error loading leave requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleApprove = (req) => {
    setApproved([...approved, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  const handleReject = (req) => {
    setRejected([...rejected, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
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
        {requests.map((req) => (
          <div
            key={req.id}
            className="relative bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 transform hover:-translate-y-2 hover:shadow-lg transition duration-300 flex items-center gap-3"
          >
            <img
              src={req.profile}
              alt={req.name}
              className="w-14 h-14 rounded-full border-2 border-[#ff00c8] object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-[0.9rem] sm:text-sm md:text-base leading-snug">
                {req.name}
              </div>
              <div className="text-xs text-gray-500">ID: {req.employeeId}</div>
              <div className="text-xs text-gray-700 mt-1">
                {req.reasons.includes("Other") ? req.otherReason : req.reasons.join(", ")}
              </div>
              <div className="text-xs text-gray-700">
                วันที่ลา: {req.leaveStart} → {req.leaveEnd}
              </div>

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

      <div className="max-w-md w-full mt-8 space-y-4">
        {approved.length > 0 && (
          <div>
            <div className="inline-block bg-green-400/20 text-green-800 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              อนุมัติแล้ว
            </div>
            <div className="space-y-2">
              {approved.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-gray-900 font-medium">
                    {r.name} ({r.leaveStart} → {r.leaveEnd})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {rejected.length > 0 && (
          <div>
            <div className="inline-block bg-red-400/20 text-red-800 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              ไม่อนุมัติ
            </div>
            <div className="space-y-2">
              {rejected.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-gray-900 font-medium">
                    {r.name} ({r.leaveStart} → {r.leaveEnd})
                  </span>
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