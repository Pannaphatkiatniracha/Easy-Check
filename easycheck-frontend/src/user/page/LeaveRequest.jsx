import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const LeaveRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveStart: "",
    leaveEnd: "",
    leaveReasons: [],
    otherReasonText: "",
    evidenceFile: null,
    evidencePreview: null,
  });

  const [rejectPopup, setRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const leaveOptions = [
    "Sick Leave",
    "Personal Leave",
    "Vacation Leave",
    "Maternity Leave",
    "Wedding Leave",
    "Religious Leave",
    "Other",
  ];

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReasonChange = (reason) => {
    let updated = [...formData.leaveReasons];
    if (updated.includes(reason)) {
      updated = updated.filter((r) => r !== reason);
      if (reason === "Other") {
        setFormData({ ...formData, leaveReasons: updated, otherReasonText: "" });
      } else {
        setFormData({ ...formData, leaveReasons: updated });
      }
    } else {
      updated.push(reason);
      setFormData({ ...formData, leaveReasons: updated });
    }
  };

  const handleEvidenceUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setFormData({
      ...formData,
      evidenceFile: file,
      evidencePreview: URL.createObjectURL(file),
    });
  };

  const handleFileLeave = async () => {
    // 1. ตรวจสอบข้อมูลก่อนส่ง
    if (!formData.leaveStart || !formData.leaveEnd) {
      alert("Please select start and end dates.");
      return;
    }
    if (formData.leaveReasons.length === 0) {
      alert("Please select at least one leave reason.");
      return;
    }
    if (formData.leaveReasons.includes("Other") && !formData.otherReasonText.trim()) {
      alert("Please provide a reason for 'Other'.");
      return;
    }
    if (formData.leaveReasons.includes("Sick Leave") && !formData.evidenceFile) {
      alert("Please attach a medical certificate.");
      return;
    }

    setLoading(true);

    // 2. สร้าง FormData เพื่อส่งข้อมูลพร้อมไฟล์
    const data = new FormData();
    const empId = localStorage.getItem("role") === "admin" ? "061004" : (localStorage.getItem("token") ? "061004" : "061004"); 
    
    data.append("userId", empId); 
    data.append("leaveStart", formData.leaveStart);
    data.append("leaveEnd", formData.leaveEnd);
    data.append("leaveReasons", JSON.stringify(formData.leaveReasons));
    data.append("otherReasonText", formData.otherReasonText);
    
    // ตรงนี้ชื่อ Field "evidenceFile" จะตรงกับ upload.single("evidenceFile") ใน Backend
    if (formData.evidenceFile) {
      data.append("evidenceFile", formData.evidenceFile); 
    }

    try {
      // ไม่ต้องใส่ headers: { "Content-Type": "multipart/form-data" } เพื่อให้เบราว์เซอร์จัดการ boundary ให้อัตโนมัติ
      const response = await axios.post("http://localhost:5000/leave/request", data);
      alert("ยื่นคำขอลางานสำเร็จ!");
      navigate(-1);
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert("กรุณากรอกเหตุผลที่ไม่อนุมัติ");
      return;
    }
    alert("ไม่อนุมัติคำขอ: " + rejectReason);
    setRejectPopup(false);
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">

        {/* Header + Title */}
        <div className="flex items-center justify-center relative mb-2">
          <Link to="/home" className="absolute left-0 text-white text-2xl">
            <i className="bi bi-chevron-left"></i>
          </Link>
          <h2 className="text-xl font-bold text-white text-center">
            LEAVE REQUEST
          </h2>
        </div>

        {/* Leave Dates */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block font-semibold text-[#FFFFFF] mb-1">
              Leave Start <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="leaveStart"
              value={formData.leaveStart}
              onChange={handleDateChange}
              className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:border-[#636CCB] bg-white/20 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#FFFFFF] mb-1">
              Leave End <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="leaveEnd"
              value={formData.leaveEnd}
              onChange={handleDateChange}
              className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:border-[#636CCB] bg-white/20 text-white"
            />
          </div>
        </div>

        {/* Leave Reasons */}
        <div>
          <label className="block font-semibold mb-3 text-[#FFFFFF]">
            Leave Reason <span className="text-red-400">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaveOptions.map((reason) => (
              <label
                key={reason}
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer shadow-md transition-transform transform hover:scale-105 ${
                  formData.leaveReasons.includes(reason)
                    ? "bg-[#FFFFFF] border-white text-[#3C467B]"
                    : "bg-white/10 border-white text-white hover:border-[#636CCB]"
                }`}
              >
                <span className="font-medium">{reason}</span>
                <input
                  type="checkbox"
                  className="hidden" 
                  checked={formData.leaveReasons.includes(reason)}
                  onChange={() => handleReasonChange(reason)}
                />
                {formData.leaveReasons.includes(reason) && <i className="bi bi-check-circle-fill text-[#3C467B]"></i>}
              </label>
            ))}
          </div>

          {formData.leaveReasons.includes("Other") && (
            <div className="mt-4">
              <label className="block font-semibold mb-2 text-[#FFFFFF]">
                Reason
              </label>
              <input
                type="text"
                value={formData.otherReasonText}
                onChange={(e) =>
                  setFormData({ ...formData, otherReasonText: e.target.value })
                }
                className="w-full border-2 border-white rounded-xl p-3 shadow-inner bg-white/10 text-white"
                placeholder="Enter your reason"
              />
            </div>
          )}
        </div>

        {/* Evidence Upload */}
        <div>
          <label className="block font-semibold mb-2 text-white">
            Attach Evidence (if any)
          </label>

          <div className="relative border-2 border-dashed border-white/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#636CCB] transition-all max-w-sm">
            <input
              type="file"
              accept="image/*"
              onChange={handleEvidenceUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <i className="bi bi-cloud-arrow-up text-2xl text-white"></i>
            <p className="text-white/80 text-sm">Click to upload evidence</p>
          </div>

          {formData.evidencePreview && (
            <div className="mt-3 flex justify-start gap-2">
              <img
                src={formData.evidencePreview}
                alt="evidence preview"
                className="w-20 h-20 object-cover rounded-xl border border-white shadow"
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleFileLeave}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg hover:scale-105 transform transition-all ${
              loading ? "bg-gray-500" : "bg-[#636CCB]"
            }`}
          >
            {loading ? "Processing..." : "File Leave"}
          </button>
        </div>
      </div>

      {/* Reject Popup */}
      {rejectPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-[999]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-[#3C467B] text-center mb-4">
              กรุณากรอกเหตุผลที่ไม่อนุมัติ
            </h3>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-300"
              placeholder="ระบุเหตุผล..."
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setRejectPopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                ยกเลิก
              </button>

              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;