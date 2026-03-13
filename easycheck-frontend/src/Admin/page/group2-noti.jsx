import { useState, useEffect } from 'react';

const GroupNoti2 = () => {
  const [user, setUser] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const userData = { name: 'Admin User', role: 'admin' };
    setUser(userData);
  }, []);

  // ข้อมูลพนักงานตัวอย่าง (12 คน)
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

  const handleToggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleBack = () => {
    // ในระบบจริงจะใช้ navigate('/groupnoti')
    alert('กลับไปหน้า Notification');
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
            <h1 className="text-4xl font-bold text-gray-800 m-0">แผนก A</h1>
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

export default GroupNoti2;