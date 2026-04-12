import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const API = "http://localhost:5000/leave-approve";

const LeaveRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "", // ตรงกับ id_employee ใน DB
    leaveStart: "",
    leaveEnd: "",
    leaveReasons: [], 
    otherReasonText: "",
    evidenceFile: null,
    evidencePreview: null,
  });

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState([]);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0); 

  const leaveOptions = [
    "Sick Leave",
    "Personal Leave",
    "Vacation Leave",
    "Maternity Leave",
    "Wedding Leave",
    "Religious Leave",
    "Other",
  ];

  const today = useMemo(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().split("T")[0];
  }, []);

  // โหลดข้อมูลผู้ใช้ (ดึง id_employee)
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    let storedUser = {};
    try {
      storedUser = JSON.parse(rawUser || "null") || {};
    } catch (error) {
      storedUser = {};
    }

    const employeeId =
      storedUser?.id_employee ||
      storedUser?.employeeId ||
      localStorage.getItem("id_employee") ||
      "";

    setFormData((prev) => ({
      ...prev,
      userId: employeeId,
      leaveStart: today,
      leaveEnd: today,
    }));
  }, [today]);

  // โหลดสิทธิ์วันลา
  useEffect(() => {
    const fetchBalance = async () => {
      if (!formData.userId) return;

      try {
        setBalanceLoading(true);
        const res = await axios.get(`${API}/balance`, {
          params: { userId: formData.userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        setBalance(res.data.balance || []);
      } catch (error) {
        console.error("โหลด leave balance ไม่สำเร็จ:", error);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [formData.userId]);

  // คำนวณวันลาทำงานจริง (ไม่นับ ส.-อา.)
  useEffect(() => {
    if (formData.leaveStart && formData.leaveEnd) {
      const start = new Date(formData.leaveStart);
      const end = new Date(formData.leaveEnd);
      
      if (start > end) {
        setCalculatedDays(0);
        return;
      }

      let count = 0;
      const current = new Date(start);

      while (current <= end) {
        const day = current.getDay(); // 0=Sun, 6=Sat
        if (day !== 0 && day !== 6) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      setCalculatedDays(count);
    }
  }, [formData.leaveStart, formData.leaveEnd]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "leaveStart" && newData.leaveEnd && value > newData.leaveEnd) {
        newData.leaveEnd = value;
      }
      return newData;
    });
  };

  // เลือกการลาได้แค่ 1 อย่าง
  const handleReasonChange = (reason) => {
    if (formData.leaveReasons.includes(reason)) {
      setFormData((prev) => ({
        ...prev,
        leaveReasons: [],
        otherReasonText: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        leaveReasons: [reason],
        otherReasonText: reason !== "Other" ? "" : prev.otherReasonText,
      }));
    }
  };

  const handleEvidenceUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      alert("กรุณาอัปโหลดไฟล์ JPG, JPEG, PNG หรือ PDF");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      evidenceFile: file,
      evidencePreview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
  };

  const selectedMainReason = useMemo(() => formData.leaveReasons[0] || null, [formData.leaveReasons]);

  const selectedPolicy = useMemo(() => {
    const reasonToCode = {
      "Sick Leave": "SICK",
      "Personal Leave": "PERSONAL",
      "Vacation Leave": "VACATION",
      "Maternity Leave": "MATERNITY",
      "Wedding Leave": "WEDDING",
      "Religious Leave": "RELIGIOUS",
      "Other": "OTHER",
    };
    const code = reasonToCode[selectedMainReason];
    return balance.find((item) => item.leaveCode === code);
  }, [selectedMainReason, balance]);

  const handleFileLeave = async () => {
    if (!formData.userId) return alert("ไม่พบข้อมูลพนักงาน กรุณา Login ใหม่");
    if (!formData.leaveStart || !formData.leaveEnd) return alert("กรุณาเลือกวันเริ่มลาและวันสิ้นสุดลา");
    if (formData.leaveStart < today) return alert("ไม่สามารถยื่นลาย้อนหลังได้");
    if (formData.leaveStart > formData.leaveEnd) return alert("วันเริ่มลาต้องไม่เกินวันสิ้นสุดลา");
    if (calculatedDays <= 0) return alert("วันที่เลือกตกวันหยุด (เสาร์-อาทิตย์) ทั้งหมด กรุณาเลือกวันทำงานปกติ");
    if (formData.leaveReasons.length === 0) return alert("กรุณาเลือกประเภทการลา");
    if (formData.leaveReasons.includes("Other") && !formData.otherReasonText.trim()) return alert("กรุณาระบุเหตุผลเพิ่มเติมสำหรับ Other");
    if (selectedPolicy?.requireEvidence && !formData.evidenceFile) return alert(`การลา ${selectedPolicy.leaveName} ต้องแนบหลักฐาน`);

    const confirmMsg = `ยืนยันการยื่น ${selectedMainReason} จำนวน ${calculatedDays} วัน ใช่หรือไม่?`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("userId", formData.userId);
      data.append("leaveStart", formData.leaveStart);
      data.append("leaveEnd", formData.leaveEnd);
      data.append("leaveReasons", JSON.stringify(formData.leaveReasons));
      data.append("otherReasonText", formData.otherReasonText || "");

      if (formData.evidenceFile) {
        data.append("evidence", formData.evidenceFile);
      }

      const response = await axios.post(`${API}/request`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });

      alert(response.data?.message || "ยื่นคำขอลางานสำเร็จ");
      navigate(-1);
    } catch (err) {
      console.error("submit leave error =", err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="flex items-center justify-center relative mb-2">
          <Link to="/home" className="absolute left-0 text-white text-2xl">
            <i className="bi bi-chevron-left"></i>
          </Link>
          <h2 className="text-xl font-bold text-white text-center">LEAVE REQUEST</h2>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
          <div className="text-sm">
            <div>
              <span className="font-semibold">ID พนักงาน:</span> {formData.userId || "-"}
            </div>
            <div className="mt-2 font-semibold border-b border-white/20 pb-1 mb-2">สิทธิ์ลาประจำปี</div>

            {balanceLoading ? (
              <div className="text-white/70 text-sm mt-2"><i className="bi bi-arrow-repeat animate-spin"></i> กำลังโหลด...</div>
            ) : balance.length === 0 ? (
              <div className="text-white/70 text-sm mt-2">ไม่พบข้อมูลสิทธิ์ลา</div>
            ) : (
              <div className="mt-2 space-y-2 text-sm max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {balance.map((item) => (
                  <div key={item.leaveCode} className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="font-semibold">{item.leaveName}</div>
                    <div className="flex justify-between mt-1 text-white/80">
                      <span>สิทธิ์ต่อปี: {item.maxDays} วัน</span>
                      <span>คงเหลือ: <strong className="text-green-400">{item.remainingDays}</strong> วัน</span>
                    </div>
                    {item.requireEvidence && <div className="text-yellow-300 text-xs mt-1">* จำเป็นต้องแนบหลักฐาน</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold text-[#FFFFFF] mb-1">Start Date <span className="text-red-400">*</span></label>
              <input type="date" name="leaveStart" min={today} value={formData.leaveStart} onChange={handleDateChange} className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:border-[#636CCB] bg-white/20 text-white" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-[#FFFFFF] mb-1">End Date <span className="text-red-400">*</span></label>
              <input type="date" name="leaveEnd" min={formData.leaveStart || today} value={formData.leaveEnd} onChange={handleDateChange} className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:border-[#636CCB] bg-white/20 text-white" />
            </div>
          </div>
          
          <div className="bg-[#636CCB]/30 rounded-xl p-3 text-white text-center border border-[#636CCB]">
            จำนวนวันลาทำงานจริง (ไม่รวม ส-อา): <strong className="text-xl mx-2 text-green-400">{calculatedDays}</strong> วัน
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-3 text-[#FFFFFF]">Leave Reason <span className="text-red-400">*</span> <span className="text-xs font-normal text-white/70">(เลือก 1 รายการ)</span></label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaveOptions.map((reason) => (
              <label key={reason} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer shadow-md transition-transform transform hover:scale-105 ${formData.leaveReasons.includes(reason) ? "bg-[#FFFFFF] border-white text-[#3C467B]" : "bg-white/10 border-white text-white hover:border-[#636CCB]"}`}>
                <span className="font-medium">{reason}</span>
                <input type="checkbox" className="hidden" checked={formData.leaveReasons.includes(reason)} onChange={() => handleReasonChange(reason)} />
                {formData.leaveReasons.includes(reason) && <i className="bi bi-check-circle-fill text-[#3C467B]"></i>}
              </label>
            ))}
          </div>

          {formData.leaveReasons.includes("Other") && (
            <div className="mt-4 animate-fade-in">
              <label className="block font-semibold mb-2 text-[#FFFFFF]">Reason (ระบุเหตุผล) <span className="text-red-400">*</span></label>
              <input type="text" value={formData.otherReasonText} onChange={(e) => setFormData((prev) => ({ ...prev, otherReasonText: e.target.value }))} className="w-full border-2 border-white rounded-xl p-3 shadow-inner bg-white/10 text-white placeholder-white/50" placeholder="กรุณาระบุเหตุผลการลา..." />
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2 text-white">Attach Evidence (หลักฐาน) {selectedPolicy?.requireEvidence ? <span className="text-red-400">*</span> : " (if any)"}</label>
          <div className="relative border-2 border-dashed border-white/50 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:border-[#636CCB] transition-all bg-white/5">
            <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf" onChange={handleEvidenceUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center">
              <i className="bi bi-cloud-arrow-up text-3xl text-white"></i>
              <p className="text-white/80 text-sm mt-2">คลิกเพื่ออัปโหลด (JPG, PNG, PDF)</p>
            </div>
          </div>

          {formData.evidenceFile && (
            <div className="mt-3 text-white text-sm bg-white/10 p-2 rounded-lg border border-white/20 flex justify-between items-center">
              <span className="truncate pr-4">ไฟล์: {formData.evidenceFile.name}</span>
              <button onClick={() => setFormData(prev => ({...prev, evidenceFile: null, evidencePreview: null}))} className="text-red-400 hover:text-red-300 px-2"><i className="bi bi-trash"></i></button>
            </div>
          )}

          {formData.evidencePreview && (
            <div className="mt-3 flex justify-center">
              <img src={formData.evidencePreview} alt="evidence preview" className="w-32 h-32 object-cover rounded-xl border-2 border-white shadow-lg" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pb-10">
          <button onClick={handleFileLeave} disabled={loading} className={`w-full py-4 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg transform transition-all ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#636CCB] hover:scale-105 hover:bg-[#4E56A6]"}`}>
            {loading ? <span className="flex items-center justify-center gap-2"><i className="bi bi-arrow-repeat animate-spin"></i> Processing...</span> : "Submit Leave Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;