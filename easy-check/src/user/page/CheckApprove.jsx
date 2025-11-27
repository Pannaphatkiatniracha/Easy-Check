// CheckApprove.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialUsers = [
  {
    id: 1,
    name: "ปัณณพรรธน์ เกียรตินิรชา",
    employeeId: "100001",
    checkInTime: "09:00",
    profile:
      "https://i.pinimg.com/736x/2f/a6/bb/2fa6bb34b6f86794f5917989a427e0a4.jpg",
    checkInPhoto:
      "https://i.pinimg.com/736x/03/33/26/033326e59137032928ceb27b8bd42b6f.jpg",
  },
  {
    id: 2,
    name: "ฐิติฉัตร ศิริบุตร",
    employeeId: "100002",
    checkInTime: "08:30",
    profile: "https://img.hankyung.com/photo/202509/BF.41797059.1.jpg",
    checkInPhoto:
      "https://cdn.mania.kr/nbamania/g2/data/cheditor5/2402/view_thumbnail/mania-done-20240214105503_evzebkmp.jpg",
  },
    {
    id: 3,
    name: "สราศินีย์ บุญมา",
    employeeId: "100003",
    checkInTime: "08:30",
    profile: "https://i.pinimg.com/736x/14/2b/f0/142bf06d188725faa3824815f8772f7f.jpg",
    checkInPhoto:
      "https://i.pinimg.com/736x/3d/a4/30/3da43051883bcf170a3e5660bd6caf8d.jpg",
  },
    {
    id: 4,
    name: "ฐนิก ทรัพย์โนนหวาย",
    employeeId: "100004",
    checkInTime: "08:30",
    profile: "https://i.pinimg.com/736x/06/3a/74/063a74f72578c9e3c5d1081032912e7d.jpg",
    checkInPhoto:
      "https://i.pinimg.com/736x/e9/1d/d8/e91dd8c706bcc5dbd14cb39dbd7e01ac.jpg",
  },
  {
    id: 5,
    name: "ภทรพร แซ่ลี้",
    employeeId: "100005",
    checkInTime: "10:00",
    profile: "https://pbs.twimg.com/media/GurZlQBagAA3-Z0.jpg:large",
    checkInPhoto:
      "https://preview.redd.it/250728-karina-instagram-update-v0-7l1e5zr17mff1.jpg?width=640&crop=smart&auto=webp&s=d9ee4d6c794abcdb46210783defb38cf37c30b58",
  },
];

const initialDelegateCheckins = [
  {
    id: 1,
    name: "สฤณี จันทร์สว่าง",
    employeeId: "100006",
    profile:
      "https://i.pinimg.com/736x/b6/7b/99/b67b99c76b19dd60911db5897211ce50.jpg", // ใส่ URL โปรไฟล์จริง
   
  },
  {
    id: 2,
    name: "สิรินทรา ศรีสวัสดิ์",
    employeeId: "100007",
    profile:
      "https://i.pinimg.com/736x/27/35/c7/2735c7b69c0d042fcb219024c7082782.jpg", // ใส่ URL โปรไฟล์จริง
    
  },
];


const getStatus = (checkIn) => {
  const checkInDate = new Date(`1970-01-01T${checkIn}:00`);
  const officialStart = new Date(`1970-01-01T09:00:00`);
  return checkInDate > officialStart ? "สาย" : "ตรงเวลา";
};

