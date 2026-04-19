import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePermission } from '../../usePermission';
import { useAuth } from '../../AuthContext.jsx';

const API_BASE = 'http://localhost:5000';

const ExportExcel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [format, setFormat] = useState('excel');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { can } = usePermission();
  const { permissions, loading } = useAuth();
  //permissions access control

  if (loading) {
    return <div>Loading...</div>;
  }
  //กั้นหน้า ถ้าไม่มีสิทธิ์จ้า
  if (!can("export_data")) {
    return <div> คุณไม่มีสิทธิ์เข้าถึงหน้านี้ </div>;
  }


  useEffect(() => {
    const userData = { name: 'Admin User', role: 'admin' };
    setUser(userData);

    // ดึงข้อมูลพนักงานจาก API
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/admin/dashboard/today`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        // แปลงข้อมูลจาก API ให้เข้ากับรูปแบบของตาราง
        if (data.employees) {
          const transformedEmployees = data.employees.map(emp => ({
            id: emp.id_employee || emp.id,
            name: `${emp.firstname} ${emp.lastname}`,
            department: emp.department || '-',
            status: emp.overallStatus === 'ปกติ' ? 'มาทำงาน' : emp.overallStatus,
            checkIn: emp.checkInTime || '-',
            checkOut: emp.checkOutTime || '-'
          }));
          setEmployees(transformedEmployees);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching employee data:', err);
        setEmployees([]);
        setIsLoading(false);
      });
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const departments = ['all', ...new Set(employees.map(e => e.department))].filter(d => d !== '-');

  const filteredData = selectedDepartment === 'all'
    ? employees
    : employees.filter(emp => emp.department === selectedDepartment);

  const stats = {
    total: filteredData.length,
    present: filteredData.filter(e => e.status === 'มาทำงาน').length,
    late: filteredData.filter(e => e.status === 'สาย').length,
    absent: filteredData.filter(e => e.status === 'ขาด').length,
    leave: filteredData.filter(e => e.status === 'ลา').length,
  };

  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      if (format === 'excel') {
        exportToExcel();
      } else {
        exportToPDF();
      }
      setIsExporting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };
  /*เป็นแค่การจำลอง ไม่มีlibraryเก็บ ไม่ได้ใช้excelจริงๆเพราะค่อนข้างหนัก อันนี้เลยเป็นแค่ตัวCSVจำลองที่เอาข้อมูลจากArrayที่ทำไว้จา */
  const exportToExcel = () => {
    const csvContent = [
      ['รายงานการเข้างานพนักงาน'],
      [`วันที่: ${selectedDate}`],
      [`แผนก: ${selectedDepartment === 'all' ? 'ทั้งหมด' : selectedDepartment}`],
      [''],
      ['รหัสพนักงาน', 'ชื่อ-นามสกุล', 'แผนก', 'สถานะ', 'เวลาเข้างาน', 'เวลาออกงาน'],
      ...filteredData.map(emp => [emp.id, emp.name, emp.department, emp.status, emp.checkIn, emp.checkOut])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_report_${selectedDate}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    alert('กำลังสร้างไฟล์ PDF... (ในระบบจริงจะใช้ library เช่น jsPDF)');
  };

  if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3C467B' }}>
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in z-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span className="font-semibold">ส่งออกไฟล์สำเร็จ!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">ส่งออกรายงานการเข้างาน</h1>
            <p className="text-gray-500 text-lg">เลือกวันที่และแผนกเพื่อส่งออกข้อมูลเป็นไฟล์ Excel หรือ PDF</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm opacity-90 mb-2">พนักงานทั้งหมด</div>
              <div className="text-4xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-green-400 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm opacity-90 mb-2">มาทำงาน</div>
              <div className="text-4xl font-bold">{stats.present}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-red-400 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm opacity-90 mb-2">สาย</div>
              <div className="text-4xl font-bold">{stats.late}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-yellow-300 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm opacity-90 mb-2">ลา</div>
              <div className="text-4xl font-bold">{stats.leave}</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-400 to-indigo-900 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm opacity-90 mb-2">ขาด</div>
              <div className="text-4xl font-bold">{stats.absent}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 p-8 rounded-2xl mb-8 border-2 border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">ตัวกรองข้อมูล</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">เลือกวันที่</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">เลือกแผนก</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                >
                  <option value="all">ทั้งหมด</option>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">รูปแบบไฟล์</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat('excel')}
                    className={`flex-1 py-3 px-4 border-2 rounded-lg text-sm font-semibold transition-all ${format === 'excel'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-500 hover:text-indigo-600'
                      }`}
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`flex-1 py-3 px-4 border-2 rounded-lg text-sm font-semibold transition-all ${format === 'pdf'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-500 hover:text-indigo-600'
                      }`}
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-5">
              <h2 className="text-xl font-semibold text-white">ข้อมูลที่จะส่งออก</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800 border-b-2 border-gray-200">รหัสพนักงาน</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800 border-b-2 border-gray-200">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800 border-b-2 border-gray-200">แผนก</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-800 border-b-2 border-gray-200">สถานะ</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-800 border-b-2 border-gray-200">เวลาเข้างาน</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-800 border-b-2 border-gray-200">เวลาออกงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((emp, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-800">{emp.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 font-medium">{emp.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{emp.department}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${emp.status === 'มาทำงาน' ? 'bg-green-100 text-green-800' :
                            emp.status === 'สาย' ? 'bg-yellow-100 text-yellow-800' :
                              emp.status === 'ลา' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 text-center">{emp.checkIn}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 text-center">{emp.checkOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-3 px-16 py-5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังสร้างไฟล์...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  ส่งออกไฟล์ {format === 'excel' ? 'Excel' : 'PDF'}
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExportExcel;