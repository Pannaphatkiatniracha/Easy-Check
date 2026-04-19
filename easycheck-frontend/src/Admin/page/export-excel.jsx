import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePermission } from '../../usePermission';
import { useAuth } from '../../AuthContext.jsx';

const API_BASE = 'http://localhost:5000';

const ExportExcel = () => {
  const navigate = useNavigate();
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



  // ── ดึงข้อมูลใหม่ทุกครั้งที่ date หรือ department เปลี่ยน ──

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams({ date: selectedDate })
        if (selectedDepartment !== 'all') params.append('department', selectedDepartment)

        const res = await fetch(`${API_BASE}/api/attendance?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setEmployees(data.employees || [])
      } catch (err) {
        console.error(err)
        setEmployees([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectedDate, selectedDepartment])

  const handleLogout = () => {
    navigate('/login');
  };

  const departments = ['all', ...new Set(employees.map(e => e.department))].filter(d => d !== '-');

  const filteredData = selectedDepartment === 'all'
    ? employees
    : employees.filter(emp => emp.department === selectedDepartment);

  const stats = {
    total: employees.length,
    present: employees.filter(e => e.status === 'ปกติ' || e.status === 'สาย' || e.status === 'ออกก่อนเวลา').length,
    late: employees.filter(e => e.status === 'สาย').length,
    absent: employees.filter(e => e.status === 'ขาด').length,
    earlyLeave: employees.filter(e => e.status === 'ออกก่อนเวลา').length,
  }

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
    // ── เรียก backend ให้สร้างไฟล์แล้ว download เลย ──
    const handleExport = async () => {
      setIsExporting(true)
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams({ date: selectedDate, format })
        if (selectedDepartment !== 'all') params.append('department', selectedDepartment)

        const res = await fetch(`${API_BASE}/api/export?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('Export failed')

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `attendance_${selectedDate}.${format === 'excel' ? 'xlsx' : 'pdf'}`
        link.click()
        URL.revokeObjectURL(url)

        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } catch (err) {
        console.error(err)
        alert('เกิดข้อผิดพลาดในการส่งออกไฟล์')
      } finally {
        setIsExporting(false)
      }
    }
  }

return (
    <div className="min-h-screen" style={{ backgroundColor: '#3C467B' }}>
      {showSuccess && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span className="font-semibold">ส่งออกไฟล์สำเร็จ!</span>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">ส่งออกรายงานการเข้างาน</h1>
            <p className="text-gray-500 text-lg">เลือกวันที่และแผนกเพื่อส่งออกข้อมูลเป็นไฟล์ Excel หรือ PDF</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">
            {[
              { label: 'ทั้งหมด', value: stats.total, from: 'from-indigo-500', to: 'to-purple-600' },
              { label: 'มาทำงาน', value: stats.present, from: 'from-teal-500', to: 'to-green-400' },
              { label: 'สาย', value: stats.late, from: 'from-amber-400', to: 'to-orange-400' },
              { label: 'ออกก่อนเวลา', value: stats.earlyLeave, from: 'from-orange-400', to: 'to-red-400' },
              { label: 'ขาด', value: stats.absent, from: 'from-rose-500', to: 'to-red-600' },
            ].map(card => (
              <div key={card.label} className={`bg-gradient-to-br ${card.from} ${card.to} text-white p-6 rounded-2xl shadow-lg`}>
                <div className="text-sm opacity-90 mb-2">{card.label}</div>
                <div className="text-4xl font-bold">{card.value}</div>
              </div>
            ))}
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">เลือกแผนก</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 bg-white"
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
                  {['excel', 'pdf'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex-1 py-3 px-4 border-2 rounded-lg text-sm font-semibold transition-all ${format === f
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-300'
                        }`}
                    >
                      {f === 'excel' ? 'Excel' : 'PDF'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-5">
              <h2 className="text-xl font-semibold text-white">
                ข้อมูลที่จะส่งออก
                {!isLoading && <span className="ml-2 text-sm font-normal opacity-80">({employees.length} รายการ)</span>}
              </h2>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
                  กำลังโหลดข้อมูล...
                </div>
              ) : (
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
              )}
            </div>
          </div>

          {/* Export Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleExport}
              disabled={isExporting || isLoading || employees.length === 0}
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
    </div>
  );
}


export default ExportExcel ;