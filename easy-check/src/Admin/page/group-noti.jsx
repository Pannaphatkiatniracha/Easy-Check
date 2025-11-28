import { useState, useEffect } from 'react';

const GroupNoti = () => {
  const [user, setUser] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('main'); // 'main' or 'detail'
  const [selectedDeptId, setSelectedDeptId] = useState(null);

  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const userData = { name: 'Admin User', role: 'admin' };
    setUser(userData);
  }, []);

  const departments = [
    { id: 1, name: 'แผนก A' },
    { id: 2, name: 'แผนก B' },
    { id: 3, name: 'แผนก C' },
    { id: 4, name: 'แผนก D' },
    { id: 5, name: 'แผนก E' }
  ];

  const handleToggleDepartment = (id) => {
    if (selectedDepartments.includes(id)) {
      setSelectedDepartments(selectedDepartments.filter(deptId => deptId !== id));
    } else {
      setSelectedDepartments([...selectedDepartments, id]);
    }
  };

  const handleViewDetails = (departmentId) => {
    setSelectedDeptId(departmentId);
    setCurrentPage('detail');
  };

  const handleSend = () => {
    if (selectedDepartments.length === 0) {
      alert('กรุณาเลือกแผนกที่ต้องการส่งการแจ้งเตือน');
      return;
    }
    if (!message.trim()) {
      alert('กรุณากรอกข้อความ');
      return;
    }
    alert(`ส่งการแจ้งเตือนไปยัง ${selectedDepartments.length} แผนกเรียบร้อยแล้ว`);
    setMessage('');
    setSelectedDepartments([]);
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // แสดงหน้า GroupNoti2 เมื่อกดปุ่ม Details
  if (currentPage === 'detail') {
    return <GroupNoti2 departmentId={selectedDeptId} onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#3C467B' }}>
      <div className="p-8 md:p-10">
        <div className="w-full max-w-full bg-white rounded-2xl shadow-lg p-14 md:p-16">
          
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-800 m-0">Notification</h1>
          </div>

          {/* Select Dropdown */}
          <div className="mb-8">
            <select 
              className="w-52 px-5 py-4 bg-indigo-900 text-white border-none rounded-lg text-base font-semibold cursor-pointer outline-none appearance-none pr-12 hover:bg-indigo-800 transition-all"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center'
              }}
            >
              <option>Select</option>
              <option>ทั้งหมด</option>
              <option>เลือกแล้ว</option>
            </select>
          </div>

          {/* Department List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-9">
            {departments.map((dept) => (
              <div 
                key={dept.id} 
                className={`flex items-center px-6 py-5 rounded-xl transition-all min-h-16 ${
                  selectedDepartments.includes(dept.id) 
                    ? 'bg-blue-200' 
                    : 'bg-blue-100 hover:bg-blue-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-6 h-6 mr-5 cursor-pointer flex-shrink-0"
                  style={{ accentColor: '#3d4f7d' }}
                  checked={selectedDepartments.includes(dept.id)}
                  onChange={() => handleToggleDepartment(dept.id)}
                />
                <span className="flex-1 text-lg font-semibold text-gray-800 mr-5">
                  {dept.name}
                </span>
                <button 
                  className="px-8 py-3 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all whitespace-nowrap flex-shrink-0 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: '#3C467B' }}
                  onClick={() => handleViewDetails(dept.id)}
                >
                  Details
                </button>
              </div>
            ))}
          </div>

          {/* Message Box */}
          <div className="mb-9">
            <textarea
              className="w-full min-h-44 px-6 py-6 bg-blue-100 border-none rounded-xl text-base resize-y outline-none text-gray-800 transition-all focus:bg-blue-200 focus:shadow-lg placeholder:text-gray-500"
              placeholder="พิมพ์ข้อความที่นี่..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>

          {/* Send Section */}
          <div className="flex justify-end">
            <button 
              className="px-16 py-4 text-white border-none rounded-xl text-lg font-bold cursor-pointer transition-all hover:opacity-90 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
              style={{ backgroundColor: '#3C467B' }}
              onClick={handleSend}
            >
              Sent
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// Component GroupNoti2 สำหรับแสดงรายละเอียดพนักงานในแผนก
const GroupNoti2 = ({ departmentId, onBack }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const departments = [
    { id: 1, name: 'แผนก A' },
    { id: 2, name: 'แผนก B' },
    { id: 3, name: 'แผนก C' },
    { id: 4, name: 'แผนก D' },
    { id: 5, name: 'แผนก E' }
  ];

  const employees = [
    { id: 1, code: 'นายสมชาย ใจดี' },
    { id: 2, code: 'นางสาวมาลี วงศ์ดี' },
    { id: 3, code: 'นายวิชัย ศรีสุข' },
    { id: 4, code: 'นางสมใจ รักดี' },
    { id: 5, code: 'นายธนากร มั่นคง' },
    { id: 6, code: 'นางสาวพิมพ์ใจ สวยงาม' },
    { id: 7, code: 'นายประสิทธิ์ เก่งดี' },
    { id: 8, code: 'นายอนุชา ทรงธรรม' },
    { id: 9, code: 'นายสุรชัย ดีเลิศ' },
    { id: 10, code: 'นางวรรณา แก้วใส' },
    { id: 11, code: 'นายชัยวัฒน์ สมบูรณ์' },
    { id: 12, code: 'นางสาวนิภา ใจงาม' }
  ];

  const departmentName = departments.find(d => d.id === departmentId)?.name || 'แผนก';

  const handleToggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#3C467B' }}>
      <div className="p-8 md:p-10">
        <div className="w-full max-w-full bg-white rounded-2xl shadow-lg p-14 md:p-16">
          
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-800">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-gray-800 m-0">{departmentName}</h1>
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
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ backgroundColor: '#5b7bb4' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="flex-1 text-base font-semibold text-gray-800">
                  {employee.code}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GroupNoti;