import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialLeaveRequests = [  // ข้อมูลคำลา ชื่อพนักงาน รหัสไอดี เหตุผลการลา วันที่เริ่มต้นลา-วันสิ้นสุดการลา รูปภาพแนบ เหตุผล
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
  const [requests, setRequests] = useState(initialLeaveRequests); //เก็บคำลางานที่ยังไม่ได้กดรับ การอนุมัติ ไม่อนุมัติ
  const [approved, setApproved] = useState([]); //ได้รับการอนุมัติ
  const [rejected, setRejected] = useState([]); //ไม่ได้รับการอนุมัติ
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const handleApprove = (req) => {  //อนุมัติ
    setApproved([...approved, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  const handleReject = (req) => { //ไม่อนุมัติ
    setRejected([...rejected, req]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  return (
    <div
      className="min-h-screen bg-[#3C467B] p-4 flex flex-col items-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link to="/home" className="text-white text-2xl">
          <i className="bi bi-chevron-left"></i>
        </Link>

        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">
          LEAVE APPROVE
        </h1>

        <div className="w-8" />
      </div>

      {/* Leave Request Cards */}
      <div className="max-w-md w-full space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl p-3 shadow-md flex items-center gap-3"
          >
            {/* Profile Image */}
            <img
              src={req.profile}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />

            {/* Text Info */}
            <div className="flex-1">
              <div className="text-gray-800 font-semibold">{req.name}</div>
              <div className="text-xs text-gray-500">ID: {req.employeeId}</div>
              <div className="text-xs text-gray-600">
                {req.reasons.includes("Other")
                  ? req.otherReason
                  : req.reasons.join(", ")}
              </div>

              {/* View Evidence */}
              {req.evidencePreview && (
                <button
                  onClick={() => setSelectedEvidence(req.evidencePreview)}
                  className="mt-2 text-blue-500 underline text-xs font-medium"
                >
                  ดูรูปแนบ
                </button>
              )}
            </div>

            {/* Approve / Reject Buttons */}
            {/* Approve / Reject Buttons */}
            <div className="flex flex-row gap-2 items-center">
              <button
                onClick={() => handleApprove(req)}
                className="px-3 py-1 rounded-full bg-[#59EA78] text-white text-xs font-semibold shadow"
              >
                อนุมัติ
              </button>
              <button
                onClick={() => handleReject(req)}
                className="px-3 py-1 rounded-full bg-[#DF4E4E] text-white text-xs font-semibold shadow"
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
            <div className="flex justify-end p-2 border-b">
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

      {/* Summary: แยกกล่องแต่ละคน + Header มีกล่อง */}
      <div className="max-w-md w-full mt-6 space-y-4">
        {/* Approved */}
        {approved.length > 0 && (
          <div>
            <div className="inline-block bg-green-100 text-green-800 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              อนุมัติแล้ว
            </div>
            <div className="space-y-2">
              {approved.map((r) => (
                <div
                  key={r.id}
                  className="bg-green-50 p-3 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-green-800 font-medium">
                    {r.name} ({r.leaveStart} → {r.leaveEnd})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <div>
            <div className="inline-block bg-red-100 text-red-800 font-semibold text-lg px-3 py-1 rounded-md mb-2">
              ไม่อนุมัติ
            </div>
            <div className="space-y-2">
              {rejected.map((r) => (
                <div
                  key={r.id}
                  className="bg-red-50 p-3 rounded-xl shadow-sm flex justify-between items-center"
                >
                  <span className="text-red-800 font-medium">
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
