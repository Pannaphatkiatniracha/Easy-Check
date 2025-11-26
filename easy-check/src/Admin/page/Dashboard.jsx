import React, { useState, useEffect } from 'react';
import { X, Search, Clock, Users, UserX, FileText, MapPin, Calendar, TrendingUp, AlertCircle, CheckCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight, Activity, Image ,ArrowDownToLine} from 'lucide-react';
import './Dashboard.css' 

const departments = ['ฝ่ายผลิต', 'ฝ่ายขาย', 'ฝ่าย IT', 'ฝ่ายบัญชี', 'ฝ่ายทั่วไป'];
const branches = ['สำนักงานใหญ่', 'สาขา 1', 'สาขา 2', 'สาขา 3'];
const leaveTypes = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาคลอด'];
const positions = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 
  'DevOps Engineer', 'QA Engineer', 'UI/UX Designer', 
  'Product Manager', 'Project Manager', 'Scrum Master',
  'Data Analyst', 'System Architect', 'Team Lead'
];

const generateEmployees = (count) => {
  const employees = [];
  const firstNames = ['สมชาย', 'สมหญิง', 'วิชัย', 'สุดา', 'นภา', 'ชัยวัฒน์', 'อรุณ', 'มานี', 'สมศักดิ์', 'ปิยะ', 'วันดี', 'ธนา', 'พิมพ์', 'กันต์', 'รัตน์'];
  const lastNames = ['ใจดี', 'รักสงบ', 'มั่นคง', 'สุขสันต์', 'เจริญ', 'วิไล', 'ศรีสุข', 'แสงดาว', 'ทองดี', 'สว่าง', 'มีชัย', 'พัฒนา', 'เรืองศักดิ์', 'บุญมา', 'สมบูรณ์'];
  
  // สร้างพนักงาน 50 คนก่อน
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    employees.push({
      id: i + 1,
      firstName: firstName,
      lastName: lastName,
      name: `${firstName} ${lastName}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      branch: branches[Math.floor(Math.random() * branches.length)],
      checkInTime: null,
      checkOutTime: null,
      status: 'ปกติ', // สถานะเริ่มต้น
      location: '-',
      workHours: null,
      leaveType: null
    });
  }

  // สุ่มสถานะต่างๆ ให้กับพนักงาน
  const shuffledIndices = [...Array(count).keys()].sort(() => 0.5 - Math.random());
  let currentIndex = 0;

  // 2 คน ลาคลอด (เลือกชื่อผู้หญิง)
  const femaleNames = ['สมหญิง', 'สุดา', 'นภา', 'มานี', 'วันดี', 'พิมพ์'];
  let maternityCount = 0;
  for (let i = 0; i < count && maternityCount < 2; i++) {
      const empIndex = shuffledIndices[i];
      if (femaleNames.includes(employees[empIndex].firstName)) {
          employees[empIndex].status = 'ลา';
          employees[empIndex].leaveType = 'ลาคลอด';
          maternityCount++;
          currentIndex++;
      }
  }

  // 5 คน ขาดงาน
  for (let i = 0; i < 5; i++) employees[shuffledIndices[currentIndex++]].status = 'ขาด';

  // 3 คน ลาประเภทอื่น
  for (let i = 0; i < 3; i++) {
      const otherLeaveTypes = leaveTypes.filter(t => t !== 'ลาคลอด');
      employees[shuffledIndices[currentIndex]].status = 'ลา';
      employees[shuffledIndices[currentIndex]].leaveType = otherLeaveTypes[Math.floor(Math.random() * otherLeaveTypes.length)];
      currentIndex++;
  }

  // 5 คน มาสาย
  for (let i = 0; i < 5; i++) employees[shuffledIndices[currentIndex++]].status = 'สาย';

  // ที่เหลือเข้างานปกติ หรือสาย
  employees.forEach(emp => {
      if (emp.status === 'ปกติ' || emp.status === 'สาย') {
          const checkInTime = new Date();
          const isLate = emp.status === 'สาย';
          checkInTime.setHours(isLate ? 8 : 7, isLate ? 31 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 60));
          emp.checkInTime = checkInTime.toTimeString().slice(0, 5);
          emp.location = `13.7${Math.floor(Math.random() * 99)}, 100.5${Math.floor(Math.random() * 99)}`;

          if (Math.random() > 0.3) { // 70% checkout
              const checkOutTime = new Date();
              checkOutTime.setHours(Math.floor(Math.random() * 3) + 17, Math.floor(Math.random() * 60));
              emp.checkOutTime = checkOutTime.toTimeString().slice(0, 5);
              emp.workHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(1);
          }
      }
  });

  return employees;
};

const generateLeaveRequests = () => [
  { id: 1, name: 'สมชาย ใจดี', type: 'ลาป่วย', date: '10 พ.ย. 2025', reason: 'ป่วยเป็นไข้', days: 1, requestTime: '2 ชั่วโมงที่แล้ว' },
  { id: 2, name: 'สุดา รักสงบ', type: 'ลากิจ', date: '11-12 พ.ย. 2025', reason: 'ธุระส่วนตัว', days: 2, requestTime: '5 ชั่วโมงที่แล้ว' },
  { id: 3, name: 'วิชัย มั่นคง', type: 'ลาพักร้อน', date: '15-19 พ.ย. 2025', reason: 'พักร้อน', days: 5, requestTime: '1 วันที่แล้ว' }
];

const Dashboard = () => {
  const [employees] = useState(generateEmployees(50));
  const [leaveRequests, setLeaveRequests] = useState(generateLeaveRequests());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ทั้งหมด');
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState(3);
  const [kpiValues, setKpiValues] = useState({ present: 0, late: 0, absent: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    const present = employees.filter(e => e.status === 'ปกติ' || e.status === 'สาย').length;
    const late = employees.filter(e => e.status === 'สาย').length;
    const absent = employees.filter(e => e.status === 'ขาด').length;
    const pending = leaveRequests.length;

    const animateValue = (key, end, duration) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setKpiValues(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 16);
    };

    animateValue('present', present, 1200);
    animateValue('late', late, 1200);
    animateValue('absent', absent, 1200);
    animateValue('pending', pending, 1200);
  }, [employees, leaveRequests, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNotifications(prev => prev + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id) => {
    setLeaveRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleReject = (id) => {
    setLeaveRequests(prev => prev.filter(req => req.id !== id));
  };

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.includes(searchTerm) || emp.department.includes(searchTerm) || emp.position.includes(searchTerm);
    const matchDept = filterDept === 'ทั้งหมด' || emp.department === filterDept;
    const matchStatus = filterStatus === 'ทั้งหมด' || emp.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDept, filterStatus]);

  const getInitials = (firstName) => {
    return firstName.charAt(0).toUpperCase();
  };

  const deptStats = departments.map(dept => {
    const deptEmps = employees.filter(e => e.department === dept);
    return {
      name: dept,
      total: deptEmps.length,
      present: deptEmps.filter(e => e.status === 'ปกติ').length,
      late: deptEmps.filter(e => e.status === 'สาย').length,
      avgHours: (deptEmps.filter(e => e.workHours).reduce((sum, e) => sum + parseFloat(e.workHours), 0) / deptEmps.filter(e => e.workHours).length || 0).toFixed(1)
    };
  });

  const branchStats = branches.map(branch => {
    const branchEmps = employees.filter(e => e.branch === branch);
    return { name: branch, count: branchEmps.length };
  });

  const notCheckedOut = employees.filter(e => e.checkInTime && !e.checkOutTime);
  const totalWorkHours = employees.filter(e => e.workHours).reduce((sum, e) => sum + parseFloat(e.workHours), 0);

  // คำนวณสัดส่วนการลาจากข้อมูลจริง
  const leaveStats = {
    'ลาป่วย': 0,
    'ลากิจ': 0,
    'ลาพักร้อน': 0
  };

  // นับจากพนักงานที่ลา
  employees.filter(e => e.status === 'ลา').forEach(emp => {
    if (emp.leaveType && leaveStats.hasOwnProperty(emp.leaveType)) {
      leaveStats[emp.leaveType]++;
    }
  });

  // นับจากคำขอลาที่รออนุมัติ
  leaveRequests.forEach(req => {
    if (leaveStats.hasOwnProperty(req.type)) {
      leaveStats[req.type] += req.days;
    }
  });

  useEffect(() => {
    // คำนวณข้อมูลสำหรับกราฟสัดส่วนการลา
    const leaveData = leaveTypes.map(type => {
      const countFromEmployees = employees.filter(e => e.status === 'ลา' && e.leaveType === type).length;
      const countFromRequests = leaveRequests.filter(req => req.type === type).reduce((sum, req) => sum + req.days, 0);
      return countFromEmployees + countFromRequests;
    });

    const doughnutChart = document.getElementById('doughnutChart')?.chart;
    if (doughnutChart) {
      doughnutChart.data.labels = leaveTypes;
      doughnutChart.data.datasets[0].data = leaveData;
      doughnutChart.update();
    }

    const initCharts = () => {
      if (typeof Chart === 'undefined') return;

      Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      
      const lineCtx = document.getElementById('lineChart');
      if (lineCtx && !lineCtx.chart) {
        lineCtx.chart = new Chart(lineCtx, {
          type: 'bar',
          data: {
            labels: ['เข้างาน', 'มาสาย', 'ขาดงาน', 'ลา'],
            datasets: [{
              label: 'จำนวนคน',
              data: [37, 5, 5, 3],
              backgroundColor: [
                '#50589C',
                '#ff9800',
                '#f44336',
                '#9c27b0'
              ],
              borderRadius: 8,
              barThickness: 60
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.y} คน`;
                  }
                }
              }
            },
            scales: {
              y: { 
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: {
                  callback: function(value) {
                    return value + ' คน';
                  }
                }
              },
              x: {
                grid: { display: false }
              }
            }
          }
        });
      }

      const doughnutCtx = document.getElementById('doughnutChart');
      if (doughnutCtx && !doughnutCtx.chart) {
        doughnutCtx.chart = new Chart(doughnutCtx, {
          type: 'doughnut',
          data: {
            labels: leaveTypes,
            datasets: [{
              data: leaveData,
              backgroundColor: ['#3C467B', '#50589C', '#636CCB'],
              borderWidth: 0,
              hoverOffset: 10
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: 'bottom',
                labels: { 
                  padding: 12, 
                  font: { size: 12 },
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                callbacks: {
                  label: function(context) {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    };

    if (!isLoading) {
      setTimeout(initCharts, 100);
    }
  }, [isLoading, employees, leaveRequests]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
     
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">EC</div>
            <div>
              <h1>Dashboard</h1>
              
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="header-date">
            <Calendar size={18} />
            <span>วันอาทิตย์ที่ 9 พฤศจิกายน 2568</span>
          </div>
          
            <div className="header-Export">
            <button className="btn-Export-new" >
                    <ArrowDownToLine size={18} /> 
                    Export
                  </button>
         
         </div>
          
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-kpi-grid">
          <div className="hero-kpi-card present">
            <div className="hero-kpi-header">
              <div className="hero-kpi-icon"><Users /></div>
              <span className="kpi-label">เข้างานวันนี้</span>
            </div>
            <div className="hero-kpi-value">{kpiValues.present}</div>
            <div className="kpi-subtitle">จาก 50 คน</div>
          </div>
          
          <div className="hero-kpi-card late">
            <div className="hero-kpi-header">
              <div className="hero-kpi-icon"><Clock /></div>
              <span className="kpi-label">มาสาย</span>
            </div>
            <div className="hero-kpi-value">{kpiValues.late}</div>
            <div className="kpi-subtitle">{((kpiValues.late / 50) * 100).toFixed(1)}% ของทั้งหมด</div>
          </div>
          
          <div className="hero-kpi-card absent">
            <div className="hero-kpi-header">
              <div className="hero-kpi-icon"><UserX /></div>
              <span className="kpi-label">ขาดงาน</span>
            </div>
            <div className="hero-kpi-value">{kpiValues.absent}</div>
            <div className="kpi-subtitle">ขาดโดยไม่แจ้ง</div>
          </div>
          
          <div className="hero-kpi-card pending">
            <div className="hero-kpi-header">
              <div className="hero-kpi-icon"><FileText /></div>
              <span className="kpi-label">รออนุมัติ</span>
            </div>
            <div className="hero-kpi-value">{kpiValues.pending}</div>
            <div className="kpi-subtitle">คำขอใหม่</div>
          </div>
        </div>
      </section>

      <section className="quick-stats-section">
      
        <div className="quick-stats-grid">
          <div className="stat-card">
            <div className="stat-icon work-hours"><Clock /></div>
            <div className="stat-content">
              <div className="stat-value">{totalWorkHours.toFixed(1)} <span>ชม.</span></div>
              <div className="stat-label">ชั่วโมงทำงานรวม</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon not-checkout"><AlertCircle /></div>
            <div className="stat-content">
              <div className="stat-value">{notCheckedOut.length} <span>คน</span></div>
              <div className="stat-label">ยังไม่เช็คเอาท์</div>
            </div>
          </div>
        </div>
      </section>

      <section className="main-charts-section">
        <div className="main-chart-card primary-chart">
          <div className="chart-header">
            <h3>สถิติการเข้างานวันนี้</h3>
          </div>
          <div className="chart-container">
            <canvas id="lineChart"></canvas>
          </div>
        </div>
        
        <div className="secondary-charts">
          <div className="main-chart-card chart-full-height">
            <div className="chart-header">
              <h3>สัดส่วนการลา</h3>
            </div>
            <div className="chart-container-large">
              <canvas id="doughnutChart"></canvas>
            </div>
          </div>
        </div>
      </section>
      
      <section className="additional-info-section">
        <div className="info-card-container">
          <div className="info-card">
            <div className="info-card-header">
              <h3>สรุปตามแผนก</h3>
            </div>
            <div className="dept-table-container">
              <table className="dept-table-new">
                <thead>
                  <tr>
                    <th>แผนก</th>
                    <th>ทั้งหมด</th>
                    <th>ปกติ</th>
                    <th>สาย</th>
                    <th>เฉลี่ย</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map(dept => (
                    <tr key={dept.name}>
                      <td><strong>{dept.name}</strong></td>
                      <td>{dept.total}</td>
                      <td><span className="mini-badge success">{dept.present}</span></td>
                      <td><span className="mini-badge warning">{dept.late}</span></td>
                      <td>{dept.avgHours} ชม.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-card-header">
              <h3>สถิติตามสาขา</h3>
            </div>
            <div className="branch-list">
              {branchStats.map(branch => (
                <div key={branch.name} className="branch-item">
                  <MapPin size={18} />
                  <span className="branch-name">{branch.name}</span>
                  <span className="branch-count">{branch.count} คน</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {leaveRequests.length > 0 && (
        <section className="approval-section-new">
          <div className="section-header">
            <div className="section-title">
              <FileText size={22} />
              <h2>คำขอรออนุมัติ</h2>
              <span className="badge-count">{leaveRequests.length}</span>
            </div>
          </div>
          <div className="approval-grid">
            {leaveRequests.map(req => (
              <div key={req.id} className="approval-card-new">
                <div className="approval-card-header">
                  <div className="approval-avatar">{req.name.charAt(0)}</div>
                  <div className="approval-info">
                    <h4>{req.name}</h4>
                    <div className="approval-meta">
                      <span className="leave-type-badge">{req.type}</span>
                      <span className="approval-date">{req.date}</span>
                      <span className="approval-days">({req.days} วัน)</span>
                    </div>
                  </div>
                  <span className="request-time">{req.requestTime}</span>
                </div>
                <p className="approval-reason">{req.reason}</p>
                <div className="approval-actions-new">
                  <button className="btn-approve-new" onClick={() => handleApprove(req.id)}>
                    <CheckCircle size={18} /> อนุมัติ
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="table-section-new">
        <div className="section-header">
          <div className="section-title">
            <Users size={22} />
            <h2>รายการพนักงานทั้งหมด</h2>
          </div>
          <div className="table-controls-new">
            <div className="search-box-new">
              <Search size={18} />
              <input
                type="text"
                placeholder="ค้นหาพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="select-filter">
              <option>ทั้งหมด</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="select-filter">
              <option>ทั้งหมด</option>
              <option>ปกติ</option>
              <option>สาย</option>
              <option>ขาด</option>
              <option>ลา</option>
            </select>
          </div>
        </div>
        
        <div className="table-wrapper-new">
          <table className="employee-table-new">
            <thead>
              <tr>
                <th>พนักงาน</th>
                <th>ตำแหน่ง</th>
                <th>แผนก</th>
                <th>สาขา</th>
                <th>เข้างาน</th>
                <th>ออกงาน</th>
                <th>ชั่วโมง</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map(emp => (
                  <tr key={emp.id} onClick={() => setSelectedEmployee(emp)}>
                    <td>
                      <div className="employee-cell-new">
                        <div className="avatar-initial">{getInitials(emp.firstName)}</div>
                        <span>{emp.name}</span>
                      </div>
                    </td>
                    <td><span className="position-text">{emp.position}</span></td>
                    <td>{emp.department}</td>
                    <td><span className="branch-label">{emp.branch}</span></td>
                    <td>{emp.checkInTime ? <strong>{emp.checkInTime}</strong> : <span className="text-muted">-</span>}</td>
                    <td>{emp.checkOutTime ? <strong>{emp.checkOutTime}</strong> : <span className="text-muted">-</span>}</td>
                    <td>
                      {emp.workHours ? (
                        <div className="hours-cell">{emp.workHours} ชม.</div>
                      ) : <span className="text-muted">-</span>}
                    </td>
                    <td>
                      <span className={`status-badge-new ${
                        emp.status === 'ปกติ' ? 'status-normal' : 
                        emp.status === 'สาย' ? 'status-late' : 
                        emp.status === 'ขาด' ? 'status-absent' : 'status-leave'
                      }`}>
                        {emp.status === 'ลา' ? `${emp.status} (${emp.leaveType})` : emp.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon-new" onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); }}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <UserX size={48} />
                    <p>ไม่พบข้อมูลพนักงาน</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              ก่อนหน้า
            </button>
            
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="pagination-dots">...</span>;
                }
                return null;
              })}
            </div>
            
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div className="pagination-info">
          แสดง {startIndex + 1} - {Math.min(endIndex, filteredEmployees.length)} จาก {filteredEmployees.length} รายการ
        </div>
      </section>

      

      {selectedEmployee && (
        <div className="modal-overlay-new" onClick={() => setSelectedEmployee(null)}>
          <div className="modal-new" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-new" onClick={() => setSelectedEmployee(null)}>
              <X size={24} />
            </button>
            
            <div className="modal-header-new">
              <div className="modal-avatar-large">{getInitials(selectedEmployee.firstName)}</div>
              <div className="modal-title-section">
                <h2>{selectedEmployee.name}</h2>
                <p className="modal-position">{selectedEmployee.position}</p>
                <p className="modal-dept">{selectedEmployee.department} • {selectedEmployee.branch}</p>
              </div>
            </div>
            
            <div className="modal-body-new">
              <div className="modal-detail-grid">
                <div className="detail-item">
                  <Clock className="detail-icon" />
                  <div>
                    <span className="detail-label">เวลาเข้างาน</span>
                    <strong className="detail-value">{selectedEmployee.checkInTime || '-'}</strong>
                  </div>
                </div>
                
                <div className="detail-item">
                  <Clock className="detail-icon" />
                  <div>
                    <span className="detail-label">เวลาออกงาน</span>
                    <strong className="detail-value">{selectedEmployee.checkOutTime || '-'}</strong>
                  </div>
                </div>
                
                {selectedEmployee.workHours && (
                  <div className="detail-item">
                    <TrendingUp className="detail-icon" />
                    <div>
                      <span className="detail-label">ชั่วโมงทำงาน</span>
                      <strong className="detail-value">{selectedEmployee.workHours} ชั่วโมง</strong>
                    </div>
                  </div>
                )}
                
                <div className="detail-item">
                  <MapPin className="detail-icon" />
                  <div>
                    <span className="detail-label">ตำแหน่ง GPS</span>
                    <strong className="detail-value">{selectedEmployee.location}</strong>
                  </div>
                </div>
                
                <div className="detail-item">
                  <AlertCircle className="detail-icon" />
                  <div>
                    <span className="detail-label">สถานะ</span>
                    <span className={`status-badge-new ${
                      selectedEmployee.status === 'ปกติ' ? 'status-normal' : 
                      selectedEmployee.status === 'สาย' ? 'status-late' : 
                      selectedEmployee.status === 'ขาด' ? 'status-absent' : 'status-leave'
                    }`}>
                      {selectedEmployee.status === 'ลา' ? `${selectedEmployee.status} (${selectedEmployee.leaveType})` : selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedEmployee.checkInTime && (
                <div className="photo-section">
                  <div className="photo-placeholder-new">
                    <Image size={48} />
                    <p>รูปภาพเช็คอิน</p>
                    <span className="photo-note"></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;