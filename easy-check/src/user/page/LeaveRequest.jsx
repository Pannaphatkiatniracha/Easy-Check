import { useState } from "react";

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    leaveStart: "",
    leaveEnd: "",
    leaveReasons: [],
    otherReasonText: "",
  });

  const leaveOptions = [
    "Vacation",
    "Military",
    "Sick-self",
    "Sick-family",
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
      if (reason === "Other") setFormData({ ...formData, leaveReasons: updated, otherReasonText: "" });
      else setFormData({ ...formData, leaveReasons: updated });
    } else {
      updated.push(reason);
      setFormData({ ...formData, leaveReasons: updated });
    }
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
      alert("Please provide reason for 'Other'.");
      return;
    }
    alert("Leave filed successfully!");
    console.log(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-8 space-y-8 app-container">
      {/* Header */}
      <h2 className="text-center text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-white py-4 rounded-2xl shadow-lg">
        LEAVE REQUEST
      </h2>

      {/* Leave Dates */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block font-semibold text-white mb-1">
            Leave Start <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="leaveStart"
            value={formData.leaveStart}
            onChange={handleDateChange}
            className="w-full border-2 border-yellow-300 rounded-xl p-3 shadow-inner focus:outline-none focus:border-yellow-400 bg-transparent text-white"
          />
        </div>
        <div>
          <label className="block font-semibold text-white mb-1">
            Leave End <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="leaveEnd"
            value={formData.leaveEnd}
            onChange={handleDateChange}
            className="w-full border-2 border-yellow-300 rounded-xl p-3 shadow-inner focus:outline-none focus:border-yellow-400 bg-transparent text-white"
          />
        </div>
      </div>

      {/* Leave Reasons */}
      <div>
        <label className="block font-semibold mb-3 text-white">
          Leave Reason <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaveOptions.map((reason) => (
            <label
              key={reason}
              className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer shadow-md transition-transform transform hover:scale-105 ${
                formData.leaveReasons.includes(reason)
                  ? "bg-yellow-200 border-yellow-400 text-white"
                  : "bg-transparent border-yellow-300 text-white hover:border-yellow-400"
              }`}
            >
              <span className="font-medium">{reason}</span>
              <input
                type="checkbox"
                checked={formData.leaveReasons.includes(reason)}
                onChange={() => handleReasonChange(reason)}
                className="form-checkbox h-6 w-6 text-yellow-500"
              />
            </label>
          ))}
        </div>

        {formData.leaveReasons.includes("Other") && (
          <div className="mt-4">
            <label className="block font-semibold mb-2 text-white">
              Medical certificate (not required)
            </label>
            <input
              type="text"
              value={formData.otherReasonText}
              onChange={(e) =>
                setFormData({ ...formData, otherReasonText: e.target.value })
              }
              className="w-full border-2 border-yellow-300 rounded-xl p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-transparent text-white"
              placeholder="Enter your reason"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleFileLeave}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-white text-lg font-bold shadow-lg hover:scale-105 transform transition-all"
      >
        File Leave
      </button>
    </div>
  );
};

export default LeaveRequest;
