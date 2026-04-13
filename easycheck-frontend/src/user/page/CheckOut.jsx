import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

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

function CheckOut() {
  const navigate = useNavigate();
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

  const [showEarlyModal, setShowEarlyModal] = useState(false);
  const [earlyReason, setEarlyReason] = useState("");

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

        // ดึง branch_id และ role_id ของ User
        const branchId = user?.branch_id || "";
        const roleId = user?.role_id || ""; 
        
        // แนบทั้ง branch_id และ role_id ไปให้ Backend ตรวจสอบ
        const locationRes = await fetch(`http://localhost:5000/gps-locations/active?branch_id=${branchId}&role_id=${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (locationRes.ok) {
          const locationsData = await locationRes.json();
          
          if (locationsData.length > 0) {
            setActiveLocations(locationsData);
          } else {
            setError("ไม่พบพิกัดจุดเช็คเอาท์สำหรับสาขาของคุณ");
          }
        }
      } catch (err) {
        setError("เชื่อมต่อ server ไม่ได้");
      } finally {
        setShiftLoading(false);
      }
    };
    fetchData();
  }, [token, user?.branch_id, user?.role_id]); // เพิ่ม user?.role_id ใน dependency array

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
    if (activeLocations.length === 0) return setError("ไม่พบข้อมูลจุดเช็คเอาท์");

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
        setError("ไม่สามารถดึงตำแหน่งได้ กรุณาเปิด GPS");
        setMessage("");
      },
      { enableHighAccuracy: true }
    );
  };

  const isCheckoutEarly = () => {
    if (!userShift?.end_time) return false;
    const now = new Date();
    const [h, m] = userShift.end_time.split(":").map(Number);
    const shiftMins = h * 60 + m;
    const currentMins = now.getHours() * 60 + now.getMinutes();
    return currentMins < shiftMins; 
  };

  const submitCheckOut = async (overrideReason = null) => {
    if (!userShift) return setError("ยังไม่มีกะงาน กรุณาติดต่อหัวหน้า");
    if (!photo) return setError("กรุณาถ่ายรูปก่อน");
    if (!location || !isWithinRadius) return setError("กรุณายืนยันพิกัดให้อยู่ในพื้นที่ที่กำหนด");

    if (isCheckoutEarly() && overrideReason === null) {
      setShowEarlyModal(true);
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("photo", photo);

    //เพิ่มขึ้นมา 😘ส่งพิกัดของผู้ใช้ไปให้ backend บันทึกลงคอลัมน์ check_out_lat / check_out_lng
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);

    if (userId) formData.append("userId", userId);
    if (overrideReason) formData.append("reason", overrideReason);

    // ส่ง location_id ของจุดที่ใกล้ที่สุด เพื่อให้ backend รู้ว่าเช็คเอาท์จากจุดไหน
    if (nearestLocation) formData.append("location_id", nearestLocation.id);

    try {
      const res = await fetch("http://localhost:5000/attendance/check-out", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "เกิดข้อผิดพลาด");

      setMessage(data.status === "early" ? ` ออกก่อนเวลา\nบันทึกเหตุผลแล้ว` : " เช็คเอาท์สำเร็จ");
      setPhoto(null);
      setPhotoPreview(null);
      stopCamera();
    } catch (err) {
      setError("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleEarlySubmit = () => {
    if (!earlyReason.trim()) return alert("กรุณาระบุเหตุผล");
    setShowEarlyModal(false);
    submitCheckOut(earlyReason);
  };

  useEffect(() => () => stopCamera(), []);

  if (shiftLoading) return <div className="min-h-screen bg-[#1F224F] flex items-center justify-center text-white">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="flex items-center justify-center relative mb-2">
          <button onClick={() => navigate(-1)} className="absolute left-0 text-white text-3xl bg-transparent border-0"><i className="bi bi-chevron-left"></i></button>
          <h2 className="text-xl font-bold text-white text-center">CHECK OUT</h2>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
          <div className="text-sm font-semibold">ข้อมูลกะงาน</div>
          {userShift ? (
             <div className="mt-2 space-y-1">เข้า: {userShift.start_time?.slice(0, 5)} น. | ออก: {userShift.end_time?.slice(0, 5)} น.</div>
          ) : (
            <div className="mt-2 text-red-300"> ยังไม่มีกะงาน</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 text-white text-center"><div className="text-xs mb-1">TIME</div><div className="text-lg font-bold">{time}</div></div>
          <div className="bg-white/10 rounded-2xl p-4 text-white text-center"><div className="text-xs mb-1">DATE</div><div className="text-sm font-semibold">{date}</div></div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
          <label className="block font-semibold mb-3">Camera</label>
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={startCamera} className="w-full py-3 rounded-xl text-white font-bold bg-[#636CCB]"><i className="bi bi-camera-video-fill"></i> เปิดกล้อง</button>
            <button onClick={capturePhoto} className="w-full py-3 rounded-xl text-[#3C467B] font-bold bg-white"><i className="bi bi-camera-fill"></i> ถ่ายรูป</button>
          </div>
        </div>

        {photoPreview && (
           <div className="bg-white/10 rounded-2xl p-4 text-white border border-white/20">
             <label className="block font-semibold mb-3">Preview</label>
             <img src={photoPreview} alt="Captured" className="w-full rounded-2xl" />
           </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleLocation}
            className={`w-full py-3 rounded-xl text-[#FFFFFF] font-bold transition-all ${isWithinRadius ? "bg-green-500" : "bg-[#636CCB]"}`}
          >
            <i className="bi bi-geo-alt-fill mr-2"></i>{location ? `อัปเดตพิกัด (${distance}m)` : "เช็คพิกัด GPS (บังคับ)"}
          </button>

          {userShift && (
            <button
              onClick={() => submitCheckOut(null)}
              disabled={loading || !isWithinRadius}
              className={`w-full py-3 rounded-xl text-white font-bold transition-all ${loading || !isWithinRadius ? "bg-gray-500 opacity-50" : "bg-red-500 hover:scale-105"}`}
            >
              {loading ? "กำลังบันทึก..." : "CONFIRM CHECK-OUT"}
            </button>
          )}
        </div>

        {message && <div className="bg-green-500/20 text-green-100 p-4 rounded-2xl whitespace-pre-line"><i className="bi bi-check-circle-fill mr-2"></i>{message}</div>}
        {error && <div className="bg-red-500/20 text-red-100 p-4 rounded-2xl whitespace-pre-line"><i className="bi bi-exclamation-triangle-fill mr-2"></i>{error}</div>}
      </div>

      {showEarlyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            <div className="bg-orange-500 p-5 text-center text-white">
              <i className="bi bi-clock-history text-5xl" />
              <h3 className="font-bold text-xl mt-2">ออกก่อนเวลา!</h3>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={earlyReason}
                onChange={(e) => setEarlyReason(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl h-24 text-black"
                placeholder="ระบุเหตุผล เช่น ไปพบแพทย์..."
              />
              <div className="flex gap-2">
                <button onClick={() => setShowEarlyModal(false)} className="flex-1 bg-gray-100 py-3 rounded-xl font-medium text-black">ยกเลิก</button>
                <button onClick={handleEarlySubmit} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold">ส่งและเช็คเอาท์</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckOut;