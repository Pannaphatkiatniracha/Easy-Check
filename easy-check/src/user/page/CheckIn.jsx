import { useState, useEffect, useRef } from "react";

function CheckIn() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const [photo, setPhoto] = useState(null);
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
        video: { facingMode: "user" }
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
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      setPhoto(file);
    });
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setError("");
      },
      () => setError("ไม่สามารถเข้าถึงตำแหน่ง ควรเปิด GPS")
    );
  };

  const handleCheckIn = async () => {
    if (!name) return setError("กรุณากรอกชื่อ");
    if (!location) return setError("กรุณาขอตำแหน่งก่อน");
    if (!photo) return setError("กรุณาถ่ายรูปยืนยันตัวตน");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("photo", photo);

    try {
      const res = await fetch("http://localhost:5000/api/checkin", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setMessage(` เช็คอินสำเร็จ\nวันที่: ${date}\nเวลา: ${time}`);
      setError("");

      // ปิดกล้องหลังเช็คอิน
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเช็คอิน");
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold text-yellow-300 mb-4">📍 Check In</h1>

      <video ref={videoRef} autoPlay className="w-64 rounded-lg border mb-4"></video>
      <canvas ref={canvasRef} className="hidden"></canvas>

      <button
        onClick={startCamera}
        className="w-60 bg-blue-500 py-2 rounded-md font-semibold mb-3"
      >
        เปิดกล้อง
      </button>

      <button
        onClick={capturePhoto}
        className="w-60 bg-yellow-400 text-indigo-900 py-2 rounded-md font-semibold mb-4"
      >
        ถ่ายรูป
      </button>

      {photo && (
        <img
          src={URL.createObjectURL(photo)}
          alt="preview"
          className="w-48 rounded mb-4 border"
        />
      )}

      <input
        type="text"
        className="w-60 p-2 rounded-md text-black mb-3"
        placeholder="ชื่อ"
        onChange={(e) => setName(e.target.value)}
      />

      <div className="w-60 bg-gray-200 text-black text-center py-2 rounded mb-2">
         {time}
      </div>

      <div className="w-60 bg-gray-200 text-black text-center py-2 rounded mb-4">
         {date}
      </div>

      <button
        onClick={handleLocation}
        className="w-60 bg-green-500 py-2 rounded-md font-semibold mb-3"
      >
        ขอใช้ตำแหน่ง
      </button>

      <button
        onClick={handleCheckIn}
        className="w-32 bg-yellow-400 text-indigo-900 py-2 rounded-md font-semibold"
      >
        Done
      </button>

      {location && (
        <p className="text-green-300 mt-3 text-sm">
          ตำแหน่ง: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
        </p>
      )}

      {message && (
        <div className="mt-4 p-3 bg-green-600 rounded-lg text-white w-64 text-center whitespace-pre-line">
          {message}
        </div>
      )}

      {error && <p className="mt-3 text-red-400">{error}</p>}
    </div>
  );
}

export default CheckIn;
