// Notification.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

// ตัวอย่าง mock notifications
const mockNotifications = [
  {
    id: 1,
    title: "Leave Request Approved",
    description: "Your leave request for 24 Nov has been approved.",
    date: "2025-11-24",
  },
  {
    id: 2,
    title: "Check-in Reminder",
    description: "Don't forget to check in today by 09:00 AM.",
    date: "2025-11-24",
  },
  {
    id: 3,
    title: "New Approver Assigned",
    description: "You have been assigned as approver for Project Manager.",
    date: "2025-11-23",
  },
];

const Notification = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
     <div className="app-container min-h-screen bg-[#3C467B] p-4 sm:p-6 md:p-8 flex flex-col items-center relative overflow-hidden">
          {/* Header */}
          <div className="w-full max-w-md flex items-center justify-between mb-6">
            <Link
              to="/home"
              className="text-white text-2xl hover:scale-110 transition"
            >
              <i className="bi bi-chevron-left"></i>
            </Link>
        <h1 className="ml-4 text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.length === 0 && (
          <p className="text-gray-200">No notifications available.</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 bg-white text-gray-800 rounded-xl shadow-md flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{n.title}</div>
              <div className="text-sm text-gray-600">{n.description}</div>
              <div className="text-xs text-gray-400 mt-1">{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