function CheckApprove() {
  const [users, setUsers] = useState(initialUsers);
  const [delegateUsers, setDelegateUsers] = useState(initialDelegateCheckins);
  const [approvedNormal, setApprovedNormal] = useState([]);
  const [rejectedNormal, setRejectedNormal] = useState([]);
  const [approvedDelegate, setApprovedDelegate] = useState([]);
  const [rejectedDelegate, setRejectedDelegate] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDelegate, setViewDelegate] = useState(false);

  const [rejectReasonUser, setRejectReasonUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApproveNormal = (user) => {
    setApprovedNormal((prev) => [...prev, user]);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };
  const handleApproveDelegate = (user) => {
    setApprovedDelegate((prev) => [...prev, user]);
    setDelegateUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleRejectNormal = (user) => {
    setRejectReasonUser(user);
    setRejectReason("");
  };
  const handleRejectDelegate = (user) => {
    setRejectReasonUser(user);
    setRejectReason("");
  };

  const submitRejectReason = () => {
    if (!rejectReasonUser) return;

    if (viewDelegate) {
      setRejectedDelegate((prev) => [
        ...prev,
        { ...rejectReasonUser, reason: rejectReason },
      ]);
      setDelegateUsers((prev) =>
        prev.filter((u) => u.id !== rejectReasonUser.id)
      );
    } else {
      setRejectedNormal((prev) => [
        ...prev,
        { ...rejectReasonUser, reason: rejectReason },
      ]);
      setUsers((prev) => prev.filter((u) => u.id !== rejectReasonUser.id));
    }
    setRejectReasonUser(null);
  };

  const renderCard = (user, isDelegate = false) => {
  const buttonClasses =
    "flex-1 py-2 rounded-full text-white text-xs font-semibold hover:scale-105 transition-all";
  return (
    <div
      key={user.id}
      className="relative bg-white p-4 rounded-2xl shadow-md border border-gray-300 flex items-center gap-4"
    >
      {/* แสดงรูปโปรไฟล์ทุกคน */}
      {user.profile && (
        <img
          src={user.profile}
          alt={user.name}
          className="w-14 h-14 rounded-full border-2 border-gray-400 object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 text-sm truncate">{user.name}</div>
        <div className="text-xs text-gray-500 truncate">ID: {user.employeeId}</div>
        {/* แสดงเวลาเช็กอินเฉพาะ normal users */}
        {!isDelegate && (
          <div className="text-xs text-gray-600 mt-1">
            เวลาเช็กอิน: {user.checkInTime} -{" "}
            <span
              className={
                getStatus(user.checkInTime) === "สาย"
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {getStatus(user.checkInTime)}
            </span>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() =>
              isDelegate ? handleApproveDelegate(user) : handleApproveNormal(user)
            }
            className={`${buttonClasses} bg-green-500 hover:bg-green-600`}
          >
            อนุมัติ
          </button>
          <button
            onClick={() =>
              isDelegate ? handleRejectDelegate(user) : handleRejectNormal(user)
            }
            className={`${buttonClasses} bg-red-500 hover:bg-red-600`}
          >
            ไม่อนุมัติ
          </button>
        </div>
      </div>
      {/* ปุ่มดูรูปเช็กอิน เฉพาะ normal users */}
      {!isDelegate && (
        <button
          onClick={() => setSelectedUser(user)}
          className="text-gray-700 text-2xl hover:scale-110"
        >
          <i className="bi bi-camera"></i>
        </button>
      )}
    </div>
  );
};


  return (
    <div className="app-container min-h-screen bg-[#3C467B] p-4 flex flex-col items-center font-inter">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <Link to="/home">
          <button className="text-white text-2xl hover:scale-110">
            <i className="bi bi-chevron-left"></i>
          </button>
        </Link>
        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">
          Check Approve
        </h1>
        <div className="w-8" />
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-4 w-full max-w-md justify-center">
        <button
          onClick={() => setViewDelegate(false)}
          className={`w-[48%] py-2 rounded-full ${
            !viewDelegate ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
          } font-semibold`}
        >
          เช็กอินปกติ
        </button>
        <button
          onClick={() => setViewDelegate(true)}
          className={`w-[48%] py-2 rounded-full ${
            viewDelegate ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
          } font-semibold`}
        >
          เช็กอินแทนเพื่อน
        </button>
      </div>

      {/* User / Delegate List */}
      <div className="max-w-md w-full space-y-5">
        {viewDelegate
          ? delegateUsers.map((u) => renderCard(u, true))
          : users.map((u) => renderCard(u))}
      </div>

      {/* Modal แสดงรูปเช็กอิน */}
      {selectedUser && !viewDelegate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold text-gray-800">{selectedUser.name}</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-lg text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-2 text-gray-700">
              <div>
                <strong>รหัสพนักงาน:</strong> {selectedUser.employeeId}
              </div>
              <div>
                <strong>เวลาเช็กอิน:</strong> {selectedUser.checkInTime}
              </div>
              <div>
                <strong>สถานะ:</strong>{" "}
                <span
                  className={
                    getStatus(selectedUser.checkInTime) === "สาย"
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {getStatus(selectedUser.checkInTime)}
                </span>
              </div>
              {selectedUser.checkInPhoto && (
                <img
                  src={selectedUser.checkInPhoto}
                  alt="checkin"
                  className="w-full h-auto object-cover rounded-lg mt-2 border border-gray-300"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal ป้อนเหตุผลไม่อนุมัติ */}
      {rejectReasonUser && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2"
          onClick={() => setRejectReasonUser(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-xs p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-gray-800 font-semibold text-base mb-2">
              ไม่อนุมัติ: {rejectReasonUser.name}
            </h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="ระบุเหตุผล..."
              className="w-full h-20 p-2 border border-gray-300 rounded-md resize-none text-sm"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setRejectReasonUser(null)}
                className="px-3 py-1 text-gray-700 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={submitRejectReason}
                className="px-3 py-1 text-white rounded-md bg-red-500 hover:bg-red-600 text-sm"
              >
                ส่ง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="max-w-md w-full mt-6 space-y-4">
        {viewDelegate ? (
          <>
            {approvedDelegate.length > 0 && (
              <div className="bg-green-100/50 p-3 rounded-xl">
                <div className="font-bold text-green-700 mb-1">
                  อนุมัติแล้ว (แทนเพื่อน)
                </div>
                {approvedDelegate.map((u) => (
                  <div key={u.id} className="text-green-800 text-sm truncate">
                    {u.name}
                  </div>
                ))}
              </div>
            )}
            {rejectedDelegate.length > 0 && (
              <div className="bg-red-100/50 p-3 rounded-xl">
                <div className="font-bold text-red-700 mb-1">
                  ไม่อนุมัติ (แทนเพื่อน)
                </div>
                {rejectedDelegate.map((u) => (
                  <div key={u.id} className="text-red-800 text-sm truncate">
                    {u.name} - {u.reason}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {approvedNormal.length > 0 && (
              <div className="bg-green-100/50 p-3 rounded-xl">
                <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว (ปกติ)</div>
                {approvedNormal.map((u) => (
                  <div key={u.id} className="text-green-800 text-sm truncate">
                    {u.name} - {u.checkInTime} - {getStatus(u.checkInTime)}
                  </div>
                ))}
              </div>
            )}
            {rejectedNormal.length > 0 && (
              <div className="bg-red-100/50 p-3 rounded-xl">
                <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ (ปกติ)</div>
                {rejectedNormal.map((u) => (
                  <div key={u.id} className="text-red-800 text-sm truncate">
                    {u.name} - {u.checkInTime} - {getStatus(u.checkInTime)} -{" "}
                    {u.reason}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CheckApprove;
