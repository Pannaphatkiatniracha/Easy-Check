// CheckApprove.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#3C467B] p-4 flex flex-col items-center font-inter app-container">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">

        <Link to="/home" className='text-decoration-none'>
          <button className="text-white text-2xl">
            <i className="bi bi-chevron-left"></i>
          </button>
        </Link>

        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">
          CHECK APPROVE
        </h1>
        <div className="w-8" />
      </div>

      {/* User List */}
      <div className="max-w-md w-full space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-4 shadow-md flex items-center justify-between"
          >
            {/* Profile */}
            <div className="flex-shrink-0">
              <img
                src={user.profile}
                className="w-12 h-12 object-cover rounded-full border"
              />
            </div>

            {/* Info + buttons */}
            <div className="flex-1 ml-4">
              <div className="text-sm font-bold text-gray-800">{user.name}</div>
              <div className="text-xs text-gray-500 mb-2">{`เข้างาน: ${user.checkInTime} - สถานะ: ${getStatus(user.checkInTime)}`}</div>

              {/* ปุ่มอนุมัติ / ไม่อนุมัติ */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(user)}
                  className="px-3 py-1 rounded-[20px] text-white font-bold bg-[#59EA78] shadow-md flex-1 whitespace-nowrap text-center"
                >
                  อนุมัติ
                </button>
                <button
                  onClick={() => handleReject(user)}
                  className="px-3 py-1 rounded-[20px] text-white font-bold bg-[#DF4E4E] shadow-md flex-1 whitespace-nowrap text-center"
                >
                  ไม่อนุมัติ
                </button>
              </div>
            </div>

            {/* Camera icon */}
            <button
              onClick={() => openCameraFor(user)}
              className="ml-2 text-gray-700 text-xl flex-shrink-0"
            >
              <i className="bi bi-camera"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Modal preview */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">{selectedUser.name}</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-lg">
                ✕
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div><strong>รหัสพนักงาน:</strong> {selectedUser.employeeId}</div>
              <div><strong>เวลาเข้า:</strong> {selectedUser.checkInTime}</div>
              <div><strong>สถานะวันนี้:</strong> {getStatus(selectedUser.checkInTime)}</div>
              {selectedUser.checkInPhoto && (
                <img
                  src={selectedUser.checkInPhoto}
                  className="w-full h-auto object-cover rounded-md mt-2"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approved / Rejected summary */}
      <div className="max-w-md w-full mt-6 space-y-2">
        {approvedUsers.length > 0 && (
          <div className="bg-green-50 p-3 rounded-md">
            <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว:</div>
            {approvedUsers.map((u) => (
              <div key={u.id} className="text-sm text-green-800">
                {u.name} - เข้างาน: {u.checkInTime} - สถานะ: {getStatus(u.checkInTime)}
              </div>
            ))}
          </div>
        )}
        {rejectedUsers.length > 0 && (
          <div className="bg-red-50 p-3 rounded-md">
            <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ:</div>
            {rejectedUsers.map((u) => (
              <div key={u.id} className="text-sm text-red-800">
                {u.name} - เข้างาน: {u.checkInTime} - สถานะ: {getStatus(u.checkInTime)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckApprove;
