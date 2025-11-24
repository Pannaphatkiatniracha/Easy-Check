import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";

const initialRequests = [
  // --- ค่ารักษาพยาบาล ---
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

  // --- ค่าทันตกรรม ---
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
    employee: "นันทวัฒน์ พงษ์ดี",
    department: "ไอที",
    amount: 900,
    type: "ค่าทันตกรรม (ขูดหินปูน)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },
];

function PaymentRequest() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const updateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">คำขอเบิกสวัสดิการ</h2>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="border p-4 rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{req.employee}</p>
                <p className="text-sm text-gray-600">{req.department}</p>
                <p className="mt-2">ประเภท: {req.type}</p>
                <p>จำนวนเงิน: {req.amount} บาท</p>
                <p className="mt-1 font-medium">สถานะ: {req.status}</p>
              </div>

              <img
                src={req.receipt}
                alt="receipt"
                className="w-24 h-24 object-cover cursor-pointer rounded"
                onClick={() => setSelectedReceipt(req.receipt)}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="success" onClick={() => updateStatus(req.id, "Approved")}>
                อนุมัติ
              </Button>
              <Button variant="danger" onClick={() => updateStatus(req.id, "Rejected")}>
                ปฏิเสธ
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" onClick={() => setSelectedReceipt(null)}>
          <img src={selectedReceipt} className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg" />
        </div>
      )}

      <div className="mt-6">
        <Link to="/home">
          <Button variant="secondary">กลับหน้าหลัก</Button>
        </Link>
      </div>
    </div>
  );
}

export default PaymentRequest;