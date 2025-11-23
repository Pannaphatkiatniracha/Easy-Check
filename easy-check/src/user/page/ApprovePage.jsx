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

  // --- ค่าแว่นสายตา ---
  {
    id: 5,
    employee: "อรทัย แซ่ตั้ง",
    department: "ฝ่ายบุคคล",
    amount: 1200,
    type: "ค่าแว่นสายตา (ตรวจสายตา)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },
  {
    id: 6,
    employee: "ทิวา อรุณรุ่ง",
    department: "บัญชี",
    amount: 2500,
    type: "ค่าแว่นสายตา (ค่าเลนส์ + กรอบ)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },

  // --- ค่าเดินทาง ---
  {
    id: 7,
    employee: "ศุภกิตติ์ รัตนกุล",
    department: "Marketing",
    amount: 1800,
    type: "ค่าเดินทางไปพบลูกค้า",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },
  {
    id: 8,
    employee: "วราภรณ์ อินทรักษา",
    department: "Sale",
    amount: 900,
    type: "ค่าเดินทางนอกพื้นที่",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },

  // --- ค่าสวัสดิการครอบครัว ---
  {
    id: 9,
    employee: "ทศพร จิตติวัฒน์",
    department: "Support",
    amount: 5000,
    type: "ค่าสวัสดิการ (คลอดบุตร)",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  },

  // --- ค่าอบรม & พัฒนา ---
  {
    id: 10,
    employee: "กานต์ธีรา มณีโชติ",
    department: "Operation",
    amount: 3100,
    type: "ค่าอบรม / คอร์สพัฒนา",
    status: "Pending",
    receipt: "https://i.pinimg.com/736x/e6/ea/c6/e6eac67cfe131915426ba32b14331a27.jpg",
  }
];

function ApprovePage() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const updateStatus = (ids, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        ids.includes(req.id) ? { ...req, status: newStatus } : req
      )
    );
    setSelectedIds([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">อนุมัติการเบิกเงิน</h1>

      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => updateStatus(selectedIds, "Approved")}
          >
            อนุมัติ
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => updateStatus(selectedIds, "Rejected")}
          >
            ปฏิเสธ
          </button>
        </div>
      )}

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  e.target.checked
                    ? setSelectedIds(requests.map((r) => r.id))
                    : setSelectedIds([])
                }
                checked={selectedIds.length === requests.length}
              />
            </th>
            <th className="px-4 py-2">พนักงาน</th>
            <th className="px-4 py-2">แผนก</th>
            <th className="px-4 py-2">ประเภท</th>
            <th className="px-4 py-2">จำนวนเงิน</th>
            <th className="px-4 py-2">สถานะ</th>
            <th className="px-4 py-2">ใบเสร็จ</th>
            <th className="px-4 py-2">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b">
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(req.id)}
                  onChange={() => toggleSelect(req.id)}
                />
              </td>

              <td className="px-4 py-2">{req.employee}</td>
              <td className="px-4 py-2">{req.department}</td>
              <td className="px-4 py-2">{req.type}</td>
              <td className="px-4 py-2">{req.amount.toLocaleString()}</td>

              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    req.status === "Pending"
                      ? "bg-yellow-500"
                      : req.status === "Approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {req.status}
                </span>
              </td>

              <td className="px-4 py-2">
                <a href={req.receipt} target="_blank" rel="noreferrer">
                  ดูใบเสร็จ
                </a>
              </td>

              <td className="px-4 py-2 flex gap-2">
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => updateStatus([req.id], "Approved")}
                >
                  อนุมัติ
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => updateStatus([req.id], "Rejected")}
                >
                  ปฏิเสธ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApprovePage;
