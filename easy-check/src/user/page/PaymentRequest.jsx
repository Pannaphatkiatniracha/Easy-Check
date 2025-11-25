import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialRequests = [
  {
    id: 1,
    employee: "ปัณณพรรธน์ เกียรตินิรชา",
    department: "Project Manager",
    amount: 1500,
    type: "ค่ารักษาพยาบาล (ค่าหมอ)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
    submittedDate: "2025-11-22",
  },
  {
    id: 2,
    employee: "ฐิติฉัตร ศิริบุตร",
    department: "Product Manager",
    amount: 800,
    type: "ค่ารักษาพยาบาล (ค่ายา)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
    submittedDate: "2025-11-23",
  },
  {
    id: 3,
    employee: "ภทรพร แซ่ลี้",
    department: "Business Analyst",
    amount: 2000,
    type: "ค่าทันตกรรม (อุดฟัน)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
    submittedDate: "2025-11-21",
  },
  {
    id: 4,
    employee: "สราศินีย์ บุญมา",
    department: "ไอที",
    amount: 900,
    type: "ค่าทันตกรรม (ขูดหินปูน)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
    submittedDate: "2025-11-20",
  },
];

function PaymentRequest() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending"); // "Pending", "Approved", "Rejected"

  const openImage = (src) => setSelectedImage(src);
  const closeImage = () => setSelectedImage(null);

  const handleStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRequests = requests.filter((r) => r.status === activeTab);

  return (
    <div
      className="min-h-screen bg-[#3C467B] p-4 flex flex-col items-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link to="/home" className="text-white text-2xl hover:scale-110 transition">
          <i className="bi bi-chevron-left"></i>
        </Link>
        <h1 className="text-white text-2xl font-bold text-center flex-1">
          Payment Requests
        </h1>
        <div className="w-6"></div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? "bg-white text-[#3C467B]"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="w-full max-w-md space-y-4">
        {filteredRequests.length === 0 && (
          <p className="text-center text-white opacity-70">No {activeTab} requests</p>
        )}

        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white text-[#3C467B] p-4 rounded-xl shadow-lg border border-gray-200"
          >
            <p className="text-lg font-semibold">{req.employee}</p>
            <p className="text-sm opacity-80">{req.department}</p>
            <p className="mt-1">Type: {req.type}</p>
            <p>Amount: {req.amount} บาท</p>
            <p className="mt-1 text-sm opacity-70">Submitted Date: {req.submittedDate}</p>
            <p
              className={`mt-1 font-medium ${
                req.status === "Pending"
                  ? "text-yellow-600"
                  : req.status === "Approved"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Status: {req.status}
            </p>

            {/* Attachment */}
            <p className="mt-2">
              <button
                onClick={() => openImage(req.receipt)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Receipt
              </button>
            </p>

            {/* Buttons (only for Pending) */}
            {activeTab === "Pending" && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleStatus(req.id, "Approved")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatus(req.id, "Rejected")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative">
            <img src={selectedImage} className="max-w-sm rounded-xl shadow-lg" />
            <button
              onClick={closeImage}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentRequest;
