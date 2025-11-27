import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

const initialRequests = [
  {
    id: 1,
    employee: "ปัณณพรรธน์ เกียรตินิรชา",
    department: "Project Manager",
    amount: 1500,
    type: "ค่ารักษาพยาบาล (ค่าหมอ)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },
  {
    id: 2,
    employee: "ฐิติฉัตร ศิริบุตร",
    department: "Product Manager",
    amount: 800,
    type: "ค่ารักษาพยาบาล (ค่ายา)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },
  {
    id: 3,
    employee: "ภทรพร แซ่ลี้",
    department: "Business Analyst",
    amount: 2000,
    type: "ค่าทันตกรรม (อุดฟัน)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },
  {
    id: 4,
    employee: "สราศินีย์ บุญมา",
    department: "ไอที",
    amount: 900,
    type: "ค่าทันตกรรม (ขูดหินปูน)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },
];

function PaymentRequest() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");

  // สำหรับ inline reject popup
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const openImage = (src) => setSelectedImage(src);
  const closeImage = () => setSelectedImage(null);

  const handleStatus = (id, newStatus, reason = "") => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus, reason } : r
      )
    );
    setRejectingId(null); // ปิด popup หลัง submit
  };

  const startReject = (id) => {
    setRejectingId(id);
    setRejectReason("");
  };

  const cancelReject = () => setRejectingId(null);

  const filteredRequests = requests.filter((r) => r.status === activeTab);

  return (
    <div className="app-container min-h-screen bg-[#3C467B] flex flex-col items-center font-inter px-4 sm:px-6 md:px-8 py-6">

      {/* Header */}
      <div className="w-full max-w-md d-flex justify-content-between align-items-center mb-6 mx-auto">
        <Link to="/home" className='text-decoration-none'>
          <Button variant="link" className="p-0">
            <i className="bi bi-chevron-left ms-3 text-white" style={{ fontSize: '1.5rem' }}></i>
          </Button>
        </Link>

        <h1 className="text-white text-2xl fw-bold text-center flex-grow-1">
          Payment Requests
        </h1>

        <div style={{ width: '2rem' }} />
      </div>

      {/* Tabs */}
      <div className="w-full max-w-md d-flex justify-content-between gap-2 mb-6 mx-auto">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "light" : "outline-light"}
            className="flex-grow-1"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="w-full max-w-md">
        {filteredRequests.length === 0 && (
          <p className="text-center text-white opacity-70">No {activeTab} requests</p>
        )}

        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white text-[#3C467B] p-4 rounded-3 mb-4 shadow border relative"
          >
            <p className="fw-semibold">{req.employee}</p>
            <p className="text-muted mb-1">{req.department}</p>
            <p className="mb-1">Type: {req.type}</p>
            <p className="mb-1">Amount: {req.amount} บาท</p>
            <p className={`fw-medium ${
              req.status === "Pending"
                ? "text-warning"
                : req.status === "Approved"
                ? "text-success"
                : "text-danger"
            }`}>
              Status: {req.status}
            </p>
            {req.status === "Rejected" && req.reason && (
              <p className="text-sm text-gray-700 mt-1">เหตุผล: {req.reason}</p>
            )}

            {/* Receipt */}
            <div className="mt-2">
              <Button variant="link" className="p-0" onClick={() => openImage(req.receipt)}>
                <i className="bi bi-receipt text-primary me-2"></i> View Receipt
              </Button>
            </div>

            {/* Action Buttons */}
            {activeTab === "Pending" && (
              <div className="d-flex gap-2 mt-3">
                <Button onClick={() => handleStatus(req.id, "Approved")} variant="success" className="flex-grow-1">
                  <i className="bi bi-check-circle me-2"></i> Approve
                </Button>
                <Button onClick={() => startReject(req.id)} variant="danger" className="flex-grow-1">
                  <i className="bi bi-x-circle me-2"></i> Reject
                </Button>
              </div>
            )}

            {/* Inline Reject Popup */}
            {rejectingId === req.id && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex flex-col justify-center items-center p-4 rounded" style={{ zIndex: 10 }}>
                <div className="bg-white p-4 rounded shadow w-full">
                  <h6 className="mb-2">กรุณาใส่เหตุผลที่ไม่อนุมัติ</h6>
                  <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={cancelReject}>ยกเลิก</Button>
                    <Button variant="danger" onClick={() => handleStatus(req.id, "Rejected", rejectReason)}>ไม่อนุมัติ</Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 d-flex align-items-center justify-content-center z-50 p-4">
          <div className="position-relative">
            <img src={selectedImage} className="max-w-sm rounded shadow-lg" alt="receipt"/>
            <Button onClick={closeImage} variant="danger" className="position-absolute top-2 end-2">
              ✕
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}

export default PaymentRequest;
