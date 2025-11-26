import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './export-excel.module.css';

const ExportExcel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [format, setFormat] = useState('excel');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ข้อมูลตัวอย่างพนักงาน
  const employeeData = [
    { id: 'EMP001', name: 'สมชาย ใจดี', department: 'IT', status: 'มาทำงาน', checkIn: '08:00', checkOut: '17:00' },
    { id: 'EMP002', name: 'สมหญิง รักงาน', department: 'IT', status: 'มาทำงาน', checkIn: '08:15', checkOut: '17:05' },
    { id: 'EMP003', name: 'วิชัย เก่งงาน', department: 'HR', status: 'ลา', checkIn: '-', checkOut: '-' },
    { id: 'EMP004', name: 'นภา สวยงาม', department: 'HR', status: 'มาทำงาน', checkIn: '08:05', checkOut: '17:00' },
    { id: 'EMP005', name: 'ประยุทธ์ ขยัน', department: 'Finance', status: 'สาย', checkIn: '09:30', checkOut: '17:00' },
    { id: 'EMP006', name: 'สุดา มั่นคง', department: 'Finance', status: 'มาทำงาน', checkIn: '07:55', checkOut: '17:10' },
    { id: 'EMP007', name: 'ธนา พัฒนา', department: 'Marketing', status: 'ขาด', checkIn: '-', checkOut: '-' },
    { id: 'EMP008', name: 'อรุณ สว่างใส', department: 'Marketing', status: 'มาทำงาน', checkIn: '08:00', checkOut: '17:00' },
  ];

  const departments = ['all', 'IT', 'HR', 'Finance', 'Marketing'];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        setUser({});
      }
    } else {
      setUser({});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };


  const filteredData = selectedDepartment === 'all' 
    ? employeeData 
    : employeeData.filter(emp => emp.department === selectedDepartment);

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

  const exportToExcel = () => {
    // สร้างข้อมูล CSV
    const csvContent = [
      ['รายงานการเข้างานพนักงาน'],
      [`วันที่: ${selectedDate}`],
      [`แผนก: ${selectedDepartment === 'all' ? 'ทั้งหมด' : selectedDepartment}`],
      [''],
      ['รหัสพนักงาน', 'ชื่อ-นามสกุล', 'แผนก', 'สถานะ', 'เวลาเข้างาน', 'เวลาออกงาน'],
      ...filteredData.map(emp => [emp.id, emp.name, emp.department, emp.status, emp.checkIn, emp.checkOut])
    ].map(row => row.join(',')).join('\n');

    // สร้างและดาวน์โหลดไฟล์
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_report_${selectedDate}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    // ในระบบจริงจะใช้ library เช่น jsPDF
    alert('กำลังสร้างไฟล์ PDF... (ในระบบจริงจะใช้ library เช่น jsPDF)');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="home-layout">
      {/* Success Message */}
      {showSuccess && (
        <div className={styles.successMessage}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>ส่งออกไฟล์สำเร็จ!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">


        <div className={styles.container}>
          
          {/* Header */}
          <div className={styles.header}>
            <h1>📊 ส่งออกรายงานการเข้างาน</h1>
            <p>เลือกวันที่และแผนกเพื่อส่งออกข้อมูลเป็นไฟล์ Excel หรือ PDF</p>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.total}`}>
              <div className={styles.statLabel}>พนักงานทั้งหมด</div>
              <div className={styles.statValue}>{stats.total}</div>
            </div>
            <div className={`${styles.statCard} ${styles.present}`}>
              <div className={styles.statLabel}>มาทำงาน</div>
              <div className={styles.statValue}>{stats.present}</div>
            </div>
            <div className={`${styles.statCard} ${styles.late}`}>
              <div className={styles.statLabel}>สาย</div>
              <div className={styles.statValue}>{stats.late}</div>
            </div>
            <div className={`${styles.statCard} ${styles.leave}`}>
              <div className={styles.statLabel}>ลา</div>
              <div className={styles.statValue}>{stats.leave}</div>
            </div>
            <div className={`${styles.statCard} ${styles.absent}`}>
              <div className={styles.statLabel}>ขาด</div>
              <div className={styles.statValue}>{stats.absent}</div>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filterSection}>
            <h2>🔍 ตัวกรองข้อมูล</h2>
            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label>📅 เลือกวันที่</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>🏢 เลือกแผนก</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">ทั้งหมด</option>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>📄 รูปแบบไฟล์</label>
                <div className={styles.formatButtons}>
                  <button
                    className={`${styles.formatBtn} ${format === 'excel' ? styles.active : ''}`}
                    onClick={() => setFormat('excel')}
                  >
                    📊 Excel
                  </button>
                  <button
                    className={`${styles.formatBtn} ${format === 'pdf' ? styles.active : ''}`}
                    onClick={() => setFormat('pdf')}
                  >
                    📑 PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className={styles.dataTableSection}>
            <div className={styles.tableHeader}>
              <h2>📋ข้อมูลที่จะส่งออก</h2>
            </div>
            
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>รหัสพนักงาน</th>
                    <th>ชื่อ-นามสกุล</th>
                    <th>แผนก</th>
                    <th className={styles.center}>สถานะ</th>
                    <th className={styles.center}>เวลาเข้างาน</th>
                    <th className={styles.center}>เวลาออกงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((emp, index) => (
                    <tr key={index}>
                      <td>{emp.id}</td>
                      <td className={styles.employeeName}>{emp.name}</td>
                      <td className={styles.departmentName}>{emp.department}</td>
                      <td className={styles.center}>
                        <span className={`${styles.statusBadge} ${
                          emp.status === 'มาทำงาน' ? styles.statusPresent : 
                          emp.status === 'สาย' ? styles.statusLate : 
                          emp.status === 'ลา' ? styles.statusLeave : styles.statusAbsent
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className={styles.center}>{emp.checkIn}</td>
                      <td className={styles.center}>{emp.checkOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Button */}
          <div className={styles.exportButtonSection}>
            <button
              className={styles.exportButton}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className={styles.spinner} />
                  กำลังสร้างไฟล์...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
};

export default ExportExcel;