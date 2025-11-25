// ApproverManagement.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// MOCK DATA
const companies = [
  { id: "A", name: "Company A" },
  { id: "B", name: "Company B" },
];

const provinces = {
  A: ["Bangkok", "Chiang Mai", "Phuket"],
  B: ["Pathum Thani", "Khon Kaen", "Chonburi"],
};

const departments = ["Project Manager", "Product Manager", "IT", "Marketing", "Finance"];

const users = [
  { id: 1, name: "ปัณณพรรธน์ เกียรตินิรชา" },
  { id: 2, name: "ฐิติฉัตร ศิริบุตร" },
  { id: 3, name: "ภทรพร แซ่ลี้" },
  { id: 4, name: "สราศินีย์ บุญมา" },
];

// Mock DB
let mockApprovers = [];
let mockRequests = [
  {
    id: 101,
    user: "ภทรพร แซ่ลี้",
    company: "Company A",
    province: "Bangkok",
    department: "IT",
    status: "Pending",
  },
  {
    id: 102,
    user: "สราศินีย์ บุญมา",
    company: "Company B",
    province: "Khon Kaen",
    department: "Marketing",
    status: "Pending",
  },
];

function ApproverManagement() {
  const [tab, setTab] = useState("manage");

  // Approver management state
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [approvers, setApprovers] = useState([]);

  // Requests
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setApprovers([...mockApprovers]);
    setRequests([...mockRequests]);
  }, []);

  // Assign new approver
  const handleAssign = () => {
    if (!selectedCompany || !selectedProvince || !selectedDepartment || !selectedUser) return;

    const newItem = {
      id: Date.now(),
      company: companies.find((c) => c.id === selectedCompany).name,
      province: selectedProvince,
      department: selectedDepartment,
      user: users.find((u) => u.id === parseInt(selectedUser)).name,
    };

    mockApprovers.push(newItem);
    setApprovers([...mockApprovers]);

    setSelectedCompany("");
    setSelectedProvince("");
    setSelectedDepartment("");
    setSelectedUser("");
  };

  const handleDeleteApprover = (id) => {
    mockApprovers = mockApprovers.filter((x) => x.id !== id);
    setApprovers([...mockApprovers]);
  };

  // Approve Request
  const handleApprove = (id) => {
    const req = mockRequests.find((x) => x.id === id);

    mockApprovers.push({
      id: Date.now(),
      company: req.company,
      province: req.province,
      department: req.department,
      user: req.user,
    });

    mockRequests = mockRequests.filter((x) => x.id !== id);

    setRequests([...mockRequests]);
    setApprovers([...mockApprovers]);
  };

  // Reject Request
  const handleReject = (id) => {
    mockRequests = mockRequests.filter((x) => x.id !== id);
    setRequests([...mockRequests]);
  };

  return (
    <div className="min-h-screen bg-[#3C467B] p-6 text-white">

      {/* Header */}
      <div className="flex items-center mb-6">
        {/* ใช้ Link แทน a */}
        <Link to="/home" className="text-white text-2xl">
          <i className="bi bi-chevron-left"></i>
        </Link>
        <h1 className="ml-4 text-2xl font-bold">Approver Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("manage")}
          className={`px-4 py-2 rounded-lg ${tab === "manage" ? "bg-white text-black" : "bg-[#606AAA]"}`}
        >
          Manage Approvers
        </button>

        <button
          onClick={() => setTab("requests")}
          className={`px-4 py-2 rounded-lg ${tab === "requests" ? "bg-white text-black" : "bg-[#606AAA]"}`}
        >
          Approver Requests
        </button>
      </div>

      {/* Manage Tab */}
      {tab === "manage" && (
        <div className="space-y-6">
          {/* Form */}
          <div className="p-4 bg-white text-gray-800 rounded-xl shadow-md space-y-4">
            <h2 className="text-lg font-bold mb-4">Assign Approver</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Company */}
              <select
                className="p-2 border rounded"
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setSelectedProvince("");
                }}
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Province */}
              <select
                className="p-2 border rounded"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disabled={!selectedCompany}
              >
                <option value="">Select Province</option>
                {selectedCompany && provinces[selectedCompany].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              {/* Department */}
              <select
                className="p-2 border rounded"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>

              {/* User */}
              <select
                className="p-2 border rounded"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssign}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              + Add Approver
            </button>
          </div>

          {/* Approver List */}
          <div className="p-4 bg-white text-gray-800 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-4">Current Approvers</h2>

            {approvers.length === 0 && <p className="text-gray-500">No approvers yet.</p>}

            <div className="space-y-3">
              {approvers.map((a) => (
                <div key={a.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <div className="font-bold">{a.user}</div>
                    <div className="text-sm text-gray-600">{a.company} — {a.province} — {a.department}</div>
                  </div>

                  <button
                    onClick={() => handleDeleteApprover(a.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {tab === "requests" && (
        <div className="p-4 bg-white text-gray-800 rounded-xl shadow-md space-y-4">
          <h2 className="text-lg font-bold mb-4">Pending Requests</h2>

          {requests.length === 0 && <p className="text-gray-500">No requests pending.</p>}

          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                <div>
                  <div className="font-bold">{r.user}</div>
                  <div className="text-sm text-gray-600">{r.company} — {r.province} — {r.department}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(r.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApproverManagement;
