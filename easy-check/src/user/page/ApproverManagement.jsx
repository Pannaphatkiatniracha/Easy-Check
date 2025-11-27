import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Reusable Card component
const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 text-gray-800 shadow space-y-3">
    {title && <h2 className="text-lg font-bold">{title}</h2>}
    {children}
  </div>
);

// Reusable Header component
const Header = ({ title }) => (
  <div className="flex items-center justify-between py-6 px-4">
    <Link to="/home" className="text-white text-2xl">
      <i className="bi bi-chevron-left"></i>
    </Link>
    <h1 className="text-xl font-semibold text-center flex-1">{title}</h1>
    <div className="w-6"></div>
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const companies = [
    { id: "A", name: "Company A" },
    { id: "B", name: "Company B" },
  ];

  const provinces = {
    A: ["Bangkok", "Chiang Mai", "Phuket"],
    B: ["Pathum Thani", "Khon Kaen", "Chonburi"],
  };

  const departments = ["Project Manager", "Product Manager", "IT", "Marketing", "Finance"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users");
      const employees = await res.json();
      
      setUsers(employees);
      
      // ดึงข้อมูลผู้อนุมัติจาก MockAPI
      const approversFromAPI = employees.filter(emp => emp.isApprover === true);
      setApprovers(approversFromAPI);
      
      // ดึงคำขอกำหนดผู้อนุมัติจาก MockAPI
      const requestsFromAPI = employees.filter(emp => emp.approvalStatus === "pending");
      setRequests(requestsFromAPI);
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedCompany || !selectedProvince || !selectedDepartment || !selectedUser) return;
    
    try {
      const user = users.find((u) => u.id === selectedUser);
      
      // อัปเดตข้อมูลใน MockAPI
      await fetch(`https://68fbd77794ec960660275293.mockapi.io/users/${selectedUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isApprover: true,
          company: companies.find((c) => c.id === selectedCompany).name,
          province: selectedProvince,
          department: selectedDepartment,
          role: "approver"
        })
      });
      
      // โหลดข้อมูลใหม่
      loadData();
      setSelectedCompany("");
      setSelectedProvince("");
      setSelectedDepartment("");
      setSelectedUser("");
      
    } catch (error) {
      console.error("Error assigning approver:", error);
    }
  };

  const handleDeleteApprover = async (id) => {
    try {
      // อัปเดตใน MockAPI
      await fetch(`https://68fbd77794ec960660275293.mockapi.io/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isApprover: false,
          role: "user"
        })
      });
      
      // โหลดข้อมูลใหม่
      loadData();
    } catch (error) {
      console.error("Error deleting approver:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      // อัปเดตใน MockAPI
      await fetch(`https://68fbd77794ec960660275293.mockapi.io/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isApprover: true,
          approvalStatus: "approved"
        })
      });
      
      // โหลดข้อมูลใหม่
      loadData();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      // อัปเดตใน MockAPI
      await fetch(`https://68fbd77794ec960660275293.mockapi.io/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalStatus: "rejected"
        })
      });
      
      // โหลดข้อมูลใหม่
      loadData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="app-container min-h-screen bg-[#3C467B] flex flex-col items-center justify-center">
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
    <div className="app-container min-h-screen bg-[#3C467B] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto min-h-screen">
        {/* Header */}
        <Header title="Approver Management" />

        {/* Tabs */}
        <div className="flex gap-2 mb-4 px-4">
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
          <div className="space-y-4 px-4">
            <Card title="Assign Approver">
              <select value={selectedCompany} onChange={(e) => { setSelectedCompany(e.target.value); setSelectedProvince(""); }} className="w-full px-3 py-2 rounded-lg border border-gray-300">
                <option value="">Select Company</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} disabled={!selectedCompany} className="w-full px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50">
                <option value="">Select Province</option>
                {selectedCompany && provinces[selectedCompany].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300">
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300">
                <option value="">Select User</option>
                {users.filter(u => !u.isApprover).map((u) => (
                  <option key={u.id} value={u.id}>{u.name} (ID: {u.userid})</option>
                ))}
              </select>
              <button onClick={handleAssign} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition">Add Approver</button>
            </Card>

            <Card title="Current Approvers">
              {approvers.length === 0 ? <div className="text-center py-6 text-gray-500">No approvers yet</div> : (
                <div className="space-y-2">
                  {approvers.map((a) => (
                    <div key={a.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start shadow-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{a.name}</div>
                        <div className="text-xs text-gray-500 mb-1">ID: {a.userid}</div>
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
          <div className="px-4">
            <Card title="Approvers Overview">
              {approvers.length === 0 ? <div className="text-center py-6 text-gray-500">No approvers to show</div> : (
                <div className="space-y-2">
                  {approvers.map((a) => (
                    <div key={a.id} className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between">
                      <div>
                        <div className="font-semibold text-sm">{a.name}</div>
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
          <div className="px-4">
            <Card title="Approver Requests">
              {requests.length === 0 ? <div className="text-center py-6 text-gray-500">No requests</div> : (
                <div className="space-y-2">
                  {requests.map((r) => (
                    <div key={r.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start shadow-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{r.name}</div>
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
    </div>
  );
}

export default ApproverManagement;