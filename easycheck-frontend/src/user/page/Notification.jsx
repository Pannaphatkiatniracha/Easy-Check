import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/notifications";

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return "เมื่อกี้";
  if (diff < 3600)  return `${Math.floor(diff / 60)} นาทีที่แล้ว`;

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

  useEffect(() => { 
    loadNotifications(); 
  }, [loadNotifications]);

  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(`${API}/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.triggerRefresh) {
        loadNotifications();
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [token, loadNotifications]);

  const handleRead = async (id) => {
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
        <div className="relative flex items-center justify-center mb-2">
          <Link to="/home" className="absolute left-0 text-white text-2xl">
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
              className="absolute right-0 text-xs text-white/70 hover:text-white transition disabled:opacity-50"
            >
              อ่านทั้งหมด
            </button>
          ) : null}
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