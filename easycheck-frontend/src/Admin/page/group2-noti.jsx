import { useState, useEffect } from 'react';
import Api from '../../Api';

const AVATAR_COLORS = ['#3C4678', '#50589C', '#636CCB', '#6E8CFB'];

const GroupNoti2 = ({ department, onBack }) => {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(true);

  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const userData = { name: 'Admin User', role: 'admin' };
    setUser(userData);
  }, []);

  // โหลดข้อมูลพนักงานจาก API ตามแผนกที่เลือก
  useEffect(() => {
    if (!department) return;
    const fetchEmployees = async () => {
      try {
        setLoadingEmps(true);
        const res = await Api.get('/api/group-noti/employees', {
          params: { department: department.name },
        });
        const mapped = res.data.map((emp, index) => ({
          id: emp.id,
          name: `${emp.firstname} ${emp.lastname}`,
          position: emp.position || '',
          avatar: emp.avatar || '',
          avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        }));
        setEmployees(mapped);
        setSelectedEmployees(mapped.map((emp) => emp.id));
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      } finally {
        setLoadingEmps(false);
      }
    };
    fetchEmployees();
  }, [department]);

  const handleToggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      alert('กลับไปหน้า Notification');
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#3C467B' }}>
      <div className="p-8 md:p-10">
        <div className="w-full max-w-full bg-white rounded-2xl shadow-lg p-14 md:p-16">
          
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleBack}
              className="w-10 h-10 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-800">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-gray-800 m-0">{department?.name ?? 'แผนก'}</h1>
          </div>

          {/* Select Dropdown */}
          <div className="mb-6">
            <select 
              className="w-48 px-4 py-3 text-white border-none rounded-lg text-base font-semibold cursor-pointer outline-none appearance-none pr-10 transition-all"
              style={{
                backgroundColor: '#3d4f7d',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4a5d8f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3d4f7d'}
            >
              <option>Select</option>
              <option>ทั้งหมด</option>
              <option>เลือกแล้ว</option>
            </select>
          </div>

          {/* Employee Grid (2 columns) */}
          {loadingEmps ? (
            <div className="flex items-center justify-center py-10 text-gray-500">กำลังโหลดข้อมูลพนักงาน...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((employee) => (
                <div 
                  key={employee.id} 
                  className={`flex items-center px-5 py-4 rounded-lg transition-all gap-3 ${
                    selectedEmployees.includes(employee.id) 
                      ? 'shadow-md' 
                      : ''
                  }`}
                  style={{ 
                    backgroundColor: selectedEmployees.includes(employee.id) ? '#a8bfdf' : '#c5d5ed'
                  }}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer flex-shrink-0"
                    style={{ accentColor: '#3d4f7d' }}
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleToggleEmployee(employee.id)}
                  />

                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: employee.avatarColor }}
                  >
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>

                  {/* Name + Position */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-base font-semibold text-gray-800 truncate">
                      {employee.name}
                    </span>
                    {employee.position ? (
                      <span className="text-sm text-gray-500 truncate">
                        {employee.position}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GroupNoti2;