import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

// สูตรคำนวณระยะห่าง 2 จุด GPS
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; 
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

function CheckIn() {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [activeLocations, setActiveLocations] = useState([]);
  const [nearestLocation, setNearestLocation] = useState(null);
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userShift, setUserShift] = useState(null);
  const [shiftLoading, setShiftLoading] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id_employee || user?.id || localStorage.getItem("userId");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("th-TH"));
      setDate(now.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shiftRes = await fetch("http://localhost:5000/attendance/shift/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const shiftData = await shiftRes.json();
        if (!shiftRes.ok) {
          setError(shiftData.message || "ไม่สามารถโหลดกะงานได้");
        } else {
          setUserShift(shiftData);
        }

        // ดึง branch_id และ role_id ของ User ที่ล็อกอินอยู่
        const branchId = user?.branch_id || "";
        const roleId = user?.role_id || ""; // <-- เพิ่มตรงนี้
        
        // ส่งทั้ง branch_id และ role_id ไปให้ Backend จัดการ
        const locationRes = await fetch(`http://localhost:5000/gps-locations/active?branch_id=${branchId}&role_id=${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (locationRes.ok) {
          const locationsData = await locationRes.json();
          
          if (locationsData.length > 0) {
            setActiveLocations(locationsData);
          } else {
            setError("ไม่พบพิกัดจุดเช็คอินสำหรับสาขาของคุณ");
          }
        }
      } catch (err) {
        setError("เชื่อมต่อ server ไม่ได้");
      } finally {
        setShiftLoading(false);
      }
    };
    fetchData();
  }, [token, user?.branch_id, user?.role_id]); // <-- อัปเดต dependency array

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
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
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setPhoto(new File([blob], "photo.jpg", { type: "image/jpeg" }));
        setPhotoPreview(URL.createObjectURL(blob));
        setError("");
      }
    }, "image/jpeg", 0.85);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) return setError("เบราว์เซอร์ไม่รองรับ GPS");
    if (activeLocations.length === 0) return setError("ข้อมูลพิกัดยังไม่พร้อม หรือ ไม่มีสิทธิ์เช็คอินที่สาขานี้");

    setMessage("กำลังค้นหาพิกัด...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        
        let minDistance = Infinity;
        let closestLocation = null;

        activeLocations.forEach((loc) => {
          const dist = getDistance(lat, lng, loc.lat, loc.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestLocation = loc;
          }
        });

        const finalDistance = Math.round(minDistance);
        setDistance(finalDistance);
        setNearestLocation(closestLocation);
        
        const allowedRadius = closestLocation.radius || 100;

        if (finalDistance <= allowedRadius) {
          setIsWithinRadius(true);
          setError("");
          setMessage(` อยู่ในพื้นที่: ${closestLocation.name}\n(ห่าง ${finalDistance} เมตร)`);
        } else {
          setIsWithinRadius(false);
          setError(`อยู่นอกพื้นที่\n(จุดใกล้สุด: ${closestLocation.name} ห่าง ${finalDistance} เมตร)`);
          setMessage("");
        }
      },
      () => {
        setError("ไม่สามารถดึงตำแหน่งได้ กรุณาเปิด GPS และอนุญาตสิทธิ์");
        setMessage("");
      },
      { enableHighAccuracy: true }
    );
  };

  const isCheckInTooEarly = () => {
    if (!userShift?.start_time) return false;
    const now = new Date();
    const [h, m] = userShift.start_time.split(":").map(Number);
    const shiftMins = h * 60 + m;
    const currentMins = now.getHours() * 60 + now.getMinutes();
    return (shiftMins - currentMins > 60); 
  };

  const handleCheckIn = async () => {
    if (!userShift) return setError("ยังไม่มีกะงาน กรุณาติดต่อหัวหน้า");
    if (isCheckInTooEarly()) return setError("ยังไม่ถึงเวลาเช็คอิน (ล่วงหน้าได้ไม่เกิน 1 ชม.)");
    if (!photo) return setError("กรุณาถ่ายรูปก่อน");
    if (!location || !isWithinRadius) return setError("กรุณายืนยันพิกัดให้อยู่ในพื้นที่");

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("photo", photo);

    if (userId) formData.append("userId", userId);

    // ส่ง location_id ของจุดที่ใกล้ที่สุด (ที่ validate ผ่านแล้ว) เพื่อบันทึกว่าเช็คอินที่จุดไหน
    if (nearestLocation) formData.append("location_id", nearestLocation.id);

    try {
      const res = await fetch("http://localhost:5000/attendance/check-in", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "เกิดข้อผิดพลาด");

      setMessage(data.status === "late" 
        ? " เช็คอินสำเร็จ (มาสาย)\nระบบบันทึกเวลาเรียบร้อยแล้ว" 
        : " เช็คอินสำเร็จ (ตรงเวลา)");

      setPhoto(null);
      setPhotoPreview(null);
      stopCamera();
    } catch (err) {
      setError("เชื่อมต่อ Server ไม่ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMessage("");
    setError("");
    setPhoto(null);
    setPhotoPreview(null);
    setLocation(null);
    setDistance(null);
    setIsWithinRadius(false);
    stopCamera();
  };

  useEffect(() => () => stopCamera(), []);

  if (shiftLoading) return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex items-center justify-center">
      <div className="text-white text-lg animate-pulse">กำลังโหลดข้อมูล...</div>
    </div>
  );

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="flex items-center justify-between mb-2">
          <Link to="/home" className="text-decoration-none">
            <button className="p-0 bg-transparent border-0"><i className="bi bi-chevron-left ms-3 text-white text-2xl"></i></button>
          </Link>
          <h2 className="text-xl font-bold text-white text-center flex-1">CHECK IN</h2>
          <div className="me-4 w-8"></div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
          <div className="text-sm font-semibold">ข้อมูลกะงาน</div>
          {userShift ? (
            <div className="mt-2 space-y-1 text-white/90">
              <div>เวลาเข้า: {userShift.start_time?.slice(0, 5)} น. | ออก: {userShift.end_time?.slice(0, 5)} น.</div>
            </div>
          ) : (
            <div className="mt-2 text-red-300"> ยังไม่มีกะงาน กรุณาติดต่อหัวหน้า</div>
          )}
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
          <label className="block font-semibold mb-3">Camera</label>
          <div className="w-full rounded-2xl overflow-hidden border border-white/20 bg-black/30 aspect-video">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover bg-black" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={startCamera} className="w-full py-3 rounded-xl text-white font-bold bg-[#636CCB] hover:scale-105 transition-all">
              <i className="bi bi-camera-video-fill mr-2"></i> เปิดกล้อง
            </button>
            <button onClick={capturePhoto} className="w-full py-3 rounded-xl text-[#3C467B] font-bold bg-white hover:scale-105 transition-all">
              <i className="bi bi-camera-fill mr-2"></i> ถ่ายรูป
            </button>
          </div>
        </div>

        {photoPreview && (
          <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
            <label className="block font-semibold mb-3 text-[#FFFFFF]">Preview</label>
            <img src={photoPreview} alt="Captured" className="w-full rounded-2xl border border-white/20" />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleLocation}
            className={`w-full py-3 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg hover:scale-105 transform transition-all ${
              isWithinRadius ? "bg-green-500" : "bg-[#636CCB]"
            }`}
          >
            <i className="bi bi-geo-alt-fill mr-2"></i>
            {location ? `อัปเดตพิกัด (${distance}m)` : "เช็คพิกัด GPS (บังคับ)"}
          </button>

          {userShift && (
            <button
              onClick={handleCheckIn}
              disabled={loading || !isWithinRadius}
              className={`w-full py-3 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg transition-all ${
                loading || !isWithinRadius ? "bg-gray-500 opacity-50 cursor-not-allowed" : "bg-green-500 hover:scale-105"
              }`}
            >
              {loading ? "กำลังบันทึก..." : "CONFIRM CHECK-IN"}
            </button>
          )}
          
          <button onClick={resetForm} className="w-full py-3 rounded-xl text-[#FFFFFF] text-lg font-bold shadow-lg bg-white/20 hover:scale-105 transition-all">
            ล้างข้อมูล
          </button>
        </div>

        {message && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-4 rounded-2xl whitespace-pre-line">
            <i className="bi bi-check-circle-fill mr-2"></i>{message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-2xl whitespace-pre-line">
            <i className="bi bi-exclamation-triangle-fill mr-2"></i>{error}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckIn;