import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

const getStatusThai = (status) => {
  if (status === "late") return "สาย";
  if (status === "ontime") return "ตรงเวลา";
  if (status === "early") return "ออกก่อนเวลา";
  return "ปกติ";
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // เปลี่ยนมายิง API ขอข้อมูลที่รออนุมัติโดยเฉพาะ
      const res = await axios.get("http://localhost:5000/checkin-approve/pending");
      const pendingData = res.data; 

      setUsers(pendingData.filter(item => item.type === "checkin" || item.type === "checkout"));
      setDelegateUsers(pendingData.filter(item => item.type === "delegate")); 
    } catch (error) {
      console.error("Error loading attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (user, isDelegate) => {
    try {
      // ใช้ PUT อนุมัติตาม API Spec
      await axios.put(`http://localhost:5000/checkin-approve/${user.id}/approve`);

      if (isDelegate) {
        setApprovedDelegate((prev) => [...prev, user]);
        setDelegateUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        setApprovedNormal((prev) => [...prev, user]);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
      console.error(error);
    }
  };

  const submitRejectReason = async () => {
    if (!rejectReasonUser || !rejectReason.trim()) {
      alert("กรุณาระบุเหตุผล");
      return;
    }

    try {
      // ใช้ PUT ปฏิเสธตาม API Spec พร้อมแนบเหตุผล
      await axios.put(`http://localhost:5000/checkin-approve/${rejectReasonUser.id}/reject`, { 
        reason: rejectReason 
      });

      if (viewDelegate) {
        setRejectedDelegate((prev) => [...prev, { ...rejectReasonUser, reason: rejectReason }]);
        setDelegateUsers((prev) => prev.filter((u) => u.id !== rejectReasonUser.id));
      } else {
        setRejectedNormal((prev) => [...prev, { ...rejectReasonUser, reason: rejectReason }]);
        setUsers((prev) => prev.filter((u) => u.id !== rejectReasonUser.id));
      }
      
      setRejectReasonUser(null);
      setRejectReason("");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
      console.error(error);
    }
  };

  const renderCard = (user, isDelegate = false) => {
    const buttonClasses = "flex-1 py-2 rounded-full text-white text-xs font-semibold hover:scale-105 transition-all";
    const displayAvatar = user.checkPhoto || user.avatar;
    const statusThai = getStatusThai(user.status);
    const typeThai = user.type === "checkin" ? "เช็กอิน" : user.type === "checkout" ? "เช็กเอาท์" : user.type;

    return (
      <div key={user.id} className="relative bg-white p-4 rounded-2xl shadow-md border border-gray-300 flex items-center gap-4">
        {displayAvatar && (
          <img src={displayAvatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-gray-400 object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-sm truncate">{user.name} ({typeThai})</div>
          <div className="text-xs text-gray-500 truncate">ID: {user.userId || user.userid}</div>
          <div className="text-xs text-gray-600 mt-1">
            เวลา: {user.displayTime} -{" "}
            <span className={statusThai === "สาย" || statusThai === "ออกก่อนเวลา" ? "text-red-500" : "text-green-500"}>
              {statusThai}
            </span>
          </div>
          {/* แจ้งเตือนเล็กๆ ถ้ามีเหตุผลออกก่อนเวลาจากพนักงาน */}
          {user.reject_reason && statusThai === "ออกก่อนเวลา" && (
            <div className="text-[10px] text-orange-500 mt-1 italic truncate">
              เหตุผล: {user.reject_reason}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleApprove(user, isDelegate)} className={`${buttonClasses} bg-green-500 hover:bg-green-600`}>อนุมัติ</button>
            <button onClick={() => { setRejectReasonUser(user); setRejectReason(""); }} className={`${buttonClasses} bg-red-500 hover:bg-red-600`}>ไม่อนุมัติ</button>
          </div>
        </div>
        <button onClick={() => setSelectedUser(user)} className="text-gray-700 text-2xl hover:scale-110">
          <i className="bi bi-camera"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="app-container min-h-screen bg-[#3C467B] p-4 flex flex-col items-center font-inter">
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <Link to="/home" className='text-decoration-none'>
          <Button variant="link" className="p-0"><i className="bi bi-chevron-left ms-3 text-white"></i></Button>
        </Link>
        <h1 className="text-white text-xl md:text-2xl font-bold text-center flex-1">Check Approve</h1>
        <div className="w-8" />
      </div>

      <div className="flex gap-2 mb-4 w-full max-w-md justify-center">
        <button onClick={() => setViewDelegate(false)} className={`w-[48%] py-2 rounded-full ${!viewDelegate ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"} font-semibold shadow`}>
          เช็กอินปกติ ({users.length})
        </button>
        <button onClick={() => setViewDelegate(true)} className={`w-[48%] py-2 rounded-full ${viewDelegate ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"} font-semibold shadow`}>
          เช็กอินแทนเพื่อน ({delegateUsers.length})
        </button>
      </div>

      <div className="max-w-md w-full space-y-5">
        {loading ? (
            <div className="text-center text-white p-4"><p>กำลังโหลดข้อมูล...</p></div>
        ) : (
            viewDelegate ? (delegateUsers.length > 0 ? delegateUsers.map((u) => renderCard(u, true)) : <div className="text-center text-white p-4"><p>ไม่มีข้อมูล</p></div>)
            : (users.length > 0 ? users.map((u) => renderCard(u)) : <div className="text-center text-white p-4"><p>ไม่มีข้อมูลรอดำเนินการ</p></div>)
        )}
      </div>

      {/* Modal ดูข้อมูลและรูปภาพ */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold text-gray-800">{selectedUser.name}</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-lg text-gray-600">✕</button>
            </div>
            <div className="p-4 space-y-2 text-gray-700">
              <div><strong>รหัสพนักงาน:</strong> {selectedUser.userId || selectedUser.userid}</div>
              <div><strong>ประเภท:</strong> {selectedUser.type}</div>
              <div><strong>เวลา:</strong> {selectedUser.displayTime}</div>
              <div><strong>สถานะ:</strong> <span className={getStatusThai(selectedUser.status) === "สาย" ? "text-red-500" : "text-green-500"}>{getStatusThai(selectedUser.status)}</span></div>
              {/* ตรงนี้จะโชว์เหตุผลที่พนักงานพิมพ์มาตอนออกก่อนเวลาครับ */}
              {selectedUser.reject_reason && <div className="text-orange-600"><strong>เหตุผลออกก่อน:</strong> {selectedUser.reject_reason}</div>}
              {selectedUser.checkPhoto && (
                <img src={selectedUser.checkPhoto} alt="checkin" className="w-full h-auto object-cover rounded-lg mt-2 border border-gray-300" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal ใส่เหตุผลไม่อนุมัติ (ของ Manager) */}
      {rejectReasonUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2" onClick={() => setRejectReasonUser(null)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-gray-800 font-semibold text-base mb-2">ไม่อนุมัติ: {rejectReasonUser.name}</h2>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="ระบุเหตุผลที่ไม่อนุมัติ..." className="w-full h-20 p-2 border border-gray-300 rounded-md resize-none text-sm outline-none focus:border-blue-500" />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setRejectReasonUser(null)} className="px-3 py-1 text-gray-700 rounded-md bg-gray-200 hover:bg-gray-300 text-sm">ยกเลิก</button>
              <button onClick={submitRejectReason} className="px-3 py-1 text-white rounded-md bg-red-500 hover:bg-red-600 text-sm shadow">ยืนยัน</button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section ด้านล่าง */}
      <div className="max-w-md w-full mt-6 space-y-4">
          {viewDelegate ? (
            <>
                {approvedDelegate.length > 0 && (
                <div className="bg-green-100/90 p-3 rounded-xl shadow-sm border border-green-200">
                    <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว (แทนเพื่อน)</div>
                    {approvedDelegate.map((u) => <div key={u.id} className="text-green-800 text-sm truncate">{u.name}</div>)}
                </div>
                )}
                {rejectedDelegate.length > 0 && (
                <div className="bg-red-100/90 p-3 rounded-xl shadow-sm border border-red-200">
                    <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ (แทนเพื่อน)</div>
                    {rejectedDelegate.map((u) => <div key={u.id} className="text-red-800 text-sm truncate">{u.name} - {u.reason}</div>)}
                </div>
                )}
            </>
          ) : (
            <>
                {approvedNormal.length > 0 && (
                <div className="bg-green-100/90 p-3 rounded-xl shadow-sm border border-green-200">
                    <div className="font-bold text-green-700 mb-1">อนุมัติแล้ว (ปกติ)</div>
                    {approvedNormal.map((u) => <div key={u.id} className="text-green-800 text-sm truncate">{u.name} - {u.displayTime}</div>)}
                </div>
                )}
                {rejectedNormal.length > 0 && (
                <div className="bg-red-100/90 p-3 rounded-xl shadow-sm border border-red-200">
                    <div className="font-bold text-red-700 mb-1">ไม่อนุมัติ (ปกติ)</div>
                    {rejectedNormal.map((u) => <div key={u.id} className="text-red-800 text-sm truncate">{u.name} - เหตุผล: {u.reason}</div>)}
                </div>
                )}
            </>
          )}
      </div>
    </div>
  );
}

export default CheckApprove;