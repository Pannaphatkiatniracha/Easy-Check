import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
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
      const data = { time, date, lat: location.lat, lng: location.lng, photo, timestamp };
      setCheckInData(data);
      localStorage.setItem("checkInData", JSON.stringify(data));
      setMessage(`เช็คอินสำเร็จ\nเวลา: ${time}`);
      setMode("checkout");
      setPhoto(null);
    } else if (mode === "checkout") {
      const data = { time, date, lat: location.lat, lng: location.lng, photo, timestamp };
      setCheckOutData(data);
      localStorage.setItem("checkOutData", JSON.stringify(data));
      if (checkInData) {
        const durationMs = timestamp - checkInData.timestamp;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        setMessage(`เช็คเอาท์สำเร็จ\nเวลา: ${time}\n⏱ เวลาทำงานรวม: ${hours} ชั่วโมง ${minutes} นาที`);
      }
      setMode("done");
      setPhoto(null);
    }

    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setError("");
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
  };

  return (
    <div className="min-h-screen bg-[#3C467B] flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full space-y-6 relative">

        {/* Header */}
        <div className="flex justify-start">
          <Link to="/home" className="text-white text-2xl">
            <i className="bi bi-chevron-left"></i>
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg text-center flex items-center gap-2">
          <i className="bi bi-geo-alt-fill"></i> Check-In / Check-Out
        </h1>

        {/* Camera Card */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/30 flex flex-col items-center space-y-4">
          <video
            ref={videoRef}
            autoPlay
            className="w-full rounded-2xl shadow-2xl border-4 border-white object-cover max-h-[650px]"
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>

          <div className="flex flex-col w-full gap-3 mt-2">
            <button
              onClick={startCamera}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white font-bold shadow-lg hover:scale-105 transition transform"
            >
              <i className="bi bi-camera-video-fill"></i> เปิดกล้อง ({mode === "checkin" ? "เช็คอิน" : "เช็คเอาท์"})
            </button>

            <button
              onClick={capturePhoto}
              className="w-full py-3 rounded-xl bg-white text-[#3C467B] font-bold shadow-lg hover:scale-105 transition transform"
            >
              <i className="bi bi-camera-fill"></i> ถ่ายรูป
            </button>
          </div>
        </div>

        {/* Preview Photo */}
        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="preview"
            className="w-full max-h-[300px] rounded-2xl border-4 border-white shadow-xl object-cover"
          />
        )}

        {/* Time & Date */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-white text-[#3C467B] py-2 rounded-xl text-center font-semibold shadow-inner">{time}</div>
          <div className="bg-white text-[#3C467B] py-2 rounded-xl text-center font-semibold shadow-inner">{date}</div>
        </div>

        {/* Location & Confirm */}
        <button
          onClick={handleLocation}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white font-bold shadow-lg hover:scale-105 transition transform"
        >
          <i className="bi bi-geo-alt"></i> ขอใช้ตำแหน่ง
        </button>

        {mode !== "done" && (
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#34FFB9] to-[#12C27E] text-black font-bold shadow-lg hover:scale-105 transition transform"
          >
            Done
          </button>
        )}

        {/* Check-In & Check-Out Data */}
        {checkInData && (
          <div className="w-full p-4 rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl border border-white/30 text-center">
            <h3 className="font-bold text-white mb-2 flex justify-center items-center gap-2">
              <i className="bi bi-geo-fill"></i> เช็คอิน
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
          <div className="w-full p-4 rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl border border-white/30 text-center">
            <h3 className="font-bold text-white mb-2 flex justify-center items-center gap-2">
              <i className="bi bi-flag-fill"></i> เช็คเอาท์
            </h3>
            <p className="text-white">เวลา: {checkOutData.time}</p>
            <img
              src={URL.createObjectURL(checkOutData.photo)}
              alt="Check-Out"
              className="mt-2 w-full h-40 rounded-2xl object-cover border-2 border-white shadow-lg"
            />
          </div>
        )}

        {/* Message & Error */}
        {message && (
          <div className="mt-4 p-3 bg-white/30 rounded-2xl text-[#3C467B] w-full text-center font-semibold shadow-md whitespace-pre-line">
            {message}
          </div>
        )}
        {error && <p className="mt-3 text-red-300 font-semibold">{error}</p>}

        {/* Reset */}
        {mode === "done" && (
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white font-bold shadow-lg hover:scale-105 transition transform"
          >
            เริ่มใหม่
          </button>
        )}

      </div>
    </div>
  );
}

export default CheckInOut;
