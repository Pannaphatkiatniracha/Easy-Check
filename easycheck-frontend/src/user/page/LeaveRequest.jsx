import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const API = "http://localhost:5000/leave-approve";

const LeaveRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
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
    "Sick Leave", "Personal Leave", "Vacation Leave",
    "Maternity Leave", "Wedding Leave", "Religious Leave", "Other",
  ];

  const today = useMemo(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    //  เปลี่ยนจาก localStorage → sessionStorage
    const rawUser = sessionStorage.getItem("user");
    let storedUser = {};
    try {
      storedUser = JSON.parse(rawUser || "null") || {};
    } catch {
      storedUser = {};
    }

    setFormData((prev) => ({
      ...prev,
      userId: storedUser?.id_employee ?? "",
      leaveStart: today,
      leaveEnd: today,
    }));
  }, [today]);

  useEffect(() => {
    const fetchBalance = async () => {
      // เปลี่ยนจาก localStorage → sessionStorage
      const token = sessionStorage.getItem("token");
      if (!token) return;
      try {
        setBalanceLoading(true);
        const res = await axios.get(`${API}/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance || []);
      } catch (error) {
        console.error("โหลด leave balance ไม่สำเร็จ:", error);
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    if (formData.leaveStart && formData.leaveEnd) {
      const start = new Date(formData.leaveStart);
      const end = new Date(formData.leaveEnd);
      if (start > end) { setCalculatedDays(0); return; }
      let count = 0;
      const current = new Date(start);
      while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) count++;
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

  const handleReasonChange = (reason) => {
    if (formData.leaveReasons.includes(reason)) {
      setFormData((prev) => ({ ...prev, leaveReasons: [], otherReasonText: "" }));
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
      "Sick Leave": "SICK", "Personal Leave": "PERSONAL", "Vacation Leave": "VACATION",
      "Maternity Leave": "MATERNITY", "Wedding Leave": "WEDDING",
      "Religious Leave": "RELIGIOUS", Other: "OTHER",
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
    if (formData.leaveReasons.includes("Other") && !formData.otherReasonText.trim())
      return alert("กรุณาระบุเหตุผลเพิ่มเติมสำหรับ Other");
    if (selectedPolicy?.requireEvidence && !formData.evidenceFile)
      return alert(`การลา ${selectedPolicy.leaveName} ต้องแนบหลักฐาน`);

    if (!window.confirm(`ยืนยันการยื่น ${selectedMainReason} จำนวน ${calculatedDays} วัน ใช่หรือไม่?`)) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("leaveStart", formData.leaveStart);
      data.append("leaveEnd", formData.leaveEnd);
      data.append("leaveReasons", JSON.stringify(formData.leaveReasons));
      data.append("otherReasonText", formData.otherReasonText || "");
      if (formData.evidenceFile) data.append("evidence", formData.evidenceFile);

      const response = await axios.post(`${API}/request`, data, {
        //  เปลี่ยนจาก localStorage → sessionStorage
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token") || ""}` },
      });
      alert(response.data?.message || "ยื่นคำขอลางานสำเร็จ");
      navigate(-1);
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4">
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
              <span className="font-semibold">ID พนักงาน:</span>{" "}
              {formData.userId || "-"}
            </div>
            <div className="mt-2 font-semibold border-b border-white/20 pb-1 mb-2">
              สิทธิ์ลาประจำปี
            </div>
            {balanceLoading ? (
              <div className="text-white/70 text-sm mt-2">
                <i className="bi bi-arrow-repeat animate-spin"></i> กำลังโหลด...
              </div>
            ) : (
              <div className="mt-2 space-y-2 text-sm max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {balance.map((item) => (
                  <div key={item.leaveCode} className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="font-semibold">{item.leaveName}</div>
                    <div className="flex justify-between mt-1 text-white/80">
                      <span>สิทธิ์ต่อปี: {item.maxDays}</span>
                      <span>
                        คงเหลือ:{" "}
                        <strong className="text-green-400">{item.remainingDays}</strong> วัน
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3 w-full max-w-xs mx-auto">
            <div className="flex-1 text-center">
              <label className="block text-xs font-semibold text-white/80 mb-1">Start Date</label>
              <input
                type="date" name="leaveStart" min={today} value={formData.leaveStart}
                onChange={handleDateChange}
                className="w-full border border-white/30 rounded-lg p-2 text-sm bg-white/20 text-white focus:outline-none focus:border-white text-center"
              />
            </div>
            <div className="flex-1 text-center">
              <label className="block text-xs font-semibold text-white/80 mb-1">End Date</label>
              <input
                type="date" name="leaveEnd" min={formData.leaveStart || today} value={formData.leaveEnd}
                onChange={handleDateChange}
                className="w-full border border-white/30 rounded-lg p-2 text-sm bg-white/20 text-white focus:outline-none focus:border-white text-center"
              />
            </div>
          </div>
          <div className="bg-[#636CCB]/30 rounded-lg px-4 py-2 text-white text-sm border border-[#636CCB] inline-block">
            รวมวันลา:{" "}
            <strong className="text-lg mx-1 text-green-400">{calculatedDays}</strong> วัน
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-3 text-white text-center">
            Leave Reason <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {leaveOptions.map((reason) => (
              <label
                key={reason}
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                  formData.leaveReasons.includes(reason)
                    ? "bg-white text-[#3C467B] border-white scale-105"
                    : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                }`}
              >
                <span className="text-sm font-medium">{reason}</span>
                <input
                  type="checkbox" className="hidden"
                  checked={formData.leaveReasons.includes(reason)}
                  onChange={() => handleReasonChange(reason)}
                />
                {formData.leaveReasons.includes(reason) && (
                  <i className="bi bi-check-circle-fill"></i>
                )}
              </label>
            ))}
          </div>
          {formData.leaveReasons.includes("Other") && (
            <input
              type="text" value={formData.otherReasonText}
              onChange={(e) => setFormData((p) => ({ ...p, otherReasonText: e.target.value }))}
              className="w-full mt-3 border border-white/30 rounded-xl p-3 bg-white/10 text-white text-sm"
              placeholder="ระบุเหตุผลเพิ่มเติม..."
            />
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2 text-white text-sm">
            Attach Evidence (ถ้ามี)
          </label>
          <div className="relative border border-dashed border-white/50 rounded-xl p-4 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
            <input
              type="file" accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleEvidenceUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <i className="bi bi-cloud-arrow-up text-2xl text-white"></i>
            <p className="text-white/60 text-xs mt-1">อัปโหลด JPG, PNG, PDF</p>
          </div>
          {formData.evidenceFile && (
            <div className="mt-2 text-xs text-white bg-white/10 p-2 rounded flex justify-between">
              <span className="truncate">{formData.evidenceFile.name}</span>
              <button
                onClick={() => setFormData((p) => ({ ...p, evidenceFile: null, evidencePreview: null }))}
                className="text-red-400 ml-2"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          )}
        </div>

        <div className="pb-10">
          <button
            onClick={handleFileLeave} disabled={loading}
            className={`w-full py-4 rounded-xl text-white text-lg font-bold shadow-lg transition-all ${
              loading ? "bg-gray-500" : "bg-[#636CCB] hover:bg-[#4E56A6] active:scale-95"
            }`}
          >
            {loading ? "Processing..." : "Submit Leave Request"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LeaveRequest;