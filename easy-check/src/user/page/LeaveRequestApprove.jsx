import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialLeaveRequests = [
  {
    id: 1,
    profile:
      "https://i.pinimg.com/736x/2f/a6/bb/2fa6bb34b6f86794f5917989a427e0a4.jpg",
    name: "ปัณณพรรธน์ เกียรตินิรชา",
    employeeId: "010889",
    reasons: ["Sick-self"],
    leaveStart: "2025-11-20",
    leaveEnd: "2025-11-22",
    otherReason: "",
    evidencePreview:
      "https://consumerthai.s3.ap-southeast-1.amazonaws.com/news-img/news-216-1.jpg",
  },
  {
    id: 2,
    profile:
      "https://i.pinimg.com/736x/b4/a4/f1/b4a4f1b302296b6621b89c7d91ee9352.jpg",
    name: "ฐิติฉัตร ศิริบุตร",
    employeeId: "010101",
    reasons: ["Vacation"],
    leaveStart: "2025-11-25",
    leaveEnd: "2025-11-27",
    otherReason: "",
    evidencePreview: null,
  },
  {
    id: 3,
    profile:
      "https://i.pinimg.com/736x/53/e5/ce/53e5ce1aec6f6dec22bb137680163136.jpg",
    name: "ภทรพร แซ่ลี้",
    employeeId: "110400",
    reasons: ["Other"],
    leaveStart: "2025-11-15",
    leaveEnd: "2025-11-16",
    otherReason: "Urgent family matter",
    evidencePreview: null,
  },
];

function LeaveRequestApprove() {
  const [requests, setRequests] = useState(initialLeaveRequests);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const handleApprove = (req) => {
    setApproved([...approved, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  const handleReject = (req) => {
    setRejected([...rejected, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  return (
    <div
      className="min-h-screen bg-[#3C467B] p-4 flex flex-col items-center relative overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
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

      {/* Leave Request Cards */}
      <div className="max-w-md w-full space-y-5">
        {requests.map((req) => (
          <div
            key={req.id}
            className="relative bg-[#4a518f]/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-[#7f5cff]/30
              transform hover:-translate-y-2 hover:shadow-[0_0_25px_#7f5cff] transition duration-300 flex items-center gap-3"
          >
            {/* Profile */}
            <img
              src={req.profile}
              alt={req.name}
              className="w-14 h-14 rounded-full border-2 border-[#ff00c8] object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="font-semibold text-white text-lg">{req.name}</div>
              <div className="text-xs text-gray-300">ID: {req.employeeId}</div>
              <div className="text-xs text-gray-200 mt-1">
                {req.reasons.includes("Other")
                  ? req.otherReason
                  : req.reasons.join(", ")}
              </div>
              <div className="text-xs text-gray-200">
                วันที่ลา: {req.leaveStart} → {req.leaveEnd}
              </div>

              {/* Evidence */}
              {req.evidencePreview && (
                <button
                  onClick={() => setSelectedEvidence(req.evidencePreview)}
                  className="mt-2 text-blue-300 underline text-xs font-medium hover:text-blue-500"
                >
                  ดูรูปแนบ
                </button>
              )}
            </div>

            {/* Buttons */}
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

      {/* Evidence Modal */}
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

      {/* Approved / Rejected Summary */}
      <div className="max-w-md w-full mt-8 space-y-4">
        {approved.length > 0 && (
          <div>
            <div className="inline-block bg-green-400/20 text-green-100 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              อนุมัติแล้ว
            </div>
            <div className="space-y-2">
              {approved.map((r) => (
                <div
                  key={r.id}
                  className="bg-green-500/10 p-3 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-green-100 font-medium">
                    {r.name} ({r.leaveStart} → {r.leaveEnd})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {rejected.length > 0 && (
          <div>
            <div className="inline-block bg-red-400/20 text-red-100 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              ไม่อนุมัติ
            </div>
            <div className="space-y-2">
              {rejected.map((r) => (
                <div
                  key={r.id}
                  className="bg-red-500/10 p-3 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-red-100 font-medium">
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
