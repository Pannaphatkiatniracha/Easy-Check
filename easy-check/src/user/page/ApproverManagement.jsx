import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


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
  { id: 670000, name: "ปัณณพรรธน์ เกียรตินิรชา" },
  { id: 670001, name: "ฐิติฉัตร ศิริบุตร" },
  { id: 670002, name: "ภทรพร แซ่ลี้" },
  { id: 670003, name: "สราศินีย์ บุญมา" },
];


let mockApprovers = [];
let mockRequests = [
  {
    id: 101,
    user: "คิมแทย็อน",
    userId: 690000,
    company: "Company A",
    province: "Bangkok",
    department: "IT",
    status: "Pending",
  },
  {
    id: 102,
    user: "สเตฟานี ยังฮวัง",
    userId: 690001,
    company: "Company B",
    province: "Khon Kaen",
    department: "Marketing",
    status: "Pending",
  },
];

function ApproverManagement() {
  const [tab, setTab] = useState("manage");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [approvers, setApprovers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filterCompany, setFilterCompany] = useState("");
  const [filterProvince, setFilterProvince] = useState("");

  useEffect(() => {
    setApprovers([...mockApprovers]);
    setRequests([...mockRequests]);
  }, []);

  const handleAssign = () => {
    if (!selectedCompany || !selectedProvince || !selectedDepartment || !selectedUser) return;
    const user = users.find((u) => u.id === parseInt(selectedUser));
    const newItem = {
      id: Date.now(),
      company: companies.find((c) => c.id === selectedCompany).name,
      province: selectedProvince,
      department: selectedDepartment,
      user: user.name,
      userId: user.id,
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

  const handleApprove = (id) => {
    const req = mockRequests.find((x) => x.id === id);
    mockApprovers.push({
      id: Date.now(),
      company: req.company,
      province: req.province,
      department: req.department,
      user: req.user,
      userId: req.userId,
    });
    mockRequests = mockRequests.filter((x) => x.id !== id);
    setRequests([...mockRequests]);
    setApprovers([...mockApprovers]);
  };

  const handleReject = (id) => {
    mockRequests = mockRequests.filter((x) => x.id !== id);
    setRequests([...mockRequests]);
  };

  const filteredApprovers = approvers.filter((a) => {
    if (filterCompany && a.company !== filterCompany) return false;
    if (filterProvince && a.province !== filterProvince) return false;
    return true;
  });

  return (
    <div className="app-container min-h-screen bg-[#3C467B] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <Link to="/home" className="text-white hover:bg-white/10 p-2 rounded-lg transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1">Approver Management</h1>
          <div className="w-6"></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["manage", "overview", "requests"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                tab === t ? "bg-white text-[#3C467B] shadow" : "bg-white/20 text-white/80"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Manage Tab */}
        {tab === "manage" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-gray-800 space-y-3 shadow">
              <h2 className="text-lg font-bold">➕ Assign Approver</h2>
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setSelectedProvince("");
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disabled={!selectedCompany}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
              >
                <option value="">Select Province</option>
                {selectedCompany && provinces[selectedCompany].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              >
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              >
                <option value="">Select User</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>

              <button
                onClick={handleAssign}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition"
              >
                + Add Approver
              </button>
            </div>

            {/* Approver List */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-gray-800 shadow">
              <h2 className="text-lg font-bold mb-3">👥 Current Approvers</h2>
              {approvers.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>No approvers yet
                </div>
              ) : (
                <div className="space-y-2">
                  {approvers.map((a) => (
                    <div key={a.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start shadow-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{a.user}</div>
                        <div className="text-xs text-gray-500 mb-1">ID: {a.userId}</div>
                        <div className="text-gray-600 text-xs">{a.company} | {a.province}</div>
                        <div className="text-gray-600 text-xs">{a.department}</div>
                      </div>
                      <button onClick={() => handleDeleteApprover(a.id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-gray-800 shadow space-y-3">
            <h2 className="text-lg font-bold">📊 Approvers Overview</h2>
            {approvers.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No approvers to show</div>
            ) : (
              <div className="space-y-2">
                {approvers.map((a) => (
                  <div key={a.id} className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between">
                    <div>
                      <div className="font-semibold text-sm">{a.user}</div>
                      <div className="text-xs text-gray-500">{a.company} | {a.province} | {a.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {tab === "requests" && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-gray-800 shadow space-y-3">
            <h2 className="text-lg font-bold">📩 Approver Requests</h2>
            {requests.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No requests</div>
            ) : (
              <div className="space-y-2">
                {requests.map((r) => (
                  <div key={r.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start shadow-sm">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{r.user}</div>
                      <div className="text-xs text-gray-500 mb-1">{r.company} | {r.province}</div>
                      <div className="text-gray-600 text-xs">{r.department}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleApprove(r.id)} className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs">Approve</button>
                      <button onClick={() => handleReject(r.id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApproverManagement;
