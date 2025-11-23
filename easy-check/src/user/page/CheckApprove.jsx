// CheckApprove.jsx
import React, { useState } from "react";
import { Link } from 'react-router-dom';

const initialUsers = [
  { id: 1, name: "ปัณณพรรธน์ เกียรตินิรชา", employeeId: "010889", checkInTime: "09:00", profile: "https://i.pinimg.com/736x/2f/a6/bb/2fa6bb34b6f86794f5917989a427e0a4.jpg", checkInPhoto: "https://i.pinimg.com/736x/fa/cd/a2/facda288a9633aade66c84642a8fcb6a.jpg" },
  { id: 2, name: "ฐิติฉัตร ศิริบุตร", employeeId: "010101", checkInTime: "08:30", profile: "https://i.pinimg.com/736x/b4/a4/f1/b4a4f1b302296b6621b89c7d91ee9352.jpg", checkInPhoto: "https://i.redd.it/dte258y55e1c1.jpg" },
  { id: 3, name: "ภทรพร แซ่ลี้", employeeId: "110400", checkInTime: "10:00", profile: "https://i.pinimg.com/736x/53/e5/ce/53e5ce1aec6f6dec22bb137680163136.jpg", checkInPhoto: "https://i.pinimg.com/736x/f8/d3/15/f8d315c29812464824e8aaf91970be46.jpg" },
];

const initialDelegateCheckins = [
  { id: 1, name: "สราศินีย์ บุญมา", employeeId: "110500" },
  { id: 2, name: "ฐนิก ทรัพย์โนนหวาย", employeeId: "110600" },
];

const getStatus = (checkIn) => {
  const checkInDate = new Date(`1970-01-01T${checkIn}:00`);
  const officialStart = new Date(`1970-01-01T09:00:00`);
  return checkInDate > officialStart ? "สาย" : "ตรงเวลา";
};

