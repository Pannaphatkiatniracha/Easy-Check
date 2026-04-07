import { useState, useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function CheckInOut() {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [mode, setMode] = useState("checkin");
  const [loading, setLoading] = useState(false);

  const [userShift, setUserShift] = useState(null);
  const [shiftLoading, setShiftLoading] = useState(true);

  const [showEarlyModal, setShowEarlyModal] = useState(false);
  const [earlyReason, setEarlyReason] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("th-TH"));
      setDate(
        now.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const res = await fetch("http://localhost:5000/attendance/shift/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setUserShift(null);
          setError(data.message || "ไม่สามารถโหลดกะงานได้");
          return;
        }

        setUserShift(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("เชื่อมต่อ server ไม่ได้");
      } finally {
        setShiftLoading(false);
      }
    };

    fetchShift();
  }, [token]);

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

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video?.srcObject) return setError("กรุณาเปิดกล้องก่อน");

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
          setPhoto(file);
          setPhotoPreview(URL.createObjectURL(blob));
        }
      },
      "image/jpeg",
      0.85
    );
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      return setError("เบราว์เซอร์ไม่รองรับ GPS");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError("");
      },
      () => {
        setError("ไม่สามารถดึงตำแหน่งได้ แต่ยังเช็คอิน/เช็คเอาท์ได้");
      }
    );
  };

  const isCheckoutEarly = () => {
    if (!userShift) return false;

    const now = new Date();
    const [h, m] = userShift.end_time.split(":").map(Number);

    return now.getHours() < h || (now.getHours() === h && now.getMinutes() < m);
  };

  const handleConfirm = async (overrideReason = null) => {
    if (!userShift) return setError("ยังไม่มีกะงาน กรุณาติดต่อหัวหน้า");
    if (!photo) return setError("กรุณาถ่ายรูปก่อน");

    if (mode === "checkout" && isCheckoutEarly() && overrideReason === null) {
      setShowEarlyModal(true);
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("photo", photo);

    if (location) {
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);
    }

    if (overrideReason) {
      formData.append("reason", overrideReason);
    }

    const endpoint = mode === "checkin" ? "check-in" : "check-out";

    try {
      const res = await fetch(`http://localhost:5000/attendance/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "เกิดข้อผิดพลาด");
      }

      if (mode === "checkin") {
        setMessage(
          data.status === "late"
            ? "⚠️ เช็คอินสำเร็จ (มาสาย)\nระบบบันทึกเวลาเรียบร้อยแล้ว"
            : "✅ เช็คอินสำเร็จ (ตรงเวลา)"
        );
        setMode("checkout");
      } else {
        setMessage(
          data.status === "early"
            ? `⚠️ เช็คเอาท์สำเร็จ (ออกก่อนเวลา)\n${data.note || ""}`
            : "✅ เช็คเอาท์สำเร็จ (ปกติ)"
        );
        setMode("done");
      }

      setPhoto(null);
      setPhotoPreview(null);
      stopCamera();
    } catch (err) {
      console.error(err);
      setError("เชื่อมต่อ Server ไม่ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleEarlySubmit = () => {
    if (!earlyReason.trim()) {
      return alert("กรุณาระบุเหตุผล");
    }

    setShowEarlyModal(false);
    handleConfirm(earlyReason);
  };

  const reset = () => {
    setMode("checkin");
    setMessage("");
    setError("");
    setPhoto(null);
    setPhotoPreview(null);
    setEarlyReason("");
    setLocation(null);
  };

  if (shiftLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex items-center justify-center">
        <p className="text-white text-lg animate-pulse">กำลังโหลดกะงาน...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex justify-center items-center px-4 font-sans text-gray-100">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-5">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
            {mode === "checkin"
              ? "🟢 Check-In"
              : mode === "checkout"
              ? "🔴 Check-Out"
              : "✅ เสร็จสิ้น"}
          </h2>

          {userShift ? (
            <p className="text-sm text-indigo-200 mt-1">
              กะงาน: {userShift.start_time.slice(0, 5)} – {userShift.end_time.slice(0, 5)} น.
            </p>
          ) : (
            <p className="text-sm text-red-300 mt-1">⚠️ ยังไม่มีกะงาน กรุณาติดต่อหัวหน้า</p>
          )}
        </div>

        <div className="flex gap-3">
          <div className="bg-white/20 border border-white/10 w-full text-center rounded-xl py-3 backdrop-blur-sm">
            <span className="block text-[10px] text-indigo-200 uppercase tracking-widest">เวลา</span>
            <span className="text-xl font-bold">{time}</span>
          </div>

          <div className="bg-white/20 border border-white/10 w-full text-center rounded-xl py-3 backdrop-blur-sm">
            <span className="block text-[10px] text-indigo-200 uppercase tracking-widest">วันที่</span>
            <span className="text-sm font-semibold">{date}</span>
          </div>
        </div>

        {mode !== "done" && (
          <div className="bg-black/20 p-3 rounded-2xl shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-xl w-full bg-black aspect-video object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2 mt-3">
              <button
                onClick={startCamera}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-xl font-medium shadow-md flex justify-center items-center gap-2 transition-colors"
              >
                <i className="bi bi-camera-video-fill" /> เปิดกล้อง
              </button>

              <button
                onClick={capturePhoto}
                className="flex-1 bg-white hover:bg-gray-100 text-indigo-900 py-2.5 rounded-xl font-medium shadow-md flex justify-center items-center gap-2 transition-colors"
              >
                <i className="bi bi-camera-fill" /> ถ่ายรูป
              </button>
            </div>
          </div>
        )}

        {photoPreview && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-green-400 shadow-lg">
            <img src={photoPreview} alt="Captured" className="w-full h-auto" />
            <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <i className="bi bi-check-circle-fill" /> รูปพร้อมแล้ว
            </div>
          </div>
        )}

        {mode !== "done" && (
          <button
            onClick={handleLocation}
            className={`w-full py-3 rounded-xl font-bold shadow-md flex justify-center items-center gap-2 transition-all ${
              location
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <i className="bi bi-geo-alt-fill" />
            {location ? "✔ ได้ตำแหน่งแล้ว" : "ดึงตำแหน่ง GPS (ไม่บังคับ)"}
          </button>
        )}

        {mode !== "done" && userShift && (
          <button
            onClick={() => handleConfirm(null)}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white rounded-xl font-bold text-lg shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "กำลังบันทึก..."
              : `CONFIRM ${mode === "checkin" ? "CHECK-IN" : "CHECK-OUT"}`}
          </button>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-4 rounded-xl flex items-start gap-3 whitespace-pre-line">
            <i className="bi bi-check-circle text-xl" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-xl flex items-start gap-3 whitespace-pre-line">
            <i className="bi bi-exclamation-triangle text-xl" />
            <span>{error}</span>
          </div>
        )}

        {mode === "done" && (
          <button
            onClick={reset}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 rounded-xl transition-all"
          >
            เริ่มต้นใหม่
          </button>
        )}
      </div>

      {showEarlyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-orange-500 p-5 text-center">
              <i className="bi bi-clock-history text-5xl text-white" />
              <h3 className="font-bold text-xl text-white mt-2">ออกก่อนเวลา!</h3>
              <p className="text-orange-100 text-sm mt-1">
                กะของคุณเลิก {userShift?.end_time.slice(0, 5)} น.
              </p>
            </div>

            <div className="p-6 space-y-4 text-gray-800">
              <p className="text-sm text-gray-500 text-center">
                ระบบจะ<b>บันทึกเวลาออกทันที</b> และส่งเหตุผลให้หัวหน้าตรวจสอบ
              </p>

              <textarea
                value={earlyReason}
                onChange={(e) => setEarlyReason(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-orange-500 outline-none p-3 rounded-xl resize-none h-24 transition-colors text-sm"
                placeholder="เช่น ไปพบแพทย์, ลากิจด่วน, ไปรับบุตรหลาน..."
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEarlyModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                >
                  ยกเลิก
                </button>

                <button
                  onClick={handleEarlySubmit}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  ส่งและเช็คเอาท์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckInOut;