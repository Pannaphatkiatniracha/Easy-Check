import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

// กำหนด URL ของ Backend API
const API = "http://localhost:5000/api/assign";

// Reusable Card component
const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 text-gray-800 shadow-lg space-y-4">
    {title && <h2 className="text-lg font-bold text-[#3C467B]">{title}</h2>}
    {children}
  </div>
);

// Reusable Header component
const Header = ({ title }) => (
  <div className="flex items-center justify-between py-6 px-4">
    <div className="w-8 flex justify-start">
      <Link to="/home" className="text-white text-2xl hover:text-gray-200 transition">
        <i className="bi bi-chevron-left"></i>
      </Link>
    </div>
    <h1 className="text-xl font-bold text-center flex-1 tracking-wide">{title}</h1>
    <div className="w-8"></div>
  </div>
);

function ApproverManagement() {
  const [tab, setTab] = useState("manage");
  
  const [branches, setBranches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const departments = ["Finance", "IT", "Sales", "Creative"];

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [branchRes, approverRes] = await Promise.all([
        axios.get(`${API}/branches`),
        axios.get(`${API}/`)
      ]);
      setBranches(branchRes.data);
      setApprovers(approverRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่หรือไม่");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!selectedBranch || !selectedDepartment) {
        setCandidates([]);
        setSelectedUser("");
        return;
      }
      try {
        const res = await axios.get(`${API}/candidates?branch=${selectedBranch}&department=${selectedDepartment}`);
        setCandidates(res.data);
        setSelectedUser("");
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, [selectedBranch, selectedDepartment]);

  const handleAssign = async () => {
    if (!selectedUser) {
      alert("กรุณาเลือกพนักงานที่ต้องการแต่งตั้ง");
      return;
    }
    if (!window.confirm("ยืนยันการแต่งตั้งให้พนักงานคนนี้เป็นผู้อนุมัติ (Approver)?")) return;
    try {
      await axios.put(`${API}/${selectedUser}/assign`);
      alert("แต่งตั้งสำเร็จ!");
      setSelectedBranch("");
      setSelectedDepartment("");
      setSelectedUser("");
      loadInitialData();
    } catch (error) {
      console.error("Error assigning approver:", error);
      alert("เกิดข้อผิดพลาดในการแต่งตั้ง");
    }
  };

  const handleRevokeApprover = async (id, name) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะถอดถอนคุณ ${name} ออกจากการเป็นผู้อนุมัติ?`)) return;
    try {
      await axios.put(`${API}/${id}/revoke`);
      alert("ถอดถอนสิทธิ์สำเร็จ!");
      loadInitialData();
    } catch (error) {
      console.error("Error revoking approver:", error);
      alert("เกิดข้อผิดพลาดในการถอดถอน");
    }
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-xl mx-auto min-h-screen">
        <Header title="Approver Management" />

        {/* Tabs */}
        <div className="flex gap-3 mb-6 px-2">
          {["manage", "overview"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition shadow-md ${
                tab === t
                  ? "bg-white text-[#3C467B] scale-105"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {t === "manage" ? "แต่งตั้งผู้อนุมัติ" : "รายชื่อทั้งหมด"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-white/80 flex justify-center items-center gap-2">
            <i className="bi bi-arrow-repeat animate-spin text-xl"></i> กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="px-2 pb-10">

            {/* ---------------- Tab: Manage ---------------- */}
            {tab === "manage" && (
              <div className="space-y-6">
                <Card title="Assign New Approver">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Branch (สาขา) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#636CCB] text-gray-700"
                      >
                        <option value="">-- เลือกสาขา --</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Department (แผนก) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#636CCB] text-gray-700"
                      >
                        <option value="">-- เลือกแผนก --</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Select Employee (เลือกพนักงาน) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#636CCB] text-gray-700"
                        disabled={!selectedBranch || !selectedDepartment}
                      >
                        <option value="">-- เลือกพนักงาน --</option>
                        {candidates.length === 0 && selectedBranch && selectedDepartment ? (
                          <option disabled value="">ไม่มีพนักงานทั่วไปในแผนกนี้</option>
                        ) : (
                          candidates.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.firstname} {u.lastname} (รหัส: {u.id_employee})
                            </option>
                          ))
                        )}
                      </select>
                      {selectedBranch && selectedDepartment && candidates.length === 0 && (
                        <p className="text-xs text-orange-500 mt-1">
                          * พนักงานทุกคนในแผนกนี้เป็น Approver หมดแล้ว หรือยังไม่มีพนักงาน
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleAssign}
                      disabled={!selectedUser}
                      className={`w-full py-3 rounded-xl font-bold shadow-md transition transform ${
                        !selectedUser
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#636CCB] hover:bg-[#4E56A6] hover:scale-[1.02] text-white"
                      }`}
                    >
                      <i className="bi bi-person-check-fill mr-2"></i> บันทึกการแต่งตั้ง
                    </button>
                  </div>
                </Card>
              </div>
            )}

            {/* ---------------- Tab: Overview ---------------- */}
            {tab === "overview" && (
              <div className="space-y-4">

                {/* สรุปจำนวน */}
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl border border-white/20 shadow-sm">
                  <span className="font-semibold text-white">ผู้อนุมัติทั้งหมดในระบบ</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {approvers.length} คน
                  </span>
                </div>

                {/* รายการผู้อนุมัติ */}
                {approvers.length === 0 ? (
                  <Card>
                    <div className="text-center py-6 text-gray-400">ยังไม่มีรายชื่อผู้อนุมัติในระบบ</div>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {approvers.map((a) => (
                      <div
                        key={a.id}
                        className="bg-white rounded-xl p-4 shadow-md border-l-4 border-[#636CCB] hover:shadow-lg transition"
                      >
                        {/* Row 1: Avatar + Info */}
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-11 h-11 rounded-full bg-[#636CCB]/10 flex items-center justify-center text-[#636CCB] font-bold text-lg flex-shrink-0">
                            {a.firstname.charAt(0)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">
                              {a.firstname} {a.lastname}
                            </p>
                            <p className="text-xs text-gray-400">รหัส: {a.id_employee}</p>
                          </div>
                        </div>

                        {/* Row 2: Badges + Revoke button */}
                        <div className="flex items-center justify-between mt-3 gap-2">
                          {/* Badges */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold border border-blue-100">
                              <i className="bi bi-geo-alt-fill"></i>
                              {a.branch_name || "ไม่ระบุสาขา"}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md text-xs font-semibold border border-purple-100">
                              <i className="bi bi-building"></i>
                              {a.department}
                            </span>
                          </div>

                          {/* Revoke Button */}
                          <button
                            onClick={() => handleRevokeApprover(a.id, `${a.firstname} ${a.lastname}`)}
                            className="flex-shrink-0 px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            <i className="bi bi-person-x-fill"></i> ถอดถอน
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default ApproverManagement;