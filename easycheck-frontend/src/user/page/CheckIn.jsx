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
  const [mode, setMode] = useState("checkin");

  const [showEarlyModal, setShowEarlyModal] = useState(false);
  const [earlyReason, setEarlyReason] = useState("");
  const [isEarlyConfirmed, setIsEarlyConfirmed] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const token = localStorage.getItem("token");

  // 📍 พิกัดบริษัท + radius
  const COMPANY_LAT = 13.756222;
  const COMPANY_LNG = 100.418917;
  const RADIUS = 150;

  // ⏰ เวลา realtime
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

  // 📷 เปิดกล้อง
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      videoRef.current.srcObject = stream;
      setError("");
    } catch (err) {
      setError("เปิดกล้องไม่ได้: " + err.message);
    }
  };

  // 📸 ถ่ายรูป
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.srcObject) return setError("กรุณาเปิดกล้องก่อน");

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo.jpg`, { type: "image/jpeg" });
        setPhoto(file);
      }
    });
  };

  // 📍 ขอ GPS
  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError("");
      },
      () => setError("กรุณาเปิด GPS")
    );
  };

  // 📍 คำนวณระยะ
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // 🚀 กด DONE
  const handleConfirm = async () => {
    if (!location) return setError("กรุณาขอตำแหน่ง");
    if (!photo) return setError("กรุณาถ่ายรูป");

    // 📍 เช็คอยู่ในบริษัทไหม
    const distance = getDistance(
      location.lat,
      location.lng,
      COMPANY_LAT,
      COMPANY_LNG
    );

    if (distance > RADIUS) {
      return setError("อยู่นอกพื้นที่บริษัท ❌");
    }

    const now = new Date();

    // ⏰ เช็คออกก่อนเวลา
    if (mode === "checkout" && now.getHours() < 18 && !isEarlyConfirmed) {
      setShowEarlyModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);
    if (earlyReason) formData.append("reason", earlyReason);

    const apiPath = mode === "checkin" ? "check-in" : "check-out";

    try {
      const res = await fetch(`http://localhost:5000/attendance/${apiPath}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          mode === "checkin"
            ? `เช็คอินสำเร็จ\n${data.status === "late" ? "⚠️ มาสาย" : "✅ ตรงเวลา"}`
            : `เช็คเอาท์สำเร็จ\n${data.status === "early" ? "⚠️ ออกก่อนเวลา" : "✅ ปกติ"}`
        );

        setMode(mode === "checkin" ? "checkout" : "done");

        setPhoto(null);
        setEarlyReason("");
        setIsEarlyConfirmed(false);

        stopCamera();
      } else {
        setError(data.message);
      }

    } catch {
      setError("เชื่อม server ไม่ได้");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleEarlySubmit = () => {
    if (!earlyReason.trim()) return alert("กรอกเหตุผล");
    setIsEarlyConfirmed(true);
    setShowEarlyModal(false);
    setTimeout(handleConfirm, 100);
  };

  const reset = () => {
    setMode("checkin");
    setMessage("");
    setError("");
    setPhoto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex justify-center items-center px-4">

      <div className="w-full max-w-md space-y-5">

        <h2 className="text-white text-2xl font-bold text-center">
          {mode === "checkin" ? "Check-In" : mode === "checkout" ? "Check-Out" : "Success"}
        </h2>

        {mode !== "done" && (
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl">
            <video ref={videoRef} autoPlay className="rounded-xl w-full bg-black" />
            <canvas ref={canvasRef} className="hidden"></canvas>

            <button onClick={startCamera} className="btn mt-3 w-full bg-indigo-500 text-white py-2 rounded-xl">
              เปิดกล้อง
            </button>

            <button onClick={capturePhoto} className="btn mt-2 w-full bg-white text-black py-2 rounded-xl">
              ถ่ายรูป
            </button>
          </div>
        )}

        {photo && (
          <img src={URL.createObjectURL(photo)} className="rounded-xl" />
        )}

        <div className="flex gap-3">
          <div className="bg-white w-full text-center rounded-xl py-2">{time}</div>
          <div className="bg-white w-full text-center rounded-xl py-2">{date}</div>
        </div>

        <button onClick={handleLocation} className="w-full py-3 rounded-xl bg-green-500 text-white">
          {location ? "ได้ตำแหน่งแล้ว ✅" : "ขอ GPS"}
        </button>

        {mode !== "done" && (
          <button onClick={handleConfirm} className="w-full py-4 bg-gradient-to-r from-green-300 to-green-500 rounded-xl font-bold">
            DONE
          </button>
        )}

        {message && <div className="bg-green-200 p-3 rounded-xl">{message}</div>}
        {error && <div className="bg-red-200 p-3 rounded-xl">{error}</div>}

        {mode === "done" && (
          <button onClick={reset} className="w-full bg-white py-3 rounded-xl">
            เริ่มใหม่
          </button>
        )}
      </div>

      {/* modal ออกก่อนเวลา */}
      {showEarlyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-5 rounded-2xl w-80">
            <h3 className="font-bold mb-2">ออกก่อนเวลา</h3>

            <textarea
              value={earlyReason}
              onChange={(e) => setEarlyReason(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="เหตุผล..."
            />

            <button onClick={handleEarlySubmit} className="mt-3 w-full bg-green-500 text-white py-2 rounded">
              ยืนยัน
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default CheckInOut;