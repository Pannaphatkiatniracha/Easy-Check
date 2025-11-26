import React, { useState, useEffect } from "react";

// Mock Link component (replace with actual react-router-dom Link in your app)
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);

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

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [approvers, setApprovers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setApprovers([...mockApprovers]);
    setRequests([...mockRequests]);
  }, []);

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

  const handleReject = (id) => {
    mockRequests = mockRequests.filter((x) => x.id !== id);
    setRequests([...mockRequests]);
  };

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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("manage")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
              tab === "manage" ? "bg-white text-[#3C467B] shadow-lg" : "bg-white/10 text-white/70"
            }`}
          >
            Manage Approvers
          </button>

          <button
            onClick={() => setTab("requests")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
              tab === "requests" ? "bg-white text-[#3C467B] shadow-lg" : "bg-white/10 text-white/70"
            }`}
          >
            Requests
          </button>
        </div>

        {/* Manage Tab */}
        {tab === "manage" && (
          <div className="space-y-4 pb-6">
            {/* Assign Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                Assign Approver
              </h2>
              <div className="space-y-3">
                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                  <select
                    className="w-full p-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-800 shadow-sm hover:border-[#3C467B]"
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
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Province</label>
                  <select
                    className="w-full p-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-800 shadow-sm hover:border-[#3C467B]"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    disabled={!selectedCompany}
                  >
                    <option value="">Select Province</option>
                    {selectedCompany && provinces[selectedCompany].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select
                    className="w-full p-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-800 shadow-sm hover:border-[#3C467B]"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* User */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">User</label>
                  <select
                    className="w-full p-3 bg-gray-50 border-2 border-gray-300 rounded-xl text-gray-800 shadow-sm hover:border-[#3C467B]"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleAssign}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-medium mt-5 shadow-lg"
              >
                + Add Approver
              </button>
            </div>

            {/* Approver List */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Current Approvers</h2>
              {approvers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No approvers yet</p>
              ) : (
                <div className="space-y-3">
                  {approvers.map((a) => (
                    <div key={a.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-800">{a.user}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {a.company} | {a.province} | {a.department}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteApprover(a.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {tab === "requests" && (
          <div className="space-y-4 pb-6">
            {/* Requests List styled like Manage Approvers */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-5">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Pending Requests</h2>
              {requests.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No requests pending</p>
              ) : (
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div key={r.id} className="bg-amber-50 rounded-xl p-4 border border-amber-200 shadow-sm">
                      <div className="font-semibold text-gray-800 mb-1">{r.user}</div>
                      <div className="text-xs text-gray-600 mb-3">
                        {r.company} | {r.province} | {r.department}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApproverManagement;
