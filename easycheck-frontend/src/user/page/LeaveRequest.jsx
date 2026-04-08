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

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    let storedUser = {};

    try {
      storedUser = JSON.parse(rawUser || "null") || {};
    } catch (error) {
      console.error("อ่าน localStorage.user ไม่สำเร็จ:", error);
      storedUser = {};
    }

    const employeeId =
      storedUser?.id_employee ||
      storedUser?.employeeId ||
      storedUser?.idEmployee ||
      storedUser?.userId ||
      localStorage.getItem("id_employee") ||
      localStorage.getItem("employeeId") ||
      localStorage.getItem("userId") ||
      "";

    console.log("rawUser from localStorage =", rawUser);
    console.log("storedUser =", storedUser);
    console.log("resolved employeeId =", employeeId);

    setFormData((prev) => ({
      ...prev,
      userId: employeeId,
      leaveStart: today,
      leaveEnd: today,
    }));
  }, [today]);

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
    let updated = [...formData.leaveReasons];

    if (updated.includes(reason)) {
      updated = updated.filter((r) => r !== reason);

      if (reason === "Other") {
        setFormData((prev) => ({
          ...prev,
          leaveReasons: updated,
          otherReasonText: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          leaveReasons: updated,
        }));
      }
    } else {
      const withoutMainReasons = updated.filter((r) => r === "Other");

      if (reason === "Other") {
        updated = [...updated, reason];
      } else {
        updated = [...withoutMainReasons, reason];
      }

      setFormData((prev) => ({
        ...prev,
        leaveReasons: updated,
      }));
    }
  };

  const handleEvidenceUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("กรุณาอัปโหลดไฟล์ JPG, JPEG, PNG หรือ PDF");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      evidenceFile: file,
      evidencePreview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
  };

  const selectedMainReason = useMemo(() => {
    return (
      formData.leaveReasons.find((r) => r !== "Other") ||
      formData.leaveReasons[0]
    );
  }, [formData.leaveReasons]);

  const selectedPolicy = useMemo(() => {
    const reasonToCode = {
      "Sick Leave": "SICK",
      "Personal Leave": "PERSONAL",
      "Vacation Leave": "VACATION",
      "Maternity Leave": "MATERNITY",
      "Wedding Leave": "WEDDING",
      "Religious Leave": "RELIGIOUS",
      Other: "OTHER",
    };

    const code = reasonToCode[selectedMainReason];
    return balance.find((item) => item.leaveCode === code);
  }, [selectedMainReason, balance]);

  const handleFileLeave = async () => {
    if (!formData.userId) {
      alert("ไม่พบ employee id ของผู้ใช้ กรุณา login ใหม่");
      console.log("localStorage user =", localStorage.getItem("user"));
      console.log("localStorage id_employee =", localStorage.getItem("id_employee"));
      console.log("localStorage employeeId =", localStorage.getItem("employeeId"));
      return;
    }

    if (!formData.leaveStart || !formData.leaveEnd) {
      alert("กรุณาเลือกวันเริ่มลาและวันสิ้นสุดลา");
      return;
    }

    if (formData.leaveStart < today || formData.leaveEnd < today) {
      alert("ไม่สามารถเลือกวันลาย้อนหลังได้");
      return;
    }

    if (formData.leaveStart > formData.leaveEnd) {
      alert("วันเริ่มลาต้องไม่เกินวันสิ้นสุดลา");
      return;
    }

    if (formData.leaveReasons.length === 0) {
      alert("กรุณาเลือกประเภทการลา");
      return;
    }

    if (
      formData.leaveReasons.includes("Other") &&
      !formData.otherReasonText.trim()
    ) {
      alert("กรุณาระบุเหตุผลเพิ่มเติมสำหรับ Other");
      return;
    }

    if (selectedPolicy?.requireEvidence && !formData.evidenceFile) {
      alert(`การลา ${selectedPolicy.leaveName} ต้องแนบหลักฐาน`);
      return;
    }

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      alert(response.data?.message || "ยื่นคำขอลางานสำเร็จ");
      navigate(-1);
    } catch (err) {
      console.error("submit leave error =", err);
      alert(
        "เกิดข้อผิดพลาด: " +
          (err.response?.data?.message || "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้")
      );
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
          <h2 className="text-xl font-bold text-white text-center">
            LEAVE REQUEST
          </h2>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
          <div className="text-sm">
            <div>
              <span className="font-semibold">Employee ID:</span>{" "}
              {formData.userId || "-"}
            </div>
            <div className="mt-2 font-semibold">สิทธิ์ลาประจำปี</div>

            {balanceLoading ? (
              <div className="text-white/70 text-sm mt-2">กำลังโหลด...</div>
            ) : balance.length === 0 ? (
              <div className="text-white/70 text-sm mt-2">
                ไม่พบข้อมูลสิทธิ์ลา
              </div>
            ) : (
              <div className="mt-2 space-y-2 text-sm">
                {balance.map((item) => (
                  <div
                    key={item.leaveCode}
                    className="bg-white/10 rounded-xl p-3 border border-white/10"
                  >
                    <div className="font-semibold">{item.leaveName}</div>
                    <div>สิทธิ์ต่อปี: {item.maxDays} วัน</div>
                    <div>ใช้ไปแล้ว: {item.usedDays} วัน</div>
                    <div>คงเหลือ: {item.remainingDays} วัน</div>
                    <div>ยื่นแล้วปีนี้: {item.usedTimesThisYear} ครั้ง</div>
                    <div>
                      แนบหลักฐาน: {item.requireEvidence ? "ต้องแนบ" : "ไม่บังคับ"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block font-semibold text-[#FFFFFF] mb-1">
              Leave Start <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="leaveStart"
              min={today}
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
              min={formData.leaveStart || today}
              value={formData.leaveEnd}
              onChange={handleDateChange}
              className="w-full border-2 border-white rounded-xl p-3 shadow-inner focus:outline-none focus:border-[#636CCB] bg-white/20 text-white"
            />
          </div>
        </div>

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
                {formData.leaveReasons.includes(reason) && (
                  <i className="bi bi-check-circle-fill text-[#3C467B]"></i>
                )}
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
                  setFormData((prev) => ({
                    ...prev,
                    otherReasonText: e.target.value,
                  }))
                }
                className="w-full border-2 border-white rounded-xl p-3 shadow-inner bg-white/10 text-white"
                placeholder="Enter your reason"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2 text-white">
            Attach Evidence
            {selectedPolicy?.requireEvidence ? " *" : " (if any)"}
          </label>

          <div className="relative border-2 border-dashed border-white/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#636CCB] transition-all max-w-sm">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf"
              onChange={handleEvidenceUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <i className="bi bi-cloud-arrow-up text-2xl text-white"></i>
            <p className="text-white/80 text-sm">
              คลิกเพื่ออัปโหลดหลักฐาน (JPG, PNG, PDF)
            </p>
          </div>

          {formData.evidenceFile && (
            <div className="mt-3 text-white text-sm">
              ไฟล์ที่เลือก: {formData.evidenceFile.name}
            </div>
          )}

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
    </div>
  );
};

export default LeaveRequest;