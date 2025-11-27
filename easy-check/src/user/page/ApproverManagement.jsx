import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap"; // ใช้ Button แบบตัวอย่าง

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
  { id: 101, user: "สมหญิง", userId: 690004, company: "Company A", province: "Bangkok", department: "IT", status: "Pending" },
  { id: 102, user: "สมชาย", userId: 690005, company: "Company B", province: "Khon Kaen", department: "Marketing", status: "Pending" },
];

// Reusable Card component
const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 text-gray-800 shadow space-y-3">
    {title && <h2 className="text-lg font-bold">{title}</h2>}
    {children}
  </div>
);

// Header component แบบไอคอนกลับหน้าและหัวข้ออยู่บรรทัดเดียว
const Header = ({ title }) => (
  <div className="w-full max-w-md flex items-center mb-4">
    <Link to="/home" className="text-decoration-none mr-3">
      <Button variant="link" className="p-0">
        <i className="bi bi-chevron-left text-white text-2xl"></i>
      </Button>
    </Link>
    <h1 className="text-xl font-semibold text-white flex-grow text-center">{title}</h1>
    <div style={{ width: '2rem' }} /> {/* Spacer ขวา */}
  </div>
);

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
    mockApprovers.push({ id: Date.now(), company: req.company, province: req.province, department: req.department, user: req.user, userId: req.userId });
    mockRequests = mockRequests.filter((x) => x.id !== id);
    setRequests([...mockRequests]);
    setApprovers([...mockApprovers]);
  };

  const handleReject = (id) => {
    mockRequests = mockRequests.filter((x) => x.id !== id);
    setRequests([...mockRequests]);
  };

  return (
    <div className="app-container min-h-screen bg-[#3C467B] p-4 flex flex-col items-center font-inter text-white">
      {/* Header */}
      <Header title="Approver Management" />

      {/* Tabs */}
      <div className="flex gap-2 mb-4 w-full max-w-md px-0">
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
        <div className="space-y-4 w-full max-w-md">
          <Card title="Assign Approver">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800"
            >
              <option value="">Select Company</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 mt-2"
            >
              <option value="">Select Province</option>
              {/* รวมทุกจังหวัดจากทุกบริษัท */}
              {Object.values(provinces).flat().map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 mt-2"
            >
              <option value="">Select Department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 mt-2"
            >
              <option value="">Select User</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>

            <button
              onClick={handleAssign}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition mt-2"
            >
              Add Approver
            </button>
          </Card>

          <Card title="Current Approvers">
            {approvers.length === 0 ? <div className="text-center py-6 text-gray-500">No approvers yet</div> : (
              <div className="space-y-2">
                {approvers.map((a) => (
                  <div key={a.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start shadow-sm text-gray-800">
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
          </Card>
        </div>
      )}

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="w-full max-w-md">
          <Card title="Approvers Overview">
            {approvers.length === 0 ? <div className="text-center py-6 text-gray-500">No approvers to show</div> : (
              <div className="space-y-2">
                {approvers.map((a) => (
                  <div key={a.id} className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between text-gray-800">
                    <div>
                      <div className="font-semibold text-sm">{a.user}</div>
                      <div className="text-xs text-gray-500">{a.company} | {a.province} | {a.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Requests Tab */}
      {tab === "requests" && (
        <div className="w-full max-w-md">
          <Card title="Approver Requests">
            {requests.length === 0 ? <div className="text-center py-6 text-gray-500">No requests</div> : (
              <div className="space-y-2">
                {requests.map((r) => (
                  <div key={r.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start shadow-sm text-gray-800">
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
          </Card>
        </div>
      )}
    </div>
  );
}

export default ApproverManagement;
