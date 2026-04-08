import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function CheckOut() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
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

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

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
    if (!video?.srcObject) {
      setError("กรุณาเปิดกล้องก่อน");
      return;
    }

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
          setError("");
        }
      },
      "image/jpeg",
      0.85
    );
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError("เบราว์เซอร์ไม่รองรับ GPS");
      return;
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
        setError("ไม่สามารถดึงตำแหน่งได้ แต่ยังเช็คเอาท์ได้");
      }
    );
  };

  const isCheckoutEarly = () => {
    if (!userShift?.end_time) return false;

    const now = new Date();
    const [h, m] = userShift.end_time.split(":").map(Number);

    return now.getHours() < h || (now.getHours() === h && now.getMinutes() < m);
  };

  const submitCheckOut = async (overrideReason = null) => {
    if (!userShift) {
      setError("ยังไม่มีกะงาน กรุณาติดต่อหัวหน้า");
      return;
    }

    if (!photo) {
      setError("กรุณาถ่ายรูปก่อน");
      return;
    }

    if (isCheckoutEarly() && overrideReason === null) {
      setShowEarlyModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("photo", photo);

    if (location) {
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);
    }

    if (overrideReason) {
      formData.append("reason", overrideReason);
    }

    try {
      const res = await fetch("http://localhost:5000/attendance/check-out", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "เกิดข้อผิดพลาด");
        return;
      }

      setMessage(
        data.status === "early"
          ? `⚠️ เช็คเอาท์สำเร็จ (ออกก่อนเวลา)\n${data.note || ""}`
          : "✅ เช็คเอาท์สำเร็จ (ปกติ)"
      );

      setPhoto(null);
      setPhotoPreview(null);
      setLocation(null);
      setEarlyReason("");
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
      alert("กรุณาระบุเหตุผล");
      return;
    }

    setShowEarlyModal(false);
    submitCheckOut(earlyReason);
  };

  const resetForm = () => {
    setMessage("");
    setError("");
    setPhoto(null);
    setPhotoPreview(null);
    setEarlyReason("");
    setLocation(null);
    setShowEarlyModal(false);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (shiftLoading) {
    return (
      <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-md w-full">
          <div className="flex items-center justify-center relative mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 text-white text-3xl bg-transparent border-0"
              style={{ lineHeight: 1 }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <h2 className="text-xl font-bold text-white text-center">
              CHECK OUT
            </h2>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 text-white border border-white/20 text-center">
            <p className="text-white text-lg animate-pulse">กำลังโหลดกะงาน...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="flex items-center justify-center relative mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 text-white text-3xl bg-transparent border-0"
            style={{ lineHeight: 1 }}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <h2 className="text-xl font-bold text-white text-center">
            CHECK OUT
          </h2>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
          <div className="text-sm">
            <div className="font-semibold">ข้อมูลกะงาน</div>
            {userShift ? (
              <div className="mt-2 space-y-1 text-white/90">
                <div>เวลาเข้า: {userShift.start_time?.slice(0, 5)} น.</div>
                <div>เวลาออก: {userShift.end_time?.slice(0, 5)} น.</div>
              </div>
            ) : (
              <div className="mt-2 text-red-300">
                ⚠️ ยังไม่มีกะงาน กรุณาติดต่อหัวหน้า
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20 text-center">
            <div className="text-xs text-white/70 mb-1">TIME</div>
            <div className="text-lg font-bold">{time}</div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20 text-center">
            <div className="text-xs text-white/70 mb-1">DATE</div>
            <div className="text-sm font-semibold">{date}</div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
          <label className="block font-semibold mb-3 text-[#FFFFFF]">
            Camera
          </label>

          <div className="w-full rounded-2xl overflow-hidden border border-white/20 bg-black/30">
            <div className="aspect-video w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover bg-black"
              />
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={startCamera}
              className="w-full py-3 rounded-xl text-white text-base font-bold shadow-lg bg-[#636CCB] hover:scale-105 transform transition-all border-0"
            >
              <i className="bi bi-camera-video-fill"></i> เปิดกล้อง
            </button>

            <button
              type="button"
              onClick={capturePhoto}
              className="w-full py-3 rounded-xl text-[#3C467B] text-base font-bold shadow-lg bg-white hover:scale-105 transform transition-all border-0"
            >
              <i className="bi bi-camera-fill"></i> ถ่ายรูป
            </button>
          </div>
        </div>

        {photoPreview && (
          <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
            <label className="block font-semibold mb-3 text-[#FFFFFF]">
              Preview
            </label>

            <img
              src={photoPreview}
              alt="Captured"
              className="w-full rounded-2xl border border-white/20"
            />

            <div className="mt-3 text-sm text-green-300 font-medium">
              <i className="bi bi-check-circle-fill"></i> รูปพร้อมสำหรับเช็คเอาท์แล้ว
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleLocation}
            className={`w-full py-3 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg hover:scale-105 transform transition-all border-0 ${
              location ? "bg-green-500" : "bg-[#636CCB]"
            }`}
          >
            <i className="bi bi-geo-alt-fill"></i>{" "}
            {location ? "ได้ตำแหน่ง GPS แล้ว" : "ดึงตำแหน่ง GPS (ไม่บังคับ)"}
          </button>

          {userShift && (
            <button
              type="button"
              onClick={() => submitCheckOut(null)}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg hover:scale-105 transform transition-all border-0 ${
                loading ? "bg-gray-500" : "bg-red-500"
              }`}
            >
              {loading ? "กำลังบันทึก..." : "CONFIRM CHECK-OUT"}
            </button>
          )}

          <button
            type="button"
            onClick={resetForm}
            className="w-full py-3 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg bg-white/20 hover:scale-105 transform transition-all border border-white/20"
          >
            ล้างข้อมูล
          </button>
        </div>

        {message && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-4 rounded-2xl whitespace-pre-line">
            <div className="flex items-start gap-3">
              <i className="bi bi-check-circle-fill text-xl"></i>
              <span>{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-2xl whitespace-pre-line">
            <div className="flex items-start gap-3">
              <i className="bi bi-exclamation-triangle-fill text-xl"></i>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {showEarlyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-orange-500 p-5 text-center">
              <i className="bi bi-clock-history text-5xl text-white" />
              <h3 className="font-bold text-xl text-white mt-2">ออกก่อนเวลา!</h3>
              <p className="text-orange-100 text-sm mt-1">
                กะของคุณเลิก {userShift?.end_time?.slice(0, 5)} น.
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
                  type="button"
                  onClick={() => setShowEarlyModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors border-0"
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  onClick={handleEarlySubmit}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors border-0"
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

export default CheckOut;