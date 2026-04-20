import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/notifications";

const TYPE_CONFIG = {
  leave_approved: { icon: "bi-check-circle-fill", color: "text-green-500", bg: "bg-green-50" },
  leave_rejected: { icon: "bi-x-circle-fill",     color: "text-red-500",   bg: "bg-red-50"   },
  default:        { icon: "bi-bell-fill",         color: "text-blue-500",  bg: "bg-blue-50"  },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.default;

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return "เมื่อกี้";
  if (diff < 3600)  return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  return new Date(dateStr).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);

  const token      = sessionStorage.getItem("token") || "";
  const authHeader = { Authorization: `Bearer ${token}` };

  const loadNotifications = useCallback(async () => {
    try {
      const res = await axios.get(API, { headers: authHeader });
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── โหลดข้อมูลครั้งแรก ─────────────────
  useEffect(() => { 
    loadNotifications(); 
  }, [loadNotifications]);

  // ── SSE: เปิดการเชื่อมต่อเพื่อรอรับ Real-time Updates ─────────────────
  useEffect(() => {
    if (!token) return;

    // ต้องส่ง Token ผ่าน Query String เพราะ EventSource ส่ง Header ไม่ได้
    const eventSource = new EventSource(`${API}/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // หาก Backend ส่ง signal triggerRefresh ให้โหลดรายการใหม่ทันที
      if (data.triggerRefresh) {
        loadNotifications();
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error:", error);
      eventSource.close();
    };

    // ปิดการเชื่อมต่อเมื่อผู้ใช้ออกจากหน้านี้
    return () => {
      eventSource.close();
    };
  }, [token, loadNotifications]);

  const handleRead = async (id) => {
    // Optimistic UI update: อัปเดตหน้าจอก่อนยิง API เพื่อความลื่นไหล
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
    );
    try {
      await axios.put(`${API}/${id}/read`, {}, { headers: authHeader });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadAll = async () => {
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    try {
      await axios.put(`${API}/read-all`, {}, { headers: authHeader });
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F]
                    flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Link to="/home" className="text-white text-2xl">
            <i className="bi bi-chevron-left" />
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">NOTIFICATIONS</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold
                               px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 ? (
            <button
              onClick={handleReadAll}
              disabled={markingAll}
              className="text-xs text-white/70 hover:text-white transition disabled:opacity-50"
            >
              อ่านทั้งหมด
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-white text-center flex items-center justify-center gap-2 py-10">
            <i className="bi bi-arrow-repeat animate-spin" />
            <span className="text-white/60 text-sm">กำลังโหลด...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && notifications.length === 0 && (
          <div className="bg-white/10 rounded-2xl p-10 border border-white/20
                          flex flex-col items-center gap-3">
            <i className="bi bi-bell-slash text-4xl text-white/30" />
            <div className="text-white/50 text-sm">ไม่มีการแจ้งเตือน</div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3 pb-10">
          {notifications.map((n) => {
            const cfg = getConfig(n.type);
            const isUnread = n.is_read === 0;

            return (
              <div
                key={n.id}
                onClick={() => isUnread && handleRead(n.id)}
                className={`rounded-2xl p-4 border transition-all cursor-pointer
                  ${isUnread
                    ? "bg-white border-white/30 shadow-md"
                    : "bg-white/10 border-white/10"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                   flex-shrink-0 ${cfg.bg}`}>
                    <i className={`bi ${cfg.icon} ${cfg.color} text-lg`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm
                      ${isUnread ? "text-gray-800" : "text-white/80"}`}>
                      {n.title}
                    </div>
                    <div className={`text-xs mt-0.5 leading-relaxed
                      ${isUnread ? "text-gray-600" : "text-white/50"}`}>
                      {n.message}
                    </div>
                    <div className={`text-xs mt-1.5
                      ${isUnread ? "text-gray-400" : "text-white/30"}`}>
                      {timeAgo(n.created_at)}
                    </div>
                  </div>

                  {isUnread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Notification;