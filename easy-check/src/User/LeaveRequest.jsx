import { useState } from "react";
import './index.css';

function LeaveRequest() {
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [reason, setReason] = useState({
    Vacation: false,
    Military: false,
    "Sick-Self": false,
    "Sick-Family": false,
    Other: false,
  });
  const [otherText, setOtherText] = useState("");
  const [linkPic, setLinkPic] = useState("");

  const handleReasonChange = (e) => {
    const { name, checked } = e.target;
    setReason((prev) => ({ ...prev, [name]: checked }));
    if (name === "Other" && !checked) setOtherText("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedReasons = Object.keys(reason).filter((r) => reason[r]);
    const formData = {
      date,
      fromDate,
      toDate,
      fromTime,
      toTime,
      selectedReasons,
      otherText,
      linkPic,
    };
    console.log("Leave Request Submitted:", formData);
    alert("Leave Request Submitted! Check console for details.");
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: "#0A0043" }}>
        
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={handleBack} className="text-[#FFFF00] text-xl mr-2 font-bold">
            &lt;
          </button>
          <h2 className="text-xl font-bold text-center text-[#FFFF00] flex-1">LEAVE REQUEST</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4"> 
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Date:</label>
            <input
              type="text"
              placeholder="dd/mm/yy"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">From Date:</label>
            <input
              type="text"
              placeholder="dd/mm/yy"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">To Date:</label>
            <input
              type="text"
              placeholder="dd/mm/yy"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* From Time */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">From Time:</label>
            <input
              type="text"
              placeholder="HH:MM"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* To Time */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">To Time:</label>
            <input
              type="text"
              placeholder="HH:MM"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Reason for Leave */}
          <div>
            <p className="font-medium mb-1 text-[#FFFF00]">Reason for Leave:</p>
            <div className="space-y-1">
              {["Vacation", "Military", "Sick-Self", "Sick-Family", "Other"].map((r) => (
                <label key={r} className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    name={r}
                    checked={reason[r]}
                    onChange={handleReasonChange}
                    className="w-4 h-4"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            {reason.Other && (
              <div className="mt-2">
                <label className="block text-sm mb-1 text-[#FFFF00]">
                  Medical certificate (not required):
                </label>
                <input
                  type="text"
                  placeholder="กรอกเหตุผลอื่น"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            )}
          </div>

          {/* Link/Pic */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Link/Pic:</label>
            <input
              type="text"
              placeholder="วางลิงก์หรือแนบรูป"
              value={linkPic}
              onChange={(e) => setLinkPic(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default LeaveRequest;
