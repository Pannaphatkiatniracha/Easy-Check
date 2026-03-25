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

  const [showEarlyModal, setShowEarlyModal] = useState(false);
  const [earlyReason, setEarlyReason] = useState("");
  const [isEarlyConfirmed, setIsEarlyConfirmed] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const USER_ID = "070504";

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
    if (!video || !video.srcObject) return setError("กรุณาเปิดกล้องก่อนถ่ายรูป");
    
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
        setPhoto(file);
      }
    }, "image/jpeg", 0.8);
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

  const handleConfirm = async () => {
    if (!location) return setError("กรุณาขอตำแหน่งก่อน");
    if (!photo) return setError("กรุณาถ่ายรูปยืนยันตัวตน");

    const now = new Date();
    
    // ตรวจสอบการออกก่อนเวลา 18:00
    if (mode === "checkout" && now.getHours() < 18 && !isEarlyConfirmed) {
      setShowEarlyModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("userId", USER_ID); 
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("photo", photo);
    if (earlyReason) formData.append("reason", earlyReason); // <--- ส่งเหตุผลไปด้วย!

    const apiPath = mode === "checkin" ? "check-in" : "check-out";

    try {
      // ยิงไปที่ /attendance/... ตาม API Spec
      const response = await fetch(`http://localhost:5000/attendance/${apiPath}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const data = {
          time, date, lat: location.lat, lng: location.lng, photo: URL.createObjectURL(photo), timestamp: now.getTime(),
        };

        if (mode === "checkin") {
          setCheckInData(data);
          setMessage(`เช็คอินสำเร็จ\nสถานะ: ${result.status === 'late' ? '⚠️ มาสาย' : '✅ ตรงเวลา'}`);
          setMode("checkout");
        } else {
          setCheckOutData(data);
          setMessage(`เช็คเอาท์สำเร็จ\nสถานะ: ${result.status === 'early' ? '⚠️ ออกก่อนเวลา' : '✅ ปกติ'}`);
          setMode("done");
        }
        
        setPhoto(null);
        setIsEarlyConfirmed(false);
        setEarlyReason("");
        stopCamera();
      } else {
        setError(result.message || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setError("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleEarlySubmit = () => {
    if (!earlyReason.trim()) return alert("กรุณากรอกเหตุผล");
    setIsEarlyConfirmed(true);
    setShowEarlyModal(false);
    setTimeout(() => handleConfirm(), 100);
  };

  const handleReset = () => {
    setCheckInData(null);
    setCheckOutData(null);
    setPhoto(null);
    setMode("checkin");
    setMessage("");
    setError("");
    setEarlyReason("");
    setIsEarlyConfirmed(false);
  };

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full space-y-6">
        
        <div className="flex items-center gap-3 mb-4">
          <Link to="/home" className="text-white text-2xl"><i className="bi bi-chevron-left"></i></Link>
          <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
            {mode === "checkin" ? "Check-In" : mode === "checkout" ? "Check-Out" : "Success"}
          </h1>
        </div>

        {mode !== "done" && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/20 flex flex-col items-center space-y-4">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl border-4 border-white object-cover aspect-[3/4] bg-black"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>

            <div className="flex flex-col w-full gap-3">
              <button onClick={startCamera} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white font-bold shadow-lg active:scale-95 transition">
                <i className="bi bi-camera-video-fill mr-2"></i> Open Camera
              </button>
              <button onClick={capturePhoto} className="w-full py-3 rounded-xl bg-white text-[#3C467B] font-bold shadow-lg active:scale-95 transition">
                <i className="bi bi-camera-fill mr-2"></i> Take a photo
              </button>
            </div>
          </div>
        )}

        {photo && mode !== "done" && (
          <div className="relative">
             <img src={URL.createObjectURL(photo)} alt="preview" className="w-full max-h-[300px] rounded-2xl border-4 border-white shadow-xl object-cover" />
            <p className="text-center text-white text-sm mt-1">รูปถ่ายปัจจุบัน</p>
          </div>
        )}

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-white text-[#3C467B] py-2 rounded-xl text-center font-bold shadow-inner">{time}</div>
          <div className="bg-white text-[#3C467B] py-2 rounded-xl text-center font-bold shadow-inner">{date}</div>
        </div>

        <button onClick={handleLocation} className={`w-full py-3 rounded-xl font-bold shadow-lg transition ${location ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-[#636CCB] to-[#7F5CFF] text-white'}`}>
          <i className="bi bi-geo-alt-fill mr-2"></i> 
          {location ? `พิกัด: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Request position access"}
        </button>

        {mode !== "done" && (
          <button onClick={handleConfirm} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#34FFB9] to-[#12C27E] text-black font-black text-xl shadow-xl active:scale-95 transition">
            DONE {mode.toUpperCase()}
          </button>
        )}

        <div className="grid grid-cols-1 gap-4">
          {checkInData && (
            <div className="p-4 rounded-2xl bg-white/20 border border-white/20 text-center">
              <h3 className="text-white font-bold"><i className="bi bi-box-arrow-in-right mr-2"></i>Check-In Details</h3>
              <p className="text-white text-sm">เวลา: {checkInData.time}</p>
              <img src={checkInData.photo} className="mt-2 w-full h-32 object-cover rounded-xl border border-white" alt="checkin" />
            </div>
          )}

          {checkOutData && (
            <div className="p-4 rounded-2xl bg-white/20 border border-white/20 text-center">
              <h3 className="text-white font-bold"><i className="bi bi-box-arrow-left mr-2"></i>Check-Out Details</h3>
              <p className="text-white text-sm">เวลา: {checkOutData.time}</p>
              <img src={checkOutData.photo} className="mt-2 w-full h-32 object-cover rounded-xl border border-white" alt="checkout" />
            </div>
          )}
        </div>

        {message && (
          <div className="p-4 bg-green-100/90 border-l-4 border-green-500 rounded-xl text-[#1F224F] font-bold whitespace-pre-line animate-bounce-short">
            {message}
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100/90 border-l-4 border-red-500 rounded-xl text-red-700 font-bold">
            <i className="bi bi-exclamation-triangle-fill mr-2"></i>{error}
          </div>
        )}

        {mode === "done" && (
          <button onClick={handleReset} className="w-full py-3 rounded-xl bg-white text-[#3C467B] font-bold shadow-lg hover:bg-gray-100 transition">
            เริ่มใหม่ (Reset)
          </button>
        )}
      </div>

      {showEarlyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="text-yellow-500 text-5xl mb-4"><i className="bi bi-exclamation-circle-fill"></i></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">ออกก่อนเวลา 18:00</h3>
            <p className="text-gray-600 mb-4 text-sm">กรุณาระบุเหตุผลที่ต้องการออกก่อนเวลาเพื่อแจ้งให้ผู้ดูแลทราบ</p>

            <textarea
              value={earlyReason} onChange={(e) => setEarlyReason(e.target.value)}
              placeholder="เช่น ทำงานเสร็จแล้ว หรือ มีธุระด่วน..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-[#636CCB] outline-none transition" rows={3}
            />

            <div className="flex gap-3">
               <button onClick={() => setShowEarlyModal(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300">ยกเลิก</button>
              <button onClick={handleEarlySubmit} className="flex-1 py-3 bg-[#12C27E] text-white rounded-xl font-bold shadow-lg hover:bg-[#0ea86d]">ส่งและยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckInOut;