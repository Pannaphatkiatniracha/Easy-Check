// CheckApprove.jsx
import React, { useState } from "react";
import { Link } from 'react-router-dom';

const initialUsers = [
  { 
    id: 1, 
    name: "ปัณณพรรธน์ เกียรตินิรชา", 
    employeeId: "010889",
    checkInTime: "09:00",
    profile: "https://i.pinimg.com/736x/2f/a6/bb/2fa6bb34b6f86794f5917989a427e0a4.jpg",
    checkInPhoto: "https://i.pinimg.com/736x/fa/cd/a2/facda288a9633aade66c84642a8fcb6a.jpg"
  },
  { 
    id: 2, 
    name: "ฐิติฉัตร ศิริบุตร", 
    employeeId: "010101",
    checkInTime: "08:30",
    profile: "https://i.pinimg.com/736x/b4/a4/f1/b4a4f1b302296b6621b89c7d91ee9352.jpg",
    checkInPhoto: "https://i.redd.it/dte258y55e1c1.jpg"
  },
  { 
    id: 3, 
    name: "ภทรพร แซ่ลี้", 
    employeeId: "110400",
    checkInTime: "10:00",
    profile: "https://i.pinimg.com/736x/53/e5/ce/53e5ce1aec6f6dec22bb137680163136.jpg",
    checkInPhoto: "https://i.pinimg.com/736x/f8/d3/15/f8d315c29812464824e8aaf91970be46.jpg"
  },
];

const getStatus = (checkIn) => {
  const checkInDate = new Date(`1970-01-01T${checkIn}:00`);
  const officialStart = new Date(`1970-01-01T09:00:00`);
  return checkInDate > officialStart ? "สาย" : "ตรงเวลา";
};

function CheckApprove() {
  const [users, setUsers] = useState(initialUsers);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const openCameraFor = (user) => setSelectedUser(user);

  const handleApprove = (user) => {
    setApprovedUsers((prev) => [...prev, user]);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSelectedUser(null);
  };

  const handleReject = (user) => {
    setRejectedUsers((prev) => [...prev, user]);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-[#3C467B] p-4 flex flex-col items-center font-inter relative">

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link to="/home">
          <button className="text-white text-2xl hover:scale-110 transition"> 
            <i className="bi bi-chevron-left"></i>
          </button>
        </Link>
        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">
          CHECK APPROVE
        </h1>
        <div className="w-8" />
      </div>

      {/* User List */}
      <div className="max-w-md w-full space-y-5">
        {users.map((user) => (
          <div
            key={user.id}
            className="relative bg-[#ffffff]/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-[#7f5cff]/40 
            transform hover:-translate-y-2 hover:shadow-[0_0_25px_#7f5cff] transition duration-300 flex items-center gap-4"
          >
            {/* Profile */}
            <img
              src={user.profile}
              alt={user.name}
              className="w-14 h-14 rounded-full border-2 border-[#7f5cff] object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="font-bold text-gray-800 text-lg">{user.name}</div>
              <div className="text-xs text-gray-500">ID: {user.employeeId}</div>
              <div className="text-xs text-gray-600 mt-1">
                เข้างาน: {user.checkInTime} - <span className={getStatus(user.checkInTime) === "สาย" ? "text-red-500" : "text-green-500"}>{getStatus(user.checkInTime)}</span>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleApprove(user)}
                  className="flex-1 py-2 rounded-full bg-gradient-to-r from-[#34ffb9] to-[#12c27e] text-black font-semibold text-xs shadow hover:shadow-[0_0_15px_#34ffb9] transition"
                >
                  อนุมัติ
                </button>
                <button
                  onClick={() => handleReject(user)}
                  className="flex-1 py-2 rounded-full bg-gradient-to-r from-[#ff5b5b] to-[#c71616] text-white font-semibold text-xs shadow hover:shadow-[0_0_15px_#ff5b5b] transition"
                >
                  ไม่อนุมัติ
                </button>
              </div>
            </div>

            {/* Camera */}
            <button
              onClick={() => openCameraFor(user)}
              className="text-[#7f5cff] text-2xl hover:scale-110 transition"
            >
              <i className="bi bi-camera"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold">{selectedUser.name}</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-lg">✕</button>
            </div>
            <div className="p-4 space-y-2">
              <div><strong>รหัสพนักงาน:</strong> {selectedUser.employeeId}</div>
              <div><strong>เวลาเข้า:</strong> {selectedUser.checkInTime}</div>
              <div><strong>สถานะวันนี้:</strong> <span className={getStatus(selectedUser.checkInTime) === "สาย" ? "text-red-500" : "text-green-500"}>{getStatus(selectedUser.checkInTime)}</span></div>
              {selectedUser.checkInPhoto && (
                <img
                  src={selectedUser.checkInPhoto}
                  alt="checkin"
                  className="w-full h-auto object-cover rounded-lg mt-2 border border-[#7f5cff]/40"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="max-w-md w-full mt-6 space-y-4">
        {approvedUsers.length > 0 && (
          <div className="bg-green-100/30 p-3 rounded-xl">
            <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว</div>
            {approvedUsers.map((u) => (
              <div key={u.id} className="text-green-800 text-sm">{u.name} - {u.checkInTime} - {getStatus(u.checkInTime)}</div>
            ))}
          </div>
        )}
        {rejectedUsers.length > 0 && (
          <div className="bg-red-100/30 p-3 rounded-xl">
            <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ</div>
            {rejectedUsers.map((u) => (
              <div key={u.id} className="text-red-800 text-sm">{u.name} - {u.checkInTime} - {getStatus(u.checkInTime)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckApprove;