function CheckApprove() {
  const [users, setUsers] = useState(initialUsers);
  const [delegateUsers, setDelegateUsers] = useState(initialDelegateCheckins);

  // แยก state ของแต่ละหน้า
  const [approvedNormal, setApprovedNormal] = useState([]);
  const [rejectedNormal, setRejectedNormal] = useState([]);
  const [approvedDelegate, setApprovedDelegate] = useState([]);
  const [rejectedDelegate, setRejectedDelegate] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDelegate, setViewDelegate] = useState(false);

  // --- ฟังก์ชันอนุมัติ/ไม่อนุมัติ ---
  const handleApproveNormal = (user) => {
    setApprovedNormal(prev => [...prev, user]);
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };
  const handleRejectNormal = (user) => {
    setRejectedNormal(prev => [...prev, user]);
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };
  const handleApproveDelegate = (user) => {
    setApprovedDelegate(prev => [...prev, user]);
    setDelegateUsers(prev => prev.filter(u => u.id !== user.id));
  };
  const handleRejectDelegate = (user) => {
    setRejectedDelegate(prev => [...prev, user]);
    setDelegateUsers(prev => prev.filter(u => u.id !== user.id));
  };

  // --- Card ผู้ใช้ ---
  const renderCard = (user, isDelegate=false) => {
    if(isDelegate) {
      return (
        <div key={user.id} className="relative bg-white/90 p-4 rounded-2xl shadow-lg border border-gray-300 transform hover:-translate-y-1 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-800 text-lg">{user.name}</div>
            <div className="text-xs text-gray-500">ID: {user.employeeId}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>handleApproveDelegate(user)} className="py-2 px-4 rounded-full bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition">อนุมัติ</button>
            <button onClick={()=>handleRejectDelegate(user)} className="py-2 px-4 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition">ไม่อนุมัติ</button>
          </div>
        </div>
      );
    }

    return (
      <div key={user.id} className="relative bg-white/90 p-4 rounded-2xl shadow-lg border border-gray-300 transform hover:-translate-y-1 hover:shadow-xl transition flex items-center gap-4">
        <img src={user.profile} alt={user.name} className="w-14 h-14 rounded-full border-2 border-gray-400 object-cover" />
        <div className="flex-1">
          <div className="font-bold text-gray-800 text-lg">{user.name}</div>
          <div className="text-xs text-gray-500">ID: {user.employeeId}</div>
          <div className="text-xs text-gray-600 mt-1">
            เวลาเช็กอิน: {user.checkInTime} - <span className={getStatus(user.checkInTime)==="สาย"?"text-red-500":"text-green-500"}>{getStatus(user.checkInTime)}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={()=>handleApproveNormal(user)} className="flex-1 py-2 rounded-full bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition">อนุมัติ</button>
            <button onClick={()=>handleRejectNormal(user)} className="flex-1 py-2 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition">ไม่อนุมัติ</button>
          </div>
        </div>
        <button onClick={()=>setSelectedUser(user)} className="text-gray-700 text-2xl hover:scale-110 transition"><i className="bi bi-camera"></i></button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#3C467B] p-4 flex flex-col items-center font-inter">

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <Link to="/home"><button className="text-white text-2xl hover:scale-110 transition"><i className="bi bi-chevron-left"></i></button></Link>
        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">CHECK APPROVE</h1>
        <div className="w-8" />
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-4 w-full max-w-md justify-center">
        <button onClick={()=>setViewDelegate(false)} className={`w-[48%] py-2 rounded-full ${!viewDelegate?"bg-blue-600 text-white":"bg-gray-300 text-gray-700"} font-semibold transition`}>เช็กอินปกติ</button>
        <button onClick={()=>setViewDelegate(true)} className={`w-[48%] py-2 rounded-full ${viewDelegate?"bg-blue-600 text-white":"bg-gray-300 text-gray-700"} font-semibold transition`}>เช็กอินแทนเพื่อน</button>
      </div>

      {/* User / Delegate List */}
      <div className="max-w-md w-full space-y-5">
        {viewDelegate ? delegateUsers.map(u=>renderCard(u,true)) : users.map(u=>renderCard(u))}
      </div>

      {/* Modal */}
      {selectedUser && !selectedUser.isDelegate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={()=>setSelectedUser(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-lg" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold text-gray-800">{selectedUser.name}</h2>
              <button onClick={()=>setSelectedUser(null)} className="p-2 text-lg text-gray-600">✕</button>
            </div>
            <div className="p-4 space-y-2 text-gray-700">
              <div><strong>รหัสพนักงาน:</strong> {selectedUser.employeeId}</div>
              <div><strong>เวลาเช็กอิน:</strong> {selectedUser.checkInTime}</div>
              <div><strong>สถานะ:</strong> <span className={getStatus(selectedUser.checkInTime)==="สาย"?"text-red-500":"text-green-500"}>{getStatus(selectedUser.checkInTime)}</span></div>
              {selectedUser.checkInPhoto && <img src={selectedUser.checkInPhoto} alt="checkin" className="w-full h-auto object-cover rounded-lg mt-2 border border-gray-300"/>}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="max-w-md w-full mt-6 space-y-4">

        {/* Summary แยกหน้าชัดเจน */}
        {viewDelegate ? (
          <>
            {approvedDelegate.length>0 && (
              <div className="bg-green-100/50 p-3 rounded-xl">
                <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว (แทนเพื่อน)</div>
                {approvedDelegate.map(u=><div key={u.id} className="text-green-800 text-sm">{u.name} (แทนเพื่อน)</div>)}
              </div>
            )}
            {rejectedDelegate.length>0 && (
              <div className="bg-red-100/50 p-3 rounded-xl">
                <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ (แทนเพื่อน)</div>
                {rejectedDelegate.map(u=><div key={u.id} className="text-red-800 text-sm">{u.name} (แทนเพื่อน)</div>)}
              </div>
            )}
          </>
        ) : (
          <>
            {approvedNormal.length>0 && (
              <div className="bg-green-100/50 p-3 rounded-xl">
                <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว (ปกติ)</div>
                {approvedNormal.map(u=><div key={u.id} className="text-green-800 text-sm">{u.name} - {u.checkInTime} - {getStatus(u.checkInTime)}</div>)}
              </div>
            )}
            {rejectedNormal.length>0 && (
              <div className="bg-red-100/50 p-3 rounded-xl">
                <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ (ปกติ)</div>
                {rejectedNormal.map(u=><div key={u.id} className="text-red-800 text-sm">{u.name} - {u.checkInTime} - {getStatus(u.checkInTime)}</div>)}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default CheckApprove;
