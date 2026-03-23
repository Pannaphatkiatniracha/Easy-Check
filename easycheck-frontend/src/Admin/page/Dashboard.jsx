import React, { useState, useEffect } from 'react';
import { X, Search, Clock, Users, UserX, FileText, MapPin, Calendar, TrendingUp, AlertCircle, CheckCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight, Activity, Image ,ArrowDownToLine} from 'lucide-react';

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
              backgroundColor: ['#3C467B', '#50589C', '#636CCB','#7F8CFF'],
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
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex-1 box-border overflow-x-hidden bg-gray-50 p-4 sm:p-6 md:p-8 font-sans text-gray-800">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">EC</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 m-0">Dashboard</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm font-medium border border-gray-100">
            <Calendar size={18} />
            <span>วันอาทิตย์ที่ 9 พฤศจิกายน 2568</span>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-emerald-500 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600"><Users /></div>
              <span className="text-gray-500 font-medium">เข้างานวันนี้</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{kpiValues.present}</div>
            <div className="text-sm text-gray-400">จาก 50 คน</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-amber-500 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600"><Clock /></div>
              <span className="text-gray-500 font-medium">มาสาย</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{kpiValues.late}</div>
            <div className="text-sm text-gray-400">{((kpiValues.late / 50) * 100).toFixed(1)}% ของทั้งหมด</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-rose-500 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-rose-100 text-rose-600"><UserX /></div>
              <span className="text-gray-500 font-medium">ขาดงาน</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{kpiValues.absent}</div>
            <div className="text-sm text-gray-400">ขาดโดยไม่แจ้ง</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><FileText /></div>
              <span className="text-gray-500 font-medium">รออนุมัติ</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{kpiValues.pending}</div>
            <div className="text-sm text-gray-400">คำขอใหม่</div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 rounded-full text-2xl bg-indigo-100 text-indigo-600"><Clock /></div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-800">{totalWorkHours.toFixed(1)} <span className="text-lg text-gray-500 font-normal ml-1">ชม.</span></div>
              <div className="text-gray-500 font-medium mt-1">ชั่วโมงทำงานรวม</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 rounded-full text-2xl bg-orange-100 text-orange-600"><AlertCircle /></div>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-800">{notCheckedOut.length} <span className="text-lg text-gray-500 font-normal ml-1">คน</span></div>
              <div className="text-gray-500 font-medium mt-1">ยังไม่เช็คเอาท์</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col lg:col-span-2">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 m-0">สถิติการเข้างานวันนี้</h3>
          </div>
          <div className="relative h-80 w-full">
            <canvas id="lineChart"></canvas>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 m-0">สัดส่วนการลา</h3>
            </div>
            <div className="relative h-80 w-full flex items-center justify-center">
              <canvas id="doughnutChart"></canvas>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 m-0">สรุปตามแผนก</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr>
                    <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">แผนก</th>
                    <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">ทั้งหมด</th>
                    <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">ปกติ</th>
                    <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">สาย</th>
                    <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">เฉลี่ย</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map(dept => (
                    <tr key={dept.name} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 border-b border-gray-50 text-gray-700 font-semibold">{dept.name}</td>
                      <td className="py-4 border-b border-gray-50 text-gray-700">{dept.total}</td>
                      <td className="py-4 border-b border-gray-50"><span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{dept.present}</span></td>
                      <td className="py-4 border-b border-gray-50"><span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{dept.late}</span></td>
                      <td className="py-4 border-b border-gray-50 text-gray-700">{dept.avgHours} ชม.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 m-0">สถิติตามสาขา</h3>
            </div>
            <div className="flex flex-col gap-4">
              {branchStats.map(branch => (
                <div key={branch.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="flex items-center gap-3 font-semibold text-gray-700">
                    <MapPin size={18} className="text-indigo-500" />
                    <span className="text-gray-700">{branch.name}</span>
                  </div>
                  <span className="text-indigo-600 font-bold bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">{branch.count} คน</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {leaveRequests.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800 m-0">คำขอรออนุมัติ</h2>
              <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">{leaveRequests.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {leaveRequests.map(req => (
              <div key={req.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50 flex flex-col h-full relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                    {req.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 pr-20">
                    <h4 className="text-lg font-bold text-gray-800 m-0 mb-2 truncate">{req.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap border border-purple-200">{req.type}</span>
                      <span className="text-gray-600 font-medium whitespace-nowrap">{req.date}</span>
                      <span className="text-gray-500 whitespace-nowrap">({req.days} วัน)</span>
                    </div>
                  </div>
                  <span className="absolute top-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">{req.requestTime}</span>
                </div>
                <p className="text-gray-600 bg-white p-3.5 rounded-lg border border-gray-100 text-sm mb-5 flex-1 shadow-sm leading-relaxed">{req.reason}</p>
                <div className="flex justify-end gap-3 mt-auto">
                  <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors w-full justify-center shadow-sm border-none cursor-pointer" onClick={() => handleApprove(req.id)}>
                    <CheckCircle size={18} /> อนุมัติ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800 m-0">รายการพนักงานทั้งหมด</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex-1 xl:flex-none min-w-[200px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[140px] text-sm font-medium shadow-sm">
              <option>ทั้งหมด</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[120px] text-sm font-medium shadow-sm">
              <option>ทั้งหมด</option>
              <option>ปกติ</option>
              <option>สาย</option>
              <option>ขาด</option>
              <option>ลา</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">พนักงาน</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">ตำแหน่ง</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">แผนก</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">สาขา</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">เข้างาน</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">ออกงาน</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">ชั่วโมง</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">สถานะ</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentEmployees.length > 0 ? (
                currentEmployees.map(emp => (
                  <tr key={emp.id} onClick={() => setSelectedEmployee(emp)} className="hover:bg-indigo-50/40 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3 font-medium text-gray-800">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-sm group-hover:bg-indigo-200 transition-colors">{getInitials(emp.firstName)}</div>
                        <span>{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-sm text-gray-600 font-medium">{emp.position}</td>
                    <td className="px-6 py-4 align-middle text-sm text-gray-700 font-medium">{emp.department}</td>
                    <td className="px-6 py-4 align-middle"><span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-200">{emp.branch}</span></td>
                    <td className="px-6 py-4 align-middle">{emp.checkInTime ? <strong className="text-gray-700 font-semibold">{emp.checkInTime}</strong> : <span className="text-gray-400 font-medium">-</span>}</td>
                    <td className="px-6 py-4 align-middle">{emp.checkOutTime ? <strong className="text-gray-700 font-semibold">{emp.checkOutTime}</strong> : <span className="text-gray-400 font-medium">-</span>}</td>
                    <td className="px-6 py-4 align-middle">
                      {emp.workHours ? (
                        <div className="bg-indigo-50/80 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold inline-block border border-indigo-100 shadow-sm">{emp.workHours} ชม.</div>
                      ) : <span className="text-gray-400 font-medium ml-4">-</span>}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block shadow-sm border ${
                        emp.status === 'ปกติ' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                        emp.status === 'สาย' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                        emp.status === 'ขาด' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-purple-100 text-purple-700 border-purple-200'
                      }`}>
                        {emp.status === 'ลา' ? `${emp.status} (${emp.leaveType})` : emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors outline-none border-none bg-transparent cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); }}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2"><UserX size={32} className="text-gray-400" /></div>
                      <p className="text-lg font-medium text-gray-500 m-0">ไม่พบข้อมูลพนักงาน</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button 
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-indigo-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm cursor-pointer" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              ก่อนหน้า
            </button>
            
            <div className="flex items-center gap-1.5 hidden sm:flex">
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
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all shadow-sm cursor-pointer ${currentPage === pageNum ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 bg-white'}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-gray-400 font-medium tracking-widest">...</span>;
                }
                return null;
              })}
            </div>
            
            <button 
              className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-indigo-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm cursor-pointer" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mt-5 font-medium">
          แสดง <span className="text-gray-700 font-bold">{startIndex + 1}</span> ถึง <span className="text-gray-700 font-bold">{Math.min(endIndex, filteredEmployees.length)}</span> จากทั้งหมด <span className="text-gray-700 font-bold">{filteredEmployees.length}</span> รายการ
        </div>
      </section>

      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 transition-all duration-200" onClick={() => setSelectedEmployee(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative transition-all duration-200 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10 border-none bg-transparent cursor-pointer" onClick={() => setSelectedEmployee(null)}>
              <X size={24} />
            </button>
            
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden flex-shrink-0">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
               
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl sm:text-5xl font-bold backdrop-blur-md shadow-lg shrink-0 relative z-10">{getInitials(selectedEmployee.firstName)}</div>
              <div className="flex flex-col gap-1.5 text-center sm:text-left relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold m-0 tracking-wide">{selectedEmployee.name}</h2>
                <p className="text-indigo-100 text-lg sm:text-xl m-0 font-medium">{selectedEmployee.position}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="bg-white/15 border border-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-sm">{selectedEmployee.department}</span>
                  <span className="bg-black/15 border border-black/10 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-sm">{selectedEmployee.branch}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">ข้อมูลการลงเวลา</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0"><Clock size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium mb-1">เวลาเข้างาน</span>
                    <strong className="text-gray-800 text-lg font-bold">{selectedEmployee.checkInTime || '-'}</strong>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0"><Clock size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium mb-1">เวลาออกงาน</span>
                    <strong className="text-gray-800 text-lg font-bold">{selectedEmployee.checkOutTime || '-'}</strong>
                  </div>
                </div>
                
                {selectedEmployee.workHours && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors">
                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0"><TrendingUp size={20} /></div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium mb-1">ชั่วโมงทำงาน</span>
                      <strong className="text-gray-800 text-lg font-bold">{selectedEmployee.workHours} <span className="text-sm font-medium text-gray-500 ml-1">ชั่วโมง</span></strong>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shrink-0"><MapPin size={20} /></div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-gray-500 font-medium mb-1">ตำแหน่ง GPS</span>
                    <strong className="text-gray-800 text-base font-semibold truncate" title={selectedEmployee.location}>{selectedEmployee.location}</strong>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm hover:border-gray-200 transition-colors sm:col-span-2">
                  <div className="p-2.5 bg-gray-200 text-gray-600 rounded-lg shrink-0"><AlertCircle size={20} /></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm text-gray-500 font-medium mb-1">สถานะปัจจุบัน</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block w-fit shadow-sm border ${
                      selectedEmployee.status === 'ปกติ' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                      selectedEmployee.status === 'สาย' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                      selectedEmployee.status === 'ขาด' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-purple-100 text-purple-700 border-purple-200'
                    }`}>
                      {selectedEmployee.status === 'ลา' ? `${selectedEmployee.status} (${selectedEmployee.leaveType})` : selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedEmployee.checkInTime && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">รูปภาพยืนยันตัวตน</h3>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 gap-3 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Image size={32} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-500 m-0 mb-1">รูปภาพเช็คอิน</p>
                      <span className="text-xs text-gray-400">คลิกเพื่อดูรูปขนาดเต็ม</span>
                    </div>
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
        
     