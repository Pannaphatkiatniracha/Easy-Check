import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function CheckInOut() {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [checkOutData, setCheckOutData] = useState(null);
  const [mode, setMode] = useState("checkin");

  const [earlyRequest, setEarlyRequest] = useState(null);
  const [showEarlyModal, setShowEarlyModal] = useState(false);
  const [earlyReason, setEarlyReason] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const nowTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("th-TH"));
      setDate(now.toLocaleDateString("th-TH"));
    };
    nowTime();
    const timer = setInterval(nowTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      videoRef.current.srcObject = stream;
      setError("");
    } catch (err) {
      setError("ไม่สามารถเปิดกล้องได้: " + err.message);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        setPhoto(file);
      }
    });
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError("");
      },
      () => setError("ไม่สามารถเข้าถึงตำแหน่ง ควรเปิด GPS")
    );
  };

  const handleConfirm = () => {
    if (!location) return setError("กรุณาขอตำแหน่งก่อน");
    if (!photo) return setError("กรุณาถ่ายรูปยืนยันตัวตน");

    const now = new Date();
    const timestamp = now.getTime();

    if (mode === "checkin") {
      const data = {
        time,
        date,
        lat: location.lat,
        lng: location.lng,
        photo,
        timestamp,
      };
      setCheckInData(data);
      localStorage.setItem("checkInData", JSON.stringify(data));

      // ⭐ ตรวจสอบเวลาเช็คอินสาย
      const workStart = new Date();
      workStart.setHours(9, 0, 0, 0); // เวลาเริ่มงาน 09:00
      let messageText = `เช็คอินสำเร็จ\nเวลา: ${time}`;
      if (timestamp > workStart.getTime()) {
        messageText += "\n⚠️ มาสาย";
      }

      setMessage(messageText);
      setMode("checkout");
      setPhoto(null);
    } else if (mode === "checkout") {
      const currentHour = now.getHours();
      if (currentHour < 18 && !earlyRequest) {
        setShowEarlyModal(true);
        return;
      }

      const data = {
        time,
        date,
        lat: location.lat,
        lng: location.lng,
        photo,
        timestamp,
      };
      setCheckOutData(data);
      localStorage.setItem("checkOutData", JSON.stringify(data));
      if (checkInData) {
        const durationMs = timestamp - checkInData.timestamp;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        setMessage(
          `เช็คเอาท์สำเร็จ\nเวลา: ${time}\n⏱ เวลาทำงานรวม: ${hours} ชั่วโมง ${minutes} นาที`
        );
      }
      setMode("done");
      setPhoto(null);
      setEarlyRequest(null);
    }

    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setError("");
  };

  const handleEarlySubmit = () => {
    if (!earlyReason.trim()) return setError("กรุณากรอกเหตุผล");
    const request = { reason: earlyReason, status: "pending" };
    setEarlyRequest(request);
    setShowEarlyModal(false);
    setEarlyReason("");
    setMessage("ส่งคำขอออกก่อนเวลาเรียบร้อย\nรอผู้อนุมัติ");
  };

  const handleApproveEarly = () => {
    if (!earlyRequest) return;
    setEarlyRequest({ ...earlyRequest, status: "approved" });
    setMessage("คำขออนุมัติแล้ว สามารถเช็คเอาท์ได้");
  };

  const handleReset = () => {
    localStorage.removeItem("checkInData");
    localStorage.removeItem("checkOutData");
    setCheckInData(null);
    setCheckOutData(null);
    setPhoto(null);
    setMode("checkin");
    setMessage("");
    setError("");
    setEarlyRequest(null);
    setEarlyReason("");
    setShowEarlyModal(false);
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* ⭐ หัวข้อ + ไอคอน อยู่บรรทัดเดียว */}
        <div className="flex items-center gap-3 mb-4">
          <Link to="/home" className="text-white text-2xl">
            <i className="bi bi-chevron-left"></i>
          </Link>

          <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">
            Check-In / Check-Out
          </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/20 flex flex-col items-center space-y-4 hover:scale-105 transition-transform duration-300">
          <video
            ref={videoRef}
            autoPlay
            className="w-full rounded-2xl shadow-2xl border-4 border-white object-cover max-h-[450px] aspect-[3/4] transform-gpu"
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>

          <div className="flex flex-col w-full gap-3 mt-2">
            <button
              onClick={startCamera}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white font-bold shadow-lg hover:scale-105 transition transform"
            >
              <i className="bi bi-camera-video-fill"></i> Open Camera (
              {mode === "checkin" ? "เช็คอิน" : "เช็คเอาท์"})
            </button>

            <button
              onClick={capturePhoto}
              className="w-full py-3 rounded-xl bg-white text-[#3C467B] font-bold shadow-lg hover:scale-105 transition transform"
            >
              <i className="bi bi-camera-fill"></i> Take a photo
            </button>
          </div>
        </div>

        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="preview"
            className="w-full max-h-[300px] rounded-2xl border-4 border-white shadow-xl object-cover hover:scale-105 transition duration-300"
          />
        )}

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-white text-[#3C467B] py-2 rounded-xl text-center font-semibold shadow-inner">
            {time}
          </div>
          <div className="bg-white text-[#3C467B] py-2 rounded-xl text-center font-semibold shadow-inner">
            {date}
          </div>
        </div>

        <button
          onClick={handleLocation}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white font-bold shadow-lg hover:scale-105 transition transform"
        >
          <i className="bi bi-geo-alt"></i> Request position access
        </button>

        {mode !== "done" && (
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#34FFB9] to-[#12C27E] text-black font-bold shadow-lg hover:scale-105 transition transform"
          >
            Done
          </button>
        )}

        {checkInData && (
          <div className="w-full p-4 rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl border border-white/20 text-center hover:scale-105 transition duration-300">
            <h3 className="font-bold text-white mb-2 flex items-center justify-center gap-2">
              <i className="bi bi-geo-fill"></i>
              <span>CheckIn</span>
            </h3>
            <p className="text-white">เวลา: {checkInData.time}</p>
            <img
              src={URL.createObjectURL(checkInData.photo)}
              alt="Check-In"
              className="mt-2 w-full h-40 rounded-2xl object-cover border-2 border-white shadow-lg"
            />
          </div>
        )}

        {checkOutData && (
          <div className="w-full p-4 rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl border border-white/20 text-center hover:scale-105 transition duration-300">
            <h3 className="font-bold text-white mb-2 flex items-center justify-center gap-2">
              <i className="bi bi-flag-fill"></i>
              <span>CheckOut</span>
            </h3>
            <p className="text-white">Time: {checkOutData.time}</p>
            <img
              src={URL.createObjectURL(checkOutData.photo)}
              alt="Check-Out"
              className="mt-2 w-full h-40 rounded-2xl object-cover border-2 border-white shadow-lg"
            />
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 bg-white/30 rounded-2xl text-[#3C467B] w-full text-center font-semibold shadow-md whitespace-pre-line hover:scale-105 transition duration-300">
            {message}
          </div>
        )}
        {error && <p className="mt-3 text-red-300 font-semibold">{error}</p>}

        {mode === "done" && (
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white font-bold shadow-lg hover:scale-105 transition transform"
          >
            Reset
          </button>
        )}

        {earlyRequest && earlyRequest.status === "pending" && (
          <button
            onClick={handleApproveEarly}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold shadow-lg hover:scale-105 transition transform mt-3"
          >
            อนุมัติคำขอออกก่อนเวลา
          </button>
        )}
      </div>

      {/* ⭐ Popup กล่องขนาดเล็กลง */}
      {showEarlyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full text-center shadow-xl">
            <p className="mb-2 text-gray-800 font-semibold text-sm">
              คุณต้องการเช็คเอาท์ก่อนเวลา 18:00 กรุณากรอกเหตุผล
            </p>

            <textarea
              value={earlyReason}
              onChange={(e) => setEarlyReason(e.target.value)}
              placeholder="กรอกเหตุผลที่ต้องการออกก่อนเวลา"
              className="w-full p-2 border rounded-md mb-3 text-sm"
              rows={3}
            />

            <div className="flex justify-center gap-4 mt-1">
              <button
                onClick={handleEarlySubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 text-sm"
              >
                ส่งคำขอ
              </button>
              <button
                onClick={() => setShowEarlyModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 text-sm"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckInOut;
