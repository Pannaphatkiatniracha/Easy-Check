import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

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
      if (reason === "Other")
        setFormData({ ...formData, leaveReasons: updated, otherReasonText: "" });
      else setFormData({ ...formData, leaveReasons: updated });
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

  const handleFileLeave = () => {
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

    alert("Leave filed successfully!");
    console.log(formData);

    // Navigate back to previous page
    navigate(-1);
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">

        {/* Header */}
        <div className="flex justify-start mb-4">
          <Link to="/home" className="text-white text-2xl">
            <i className="bi bi-chevron-left"></i>
          </Link>
        </div>

        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-[#FFFFFF] drop-shadow-lg py-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg">
          LEAVE REQUEST
        </h2>

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
                  checked={formData.leaveReasons.includes(reason)}
                  onChange={() => handleReasonChange(reason)}
                  className="form-checkbox h-6 w-6 text-[#636CCB]"
                />
              </label>
            ))}
          </div>

          {/* Other reason input */}
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

          {/* Preview */}
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

        {/* Submit */}
        <button
          onClick={handleFileLeave}
          className="w-full py-3 rounded-xl bg-[#636CCB] text-[#FFFFFF] text-lg font-bold shadow-lg hover:scale-105 transform transition-all"
        >
          File Leave
        </button>
      </div>
    </div>
  );
};

export default LeaveRequest;
