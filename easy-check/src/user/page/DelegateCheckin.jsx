import { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

const DelegateCheckin = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedInEmployee, setCheckedInEmployee] = useState(null);

  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(employeeId)) {
      setStatus("❌ Please enter your 6-digit employee ID correctly");
      return;
    }

    setIsLoading(true);
    setStatus("");

    try {
      // ค้นหาพนักงานจาก MockAPI
      const res = await fetch("https://68fbd77794ec960660275293.mockapi.io/users");
      const employees = await res.json();
      
      const foundEmployee = employees.find(emp => emp.userid === employeeId);
      
      if (!foundEmployee) {
        setStatus("❌ The employee ID was not found in the system");
        return;
      }

      // ถ้ามีพนักงานอยู่แล้วให้ผ่าน (ไม่ต้องเช็ค canBeCheckedIn)
      const now = new Date();
      const time = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

<<<<<<< HEAD
      setIsLoading(false);
      setCheckedInEmployee({
        id: employeeId,
        name: employees[employeeId],
        time,
      });
      setStatus(
        `✅ เช็กอินเรียบร้อยแล้ว\nID: ${employeeId}\nชื่อ: ${employees[employeeId]}\nเวลา: ${time}`
      );
=======
      setCheckedInEmployee({ 
        id: foundEmployee.userid, 
        name: foundEmployee.name, 
        time 
      });
      setStatus(`✅ เช็กอินเรียบร้อยแล้ว\nID: ${foundEmployee.userid}\nชื่อ: ${foundEmployee.name}\nเวลา: ${time}`);
>>>>>>> df2e0c4410d370927aa21b7b44d1e29613867805
      setEmployeeId("");

    } catch (error) {
      console.error("Error checking in:", error);
      setStatus("❌ Error connecting to system");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">

        {/* ⭐ Header — ไอคอนซ้าย + หัวข้อกลาง */}
        <div className="flex items-center justify-between mb-4 relative">
          {/* ไอคอนซ้าย */}
          <Link to="/home" className="text-white text-2xl">
            <i className="bi bi-chevron-left"></i>
          </Link>

          {/* หัวข้ออยู่กลางจริง */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-white text-xl font-bold tracking-wide whitespace-nowrap">
            Delegate CheckIn
          </h1>

          {/* ไว้ให้ flex balance (ไม่แสดงจริง) */}
          <div className="w-6"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleCheckIn} className="space-y-5">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Employess ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(e.target.value.replace(/\D/, ""))
              }
              maxLength={6}
              placeholder="FRIEND'S EMPLOYEE ID 6 DIGITS"
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium text-sm 
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

        {/* Checked-in Employee Info */}
        {checkedInEmployee && (
          <div className="mt-4 bg-white/30 p-4 rounded-lg text-center text-white shadow-md">
            <p className="font-medium">Successfully checked in</p>
            <p>ID: {checkedInEmployee.id}</p>
            <p>Name: {checkedInEmployee.name}</p>
            <p>Time: {checkedInEmployee.time}</p>
          </div>
        )}

        {/* Status */}
        {status && !checkedInEmployee && (
          <p
            className={`mt-4 text-center text-sm font-medium whitespace-pre-line ${
              status.startsWith("✅")
                ? "text-green-400"
                : "text-red-400"
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