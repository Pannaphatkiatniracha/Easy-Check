import { useState } from "react";

const CheckInForFriend = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = (e) => {
    e.preventDefault();

    // รหัส6หลัก
    if (!/^\d{6}$/.test(employeeId)) {
      setStatus("❌ กรุณากรอกรหัสพนักงาน 6 หลักให้ถูกต้อง");
      return;
    }

    setIsLoading(true);
    setStatus("");

    // จำลองการเช็กอินสำเร็จ
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
    <div className="min-h-screen bg-[#3C467B] px-4 py-12 flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          เช็กอินแทนเพื่อน
        </h1>

        <form onSubmit={handleCheckIn} className="space-y-5">
          <div>
            <label className="block text-gray-200 font-medium mb-2">
              รหัสพนักงาน (6 หลัก)
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value.replace(/\D/, ""))} // รับเฉพาะตัวเลข
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-lg bg-white/90 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#636CCB] placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#636CCB] hover:bg-[#5059c0]"
            }`}
          >
            {isLoading ? "กำลังเช็กอิน..." : "เช็กอิน"}
          </button>
        </form>

        {status && (
          <p
            className={`mt-5 text-center font-medium ${
              status.startsWith("✅") ? "text-green-300" : "text-red-300"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckInForFriend;
