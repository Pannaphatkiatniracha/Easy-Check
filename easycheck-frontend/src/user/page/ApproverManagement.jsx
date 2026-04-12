import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

// กำหนด URL ของ Backend API ที่เราเพิ่งสร้าง
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
    <Link to="/home" className="text-white text-2xl hover:text-gray-200 transition">
      <i className="bi bi-chevron-left"></i>
    </Link>
    <h1 className="text-xl font-bold text-center flex-1 tracking-wide">{title}</h1>
    <div className="w-6"></div>
  </div>
);

function ApproverManagement() {
  const [tab, setTab] = useState("manage");
  
  const [branches, setBranches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // อิงจาก ENUM department ในฐานข้อมูล Users ของคุณ
  const departments = ["Finance", "IT", "Sales", "Creative"];

  // โหลดรายชื่อสาขา และรายชื่อ Approver ในระบบทั้งหมด
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

  // เมื่อเปลี่ยนสาขาหรือแผนก ให้ไปดึงรายชื่อพนักงานทั่วไป (Role 1) ในกลุ่มนั้นมาเป็น Candidate
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
        setSelectedUser(""); // รีเซ็ตคนที่เลือกไว้
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    
    fetchCandidates();
  }, [selectedBranch, selectedDepartment]);

  // แต่งตั้งผู้อนุมัติ (Assign)
  const handleAssign = async () => {
    if (!selectedUser) {
      alert("กรุณาเลือกพนักงานที่ต้องการแต่งตั้ง");
      return;
    }

    if (!window.confirm("ยืนยันการแต่งตั้งให้พนักงานคนนี้เป็นผู้อนุมัติ (Approver)?")) return;

    try {
      await axios.put(`${API}/${selectedUser}/assign`);
      alert("แต่งตั้งสำเร็จ!");
      
      // ล้างค่าฟอร์ม และดึงข้อมูลใหม่
      setSelectedBranch("");
      setSelectedDepartment("");
      setSelectedUser("");
      loadInitialData();
    } catch (error) {
      console.error("Error assigning approver:", error);
      alert("เกิดข้อผิดพลาดในการแต่งตั้ง");
    }
  };

  // ถอดถอนผู้อนุมัติ (Revoke)
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

        {/* Tabs สำหรับเปลี่ยนหน้าจอ */}
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
              {t === "manage" ? "แต่งตั้งผู้อนุมัติ" : "รายชื่อผู้อนุมัติทั้งหมด"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-white/80 animate-pulse flex justify-center items-center gap-2">
            <i className="bi bi-arrow-repeat animate-spin text-xl"></i> กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="px-2 pb-10">
            
            {/* ---------------- แท็บ: จัดการ/แต่งตั้ง (Manage) ---------------- */}
            {tab === "manage" && (
              <div className="space-y-6 animate-fade-in">
                <Card title="Assign New Approver">
                  <div className="space-y-4">
                    
                    {/* เลือกสาขา */}
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

                    {/* เลือกแผนก */}
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

                    {/* เลือกพนักงาน */}
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

                    {/* ปุ่มบันทึก */}
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

            {/* ---------------- แท็บ: ภาพรวม/รายชื่อทั้งหมด (Overview) ---------------- */}
            {tab === "overview" && (
              <div className="space-y-4 animate-fade-in">
                
                {/* สรุปจำนวน */}
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl border border-white/20 shadow-sm">
                  <span className="font-semibold text-white">ผู้อนุมัติทั้งหมดในระบบ</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {approvers.length} คน
                  </span>
                </div>

                {/* รายการผู้อนุมัติ */}
                {approvers.length === 0 ? (
                  <Card><div className="text-center py-6 text-gray-400">ยังไม่มีรายชื่อผู้อนุมัติในระบบ</div></Card>
                ) : (
                  <div className="space-y-3">
                    {approvers.map((a) => (
                      <div 
                        key={a.id} 
                        className="bg-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#636CCB] transition hover:shadow-lg"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-[#636CCB]/10 flex items-center justify-center text-[#636CCB] font-bold text-xl flex-shrink-0">
                            {a.firstname.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-800 truncate text-base">
                              {a.firstname} {a.lastname}
                            </h3>
                            <div className="text-sm text-gray-500 mb-1">
                              รหัสพนักงาน: {a.id_employee}
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs mt-1">
                              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-semibold border border-blue-100">
                                <i className="bi bi-geo-alt-fill mr-1"></i> {a.branch_name || "ไม่ระบุสาขา"}
                              </span>
                              <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-semibold border border-purple-100">
                                <i className="bi bi-building mr-1"></i> {a.department}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRevokeApprover(a.id, `${a.firstname} ${a.lastname}`)} 
                          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
                        >
                          <i className="bi bi-person-x-fill text-lg"></i> ถอดถอน
                        </button>
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