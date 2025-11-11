import { useState } from "react";

const DelegateCheckin = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(employeeId)) {
      setStatus("❌ กรุณากรอกรหัสพนักงาน 6 หลักให้ถูกต้อง");
      return;
    }

    setIsLoading(true);
    setStatus("");

    setTimeout(() => {
      const now = new Date();
      const time = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setIsLoading(false);
      setStatus(`✅ เช็กอินแทนเพื่อน (ID: ${employeeId}) เวลา ${time}`);
      setEmployeeId("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#3C467B] flex flex-col items-center pt-10">
      {/* ส่วนหัว */}
      <header className="w-full max-w-sm flex items-center justify-center mb-4">
        <h1 className="text-white text-lg font-medium tracking-wide">
          DELEGATE CHECKIN
        </h1>
      </header>

      {/* กล่องหลัก */}
      <div className="w-[90%] max-w-sm bg-white rounded-lg shadow-md p-6 border border-black">
        <form onSubmit={handleCheckIn} className="space-y-5">
          <div>
            <label className="block text-gray-800 text-sm font-semibold mb-2">
              ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(e.target.value.replace(/\D/, ""))
              }
              maxLength={6}
              placeholder="กรอกรหัสพนักงาน 6 หลัก"
              className="w-full px-4 py-2 rounded-md bg-gray-200 text-gray-800 
                         border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-md text-white font-medium text-sm 
              transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#636CCB] hover:bg-[#5059c0]"
              }`}
            >
              {isLoading ? "กำลังเช็กอิน..." : "Done"}
            </button>
          </div>
        </form>

        {status && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              status.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default DelegateCheckin;
