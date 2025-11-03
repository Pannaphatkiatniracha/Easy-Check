import { useState, useEffect, useRef } from "react";

function CheckInOut() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const [photo, setPhoto] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [checkOutData, setCheckOutData] = useState(null);
  const [mode, setMode] = useState("checkin"); // checkin | checkout | done

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // อัปเดตเวลาแบบ real-time
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
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      setPhoto(file);
    });
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError("");
      },
      () => setError("ไม่สามารถเข้าถึงตำแหน่ง ควรเปิด GPS")
    );
  };

  const handleConfirm = async () => {
    if (!name) return setError("กรุณากรอกชื่อ");
    if (!location) return setError("กรุณาขอตำแหน่งก่อน");
    if (!photo) return setError("กรุณาถ่ายรูปยืนยันตัวตน");

    const now = new Date();
    const timestamp = now.getTime();

    if (mode === "checkin") {
      // เช็คอิน
      const data = { time, date, lat: location.lat, lng: location.lng, photo, timestamp };
      setCheckInData(data);
      localStorage.setItem("checkInData", JSON.stringify(data));
      setMessage(`✅ เช็คอินสำเร็จ\nเวลา: ${time}`);
      setMode("checkout");
      setPhoto(null);
    } else if (mode === "checkout") {
      // เช็คเอาท์
      const data = { time, date, lat: location.lat, lng: location.lng, photo, timestamp };
      setCheckOutData(data);
      localStorage.setItem("checkOutData", JSON.stringify(data));

      // คำนวณเวลาทำงานรวม
      if (checkInData) {
        const durationMs = timestamp - checkInData.timestamp;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        setMessage(`✅ เช็คเอาท์สำเร็จ\nเวลา: ${time}\n⏱ เวลาทำงานรวม: ${hours} ชั่วโมง ${minutes} นาที`);
      }

      setMode("done");
      setPhoto(null);
    }

    // ปิดกล้อง
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
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold text-yellow-300 mb-4">📍 Check-In / Check-Out</h1>

      <video ref={videoRef} autoPlay className="w-64 rounded-lg border mb-4"></video>
      <canvas ref={canvasRef} className="hidden"></canvas>

      {mode !== "done" && (
        <>
          <button
            onClick={startCamera}
            className="w-60 bg-blue-500 py-2 rounded-md font-semibold mb-3"
          >
            เปิดกล้อง ({mode === "checkin" ? "เช็คอิน" : "เช็คเอาท์"})
          </button>

          <button
            onClick={capturePhoto}
            className="w-60 bg-yellow-400 text-indigo-900 py-2 rounded-md font-semibold mb-4"
          >
            ถ่ายรูป
          </button>
        </>
      )}

      {photo && (
        <img
          src={URL.createObjectURL(photo)}
          alt="preview"
          className="w-48 rounded mb-4 border"
        />
      )}

      {mode === "checkin" && !checkInData && (
        <input
          type="text"
          className="w-60 p-2 rounded-md text-black mb-3"
          placeholder="ชื่อ"
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <div className="w-60 bg-gray-200 text-black text-center py-2 rounded mb-2">{time}</div>
      <div className="w-60 bg-gray-200 text-black text-center py-2 rounded mb-4">{date}</div>

      <button
        onClick={handleLocation}
        className="w-60 bg-green-500 py-2 rounded-md font-semibold mb-3"
      >
        ขอใช้ตำแหน่ง
      </button>

      {mode !== "done" && (
        <button
          onClick={handleConfirm}
          className="w-32 bg-yellow-400 text-indigo-900 py-2 rounded-md font-semibold mb-4"
        >
          Done
        </button>
      )}

      {checkInData && (
        <div className="border p-4 rounded-xl bg-white/10 w-60 mb-2 text-center">
          <h3 className="font-bold text-yellow-300">📍 เช็คอิน</h3>
          <p>เวลา: {checkInData.time}</p>
          <img src={URL.createObjectURL(checkInData.photo)} alt="Check-In" className="mt-2 rounded-lg" />
        </div>
      )}

      {checkOutData && (
        <div className="border p-4 rounded-xl bg-white/10 w-60 mb-2 text-center">
          <h3 className="font-bold text-yellow-300">🏁 เช็คเอาท์</h3>
          <p>เวลา: {checkOutData.time}</p>
          <img src={URL.createObjectURL(checkOutData.photo)} alt="Check-Out" className="mt-2 rounded-lg" />
        </div>
      )}

      {message && (
        <div className="mt-4 p-3 bg-green-600 rounded-lg text-white w-60 text-center whitespace-pre-line">
          {message}
        </div>
      )}

      {error && <p className="mt-3 text-red-400">{error}</p>}

      {mode === "done" && (
        <button
          onClick={handleReset}
          className="w-60 py-2 rounded-md bg-red-500 text-white font-bold mt-4"
        >
         // เริ่มใหม่
        </button>
      )}
    </div>
  );
}

export default CheckInOut;
