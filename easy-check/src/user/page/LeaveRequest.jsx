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
      if (reason === "Other")
        setFormData({ ...formData, leaveReasons: updated, otherReasonText: "" });
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
    if (
      formData.leaveReasons.includes("Other") &&
      !formData.otherReasonText.trim()
    ) {
      alert("Please provide reason for 'Other'.");
      return;
    }
    alert("Leave filed successfully!");
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-[#3C467B] flex flex-col items-center py-10 px-4 font-inter">
      <div className="max-w-lg w-full flex flex-col space-y-8">
        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-[#FFFFFF] drop-shadow-lg py-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg font-inter">
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
              className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:border-[#636CCB] bg-white/20 text-white placeholder-white"
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
              className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:border-[#636CCB] bg-white/20 text-white placeholder-white"
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
                className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#636CCB] bg-white/10 text-white placeholder-white"
                placeholder="Enter your reason"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleFileLeave}
          className="w-full py-3 rounded-xl bg-[#636CCB] text-[#FFFFFF] text-lg font-bold shadow-lg hover:scale-105 transform transition-all hover:bg-[#4b54b5]"
        >
          File Leave
        </button>
      </div>
    </div>
  );
};

export default LeaveRequest;
