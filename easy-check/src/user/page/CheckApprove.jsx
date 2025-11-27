import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const getStatus = (checkIn) => {
  if (!checkIn) return "ไม่มีข้อมูล";
  const checkInDate = new Date(`1970-01-01T${checkIn}:00`);
  const officialStart = new Date(`1970-01-01T09:00:00`);
  return checkInDate > officialStart ? "สาย" : "ตรงเวลา";
};

function CheckApprove() {
  const [users, setUsers] = useState([]);
  const [delegateUsers, setDelegateUsers] = useState([]);
  const [approvedNormal, setApprovedNormal] = useState([]);
  const [rejectedNormal, setRejectedNormal] = useState([]);
  const [approvedDelegate, setApprovedDelegate] = useState([]);
  const [rejectedDelegate, setRejectedDelegate] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDelegate, setViewDelegate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rejectReasonUser, setRejectReasonUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch ข้อมูลจาก MockAPI
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users");
        const employees = await res.json();
        
        console.log("ข้อมูลจาก API:", employees); // เช็คข้อมูลที่ได้จาก API
        
        // สร้างข้อมูลตัวอย่างถ้าไม่มี checkInTime
        const usersWithCheckin = employees.map(user => ({
          ...user,
          checkInTime: user.checkInTime || getRandomCheckInTime(), // ถ้าไม่มีให้สุ่มเวลา
          checkInPhoto: user.checkInPhoto || user.avatar // ถ้าไม่มีใช้ avatar แทน
        }));
        
        setUsers(usersWithCheckin);
        
        // สำหรับ delegate users
        setDelegateUsers([
          {
            id: 1001,
            name: "สฤณี จันทร์สว่าง",
            userid: "100006",
            avatar: "https://i.pinimg.com/736x/b6/7b/99/b67b99c76b19dd60911db5897211ce50.jpg",
          },
          {
            id: 1002,
            name: "สิรินทรา ศรีสวัสดิ์", 
            userid: "100007",
            avatar: "https://i.pinimg.com/736x/27/35/c7/2735c7b69c0d042fcb219024c7082782.jpg",
          },
        ]);
      } catch (error) {
        console.error("Error loading employees:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ฟังก์ชันสุ่มเวลาเช็คอิน
  const getRandomCheckInTime = () => {
    const times = ["08:30", "08:45", "09:00", "09:15", "09:30"];
    return times[Math.floor(Math.random() * times.length)];
  };

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
        {/* ใช้ avatar จาก MockAPI */}
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full border-2 border-gray-400 object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-sm truncate">{user.name}</div>
          {/* ใช้ userid จาก MockAPI */}
          <div className="text-xs text-gray-500 truncate">ID: {user.userid}</div>
          {/* แสดงเวลาเช็กอินเฉพาะ normal users */}
          {!isDelegate && (
            <div className="text-xs text-gray-600 mt-1">
              เวลาเช็กอิน: {user.checkInTime} -{" "}
              <span
                className={
                  getStatus(user.checkInTime) === "สาย"
                    ? "text-red-500"
                    : getStatus(user.checkInTime) === "ตรงเวลา" 
                    ? "text-green-500"
                    : "text-gray-500"
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

  // Loading State
  if (loading) {
    return (
      <div className="app-container min-h-screen bg-[#3C467B] p-4 flex flex-col items-center justify-center font-inter">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen bg-[#3C467B] p-4 flex flex-col items-center font-inter">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <Link to="/home" className='text-decoration-none'>
          <Button variant="link" className="p-0">
            <i className="bi bi-chevron-left ms-3 text-white"></i>
          </Button>
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
          เช็กอินปกติ ({users.length})
        </button>
        <button
          onClick={() => setViewDelegate(true)}
          className={`w-[48%] py-2 rounded-full ${
            viewDelegate ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
          } font-semibold`}
        >
          เช็กอินแทนเพื่อน ({delegateUsers.length})
        </button>
      </div>

      {/* User / Delegate List */}
      <div className="max-w-md w-full space-y-5">
        {viewDelegate
          ? delegateUsers.map((u) => renderCard(u, true))
          : users.length > 0 
            ? users.map((u) => renderCard(u))
            : (
                <div className="text-center text-white p-4">
                  <p>ไม่มีข้อมูลการเช็คอินปกติ</p>
                </div>
              )
        }
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
                <strong>รหัสพนักงาน:</strong> {selectedUser.userid}
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
                      : getStatus(selectedUser.checkInTime) === "ตรงเวลา"
                      ? "text-green-500"
                      : "text-gray-500"
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