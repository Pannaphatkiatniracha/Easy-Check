import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    console.log('Sidebar mounted - checking localStorage');
    const userData = localStorage.getItem('user');
    console.log('User data from localStorage:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser({ fullName: 'Admin User', role: 'admin' });
      }
    } else {
      console.log('No user data found in localStorage - using default');
      setUser({ fullName: 'Admin User', role: 'admin' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      label: 'Manage Users',
      path: '/users'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      label: 'Personal Summary',
      path: '/summary'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      label: 'Shift Schedule',
      path: '/shift'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <rect x="8" y="14" width="8" height="4" rx="1"></rect>
        </svg>
      ),
      label: 'Event Management',
      path: '/events'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      label: 'Group Notification',
      path: '/group-noti'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      ),
      label: 'Export Excel/PDF',
      path: '/export'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      label: 'GPS Status',
      path: '/gps'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      ),
      label: '🔧 Permission (TEST)',
      path: '/permission'
    },
    { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2"></path>
        </svg>
      ),
      label: 'Settings',
      path: '/settings'
    },
  ];

  if (!user) {
    return (
      <div className="w-80 h-screen bg-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <div>Loading user data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-screen bg-gray-800 text-white p-6 flex flex-col">
      
      {/* Profile Section */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-gray-600">
          <img
            src={user.profileImage || "https://i.pinimg.com/736x/e9/6e/66/e96e6640dd63927d0c179eb6e80956ad.jpg"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center">
          <div className="font-bold text-lg text-white">
            {user.fullName || 'Admin Panel'}
          </div>
          <div className="text-sm text-gray-300">
            {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
            {user.department && ` • ${user.department}`}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button 
          className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-900 hover:text-red-200 transition-colors"
          onClick={handleLogout}
        >
          <span className="mr-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span className="font-medium">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;