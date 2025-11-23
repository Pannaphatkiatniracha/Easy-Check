import React, { useState } from "react";
import { Link } from 'react-router-dom';

// ตัวอย่างข้อมูลพนักงานที่เช็กอินแทนเพื่อน
const initialDelegateCheckins = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    employeeId: "123456",
    checkInTime: "09:05",
    checkInPhoto: "https://i.pinimg.com/736x/fa/cd/a2/facda288a9633aade66c84642a8fcb6a.jpg",
  },
  {
    id: 2,
    name: "สุนิตา แสนสุข",
    employeeId: "654321",
    checkInTime: "08:50",
    checkInPhoto: "https://i.redd.it/dte258y55e1c1.jpg",
  },
];

const getStatus = (checkIn) => {
  const checkInDate = new Date(`1970-01-01T${checkIn}:00`);
  const officialStart = new Date(`1970-01-01T09:00:00`);
  return checkInDate > officialStart ? "สาย" : "ตรงเวลา";
};

const DelegateCheckinApprove = () => {
  const [requests, setRequests] = useState(initialDelegateCheckins);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleApprove = (user) => {
    setApproved(prev => [...prev, user]);
    setRequests(prev => prev.filter(u => u.id !== user.id));
    setSelected(null);
  };

  const handleReject = (user) => {
    setRejected(prev => [...prev, user]);
    setRequests(prev => prev.filter(u => u.id !== user.id));
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C467B] to-[#636CCB] p-4 flex flex-col items-center font-inter">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link to="/home">
          <button className="text-white text-2xl hover:scale-110 transition"> 
            <i className="bi bi-chevron-left"></i>
          </button>
        </Link>
        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">
          Delegate Checkin Approve
        </h1>
        <div className="w-8" />
      </div>

      {/* List Request */}
      <div className="max-w-md w-full space-y-5">
        {requests.map(user => (
          <div key={user.id} className="relative bg-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/30 transform hover:-translate-y-2 hover:shadow-[0_0_25px_#7f5cff] transition duration-300 flex items-center gap-4">
            
            {/* Info */}
            <div className="flex-1">
              <div className="font-bold text-white text-lg">{user.name}</div>
              <div className="text-xs text-gray-200">ID: {user.employeeId}</div>
              <div className="text-xs text-gray-200 mt-1">
                เวลาเช็กอิน: {user.checkInTime} - <span className={getStatus(user.checkInTime) === "สาย" ? "text-red-400" : "text-green-400"}>{getStatus(user.checkInTime)}</span>
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

            {/* View Photo */}
            <button
              onClick={() => setSelected(user)}
              className="text-white text-2xl hover:scale-110 transition"
            >
              <i className="bi bi-camera"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="p-2 text-lg">✕</button>
            </div>
            <div className="p-4 space-y-2">
              <div><strong>รหัสพนักงาน:</strong> {selected.employeeId}</div>
              <div><strong>เวลาเช็กอิน:</strong> {selected.checkInTime}</div>
              <div><strong>สถานะ:</strong> <span className={getStatus(selected.checkInTime) === "สาย" ? "text-red-500" : "text-green-500"}>{getStatus(selected.checkInTime)}</span></div>
              {selected.checkInPhoto && (
                <img src={selected.checkInPhoto} alt="checkin" className="w-full h-auto object-cover rounded-lg mt-2 border border-white/30" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="max-w-md w-full mt-6 space-y-4">
        {approved.length > 0 && (
          <div className="bg-green-100/30 p-3 rounded-xl">
            <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว</div>
            {approved.map(u => (
              <div key={u.id} className="text-green-800 text-sm">{u.name} - {u.checkInTime} - {getStatus(u.checkInTime)}</div>
            ))}
          </div>
        )}
        {rejected.length > 0 && (
          <div className="bg-red-100/30 p-3 rounded-xl">
            <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ</div>
            {rejected.map(u => (
              <div key={u.id} className="text-red-800 text-sm">{u.name} - {u.checkInTime} - {getStatus(u.checkInTime)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DelegateCheckinApprove;
