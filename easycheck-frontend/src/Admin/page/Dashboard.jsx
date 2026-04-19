import { useState, useEffect, useRef } from 'react';

import { X, Search, Clock, Users, UserX, Calendar, TrendingUp, AlertCircle, MoreVertical, ChevronLeft } from 'lucide-react';
import { usePermission } from '../../usePermission';
import { useAuth } from '../../AuthContext.jsx';


const API_BASE = 'http://localhost:5000';

const Dashboard = () => {
  const [summary, setSummary] = useState({ present: 0, late: 0, earlyLeave: 0, absent: 0, onLeave: 0, notCheckedOut: 0, total: 0 });
  const [employees, setEmployees] = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [leaveStats, setLeaveStats] = useState([]); // สถิติการลา 7 ประเภท
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ทั้งหมด');
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  // ใช้ ref เก็บ chart instance แทนการแขวนไว้บน DOM element
  const lineChartRef = useRef(null)
  const doughnutChartRef = useRef(null)


  const { can } = usePermission();
  const { permissions, loading } = useAuth();
  //permissions access control

  if (loading) {
    return <div>Loading...</div>;
  }

  //กั้นหน้า ถ้าไม่มีสิทธิ์จ้า
  if (!can("view_dashboard") && !can("view_attendance_report")) {
    return <div> คุณไม่มีสิทธิ์เข้าถึงหน้านี้ </div>;
  }



  // ดึงข้อมูลจาก API
  useEffect(() => {
    const token = localStorage.getItem('token');

    // ดึงข้อมูลการเข้างานวันนี้ และสถิติการลาเดือนนี้พร้อมกัน
    const checkAuth = (r) => {
      // token หมดอายุหรือ invalid → ล้าง token แล้ว redirect ไปหน้า login
      if (r.status === 401 || r.status === 403) {
        localStorage.removeItem('token')
        window.location.href = '/adminlogin'
        throw new Error('Unauthorized')
      }
      return r.json()
    }

    Promise.all([
      fetch(`${API_BASE}/admin/dashboard/today`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(checkAuth),
      fetch(`${API_BASE}/admin/dashboard/leave-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(checkAuth)
    ])
      .then(([todayData, leaveData]) => {
        setEmployees(todayData.employees || []);
        setDeptStats(todayData.departmentStats || []);
        setSummary(todayData.summary || {});
        setLeaveStats(leaveData.data || []); // เก็บสถิติการลา 7 ประเภท
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Dashboard error:', err);
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        setIsLoading(false);
      });
  }, []);

  // Initialize / update charts เมื่อ summary เปลี่ยน
  useEffect(() => {
    if (isLoading) return;

    if (typeof Chart === 'undefined') return;

    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    const barData = [
      (summary.present || 0) - (summary.late || 0) - (summary.earlyLeave || 0),
      summary.late || 0,
      summary.earlyLeave || 0,
      summary.absent || 0,
      summary.onLeave || 0
    ];

    // --- Bar Chart ---
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
      // ถ้า chart มีอยู่แล้ว update ข้อมูล / ถ้าไม่มีให้สร้างใหม่
      if (lineChartRef.current) {
        lineChartRef.current.data.datasets[0].data = barData;
        lineChartRef.current.update();
      } else {
        lineChartRef.current = new Chart(lineCtx, {
          type: 'bar',
          data: {
            labels: ['เข้างาน', 'มาสาย', 'ออกก่อนเวลา', 'ขาดงาน', 'ลา'],
            datasets: [{
              label: 'จำนวนคน',
              data: barData,
              backgroundColor: ['#50589C', '#ff9800', '#f97316', '#f44336', '#9c27b0'],
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
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                callbacks: { label: (ctx) => `${ctx.parsed.y} คน` }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                  stepSize: 1,
                  precision: 0,
                  callback: (v) => Number.isInteger(v) ? `${v} คน` : ''
                }
              },
              x: { grid: { display: false } }
            }
          }
        });
      }
    }

    // --- Doughnut Chart (สัดส่วนการลา 7 ประเภท) ---
    const doughnutCtx = document.getElementById('doughnutChart');
    if (doughnutCtx && leaveStats.length > 0) {
      // กรองเฉพาะประเภทที่มีการลาเพื่อให้ chart ไม่รก
      const activeLeave = leaveStats.filter(t => t.count > 0);
      const doughnutData = activeLeave.length > 0 ? activeLeave.map(t => t.count) : leaveStats.map(t => t.count);
      const doughnutLabels = activeLeave.length > 0 ? activeLeave.map(t => t.thLabel) : leaveStats.map(t => t.thLabel);
      const doughnutColors = activeLeave.length > 0 ? activeLeave.map(t => t.color) : leaveStats.map(t => t.color);

      // ถ้า chart มีอยู่แล้ว update ข้อมูล / ถ้าไม่มีให้สร้างใหม่
      if (doughnutChartRef.current) {
        doughnutChartRef.current.data.labels = doughnutLabels;
        doughnutChartRef.current.data.datasets[0].data = doughnutData;
        doughnutChartRef.current.data.datasets[0].backgroundColor = doughnutColors;
        doughnutChartRef.current.update();
      } else {
        doughnutChartRef.current = new Chart(doughnutCtx, {
          type: 'doughnut',
          data: {
            labels: doughnutLabels,
            datasets: [{
              data: doughnutData,
              backgroundColor: doughnutColors,
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
                labels: { padding: 12, font: { size: 12 }, usePointStyle: true, pointStyle: 'circle' }
              },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                callbacks: {
                  label: (ctx) => {
                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                    const pct = total ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                    return `${ctx.label}: ${ctx.parsed} ครั้ง (${pct}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }

    // ทำลาย chart เมื่อ component ถูกถอดออกจากหน้า เพื่อป้องกัน memory leak
    return () => {
      if (lineChartRef.current) { lineChartRef.current.destroy(); lineChartRef.current = null; }
      if (doughnutChartRef.current) { doughnutChartRef.current.destroy(); doughnutChartRef.current = null; }
    };
  }, [isLoading, summary, leaveStats]);

  const calcWorkHours = (inTime, outTime) => {
    if (!inTime || !outTime) return null;
    const [ih, im] = inTime.split(':').map(Number);
    const [oh, om] = outTime.split(':').map(Number);
    const diff = (oh * 60 + om - ih * 60 - im) / 60;
    return diff > 0 ? diff.toFixed(1) : null;
  };

  const statusClass = (s) => ({

    'ปกติ':          'bg-emerald-100 text-emerald-700 border-emerald-200',
    'สาย':           'bg-amber-100 text-amber-700 border-amber-200',
    'ขาด':           'bg-rose-100 text-rose-700 border-rose-200',
    'ลา':            'bg-purple-100 text-purple-700 border-purple-200',
    'ออกก่อนเวลา':    'bg-orange-100 text-orange-700 border-orange-200',
    'วันหยุด':        'bg-slate-100 text-slate-700 border-slate-200',
    'ยังไม่เข้างาน':   'bg-sky-100 text-sky-700 border-sky-200',
  }[s] || 'bg-gray-100 text-gray-700 border-gray-200');

  const departments = [...new Set(employees.map(e => e.department))].filter(Boolean).sort();

  const filteredEmployees = employees.filter(emp => {
    const name = `${emp.firstname} ${emp.lastname}`;
    const matchSearch = name.includes(searchTerm) || emp.department?.includes(searchTerm) || emp.position?.includes(searchTerm);
    const matchDept = filterDept === 'ทั้งหมด' || emp.department === filterDept;
    const matchStatus = filterStatus === 'ทั้งหมด' || emp.overallStatus === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterDept, filterStatus]);

  const todayDisplay = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // แสดง error UI แทนหน้าว่างเมื่อ API ล้มเหลว
  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex-1 box-border overflow-x-hidden bg-gray-50 p-4 sm:p-6 md:p-8 font-sans text-gray-800">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">EC</div>
          <h1 className="text-3xl font-bold text-gray-800 m-0">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm font-medium border border-gray-100">
          <Calendar size={18} />
          <span>{todayDisplay}</span>
        </div>
      </header>

      {/* KPI Cards — 4 ใบ */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-emerald-500 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600"><Users /></div>
              <span className="text-gray-500 font-medium">เข้างานวันนี้</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{summary.present}</div>
            <div className="text-sm text-gray-400">จาก {summary.total} คน</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-amber-500 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600"><Clock /></div>
              <span className="text-gray-500 font-medium">มาสาย</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{summary.late}</div>
            <div className="text-sm text-gray-400">
              {summary.total ? ((summary.late / summary.total) * 100).toFixed(1) : 0}% ของทั้งหมด
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-rose-500 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-rose-100 text-rose-600"><UserX /></div>
              <span className="text-gray-500 font-medium">ขาดงาน</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{summary.absent}</div>
            <div className="text-sm text-gray-400">ขาดโดยไม่แจ้ง</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-purple-500 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600"><Calendar /></div>
              <span className="text-gray-500 font-medium">ลางาน</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{summary.onLeave}</div>
            <div className="text-sm text-gray-400">ลาได้รับอนุมัติวันนี้</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-orange-500 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-orange-100 text-orange-600"><LogOut /></div>
              <span className="text-gray-500 font-medium">ออกก่อนเวลา</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">{summary.earlyLeave}</div>
            <div className="text-sm text-gray-400">ต้องรอหัวหน้าอนุมัติ</div>
          </div>
        </div>
      </section>

      {/* ยังไม่เช็คเอาท์ */}
      <section className="mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 max-w-sm">
          <div className="p-4 rounded-full bg-orange-100 text-orange-600"><AlertCircle size={28} /></div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-gray-800">
              {summary.notCheckedOut} <span className="text-lg text-gray-500 font-normal ml-1">คน</span>
            </div>
            <div className="text-gray-500 font-medium mt-1">ยังไม่เช็คเอาท์</div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-6 m-0">สถิติการเข้างานวันนี้</h3>
          <div className="relative h-80 w-full">
            <canvas id="lineChart"></canvas>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-1 m-0">สัดส่วนการลาเดือนนี้</h3>
          <p className="text-sm text-gray-400 mb-4 m-0">จำนวนครั้งที่ลา แยกตามประเภท</p>
          {leaveStats.every(t => t.count === 0) ? (
            // แสดงข้อความเมื่อยังไม่มีการลาเดือนนี้
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium h-80">
              ไม่มีข้อมูลการลาเดือนนี้
            </div>
          ) : (
            <div className="relative h-80 w-full flex items-center justify-center">
              <canvas id="doughnutChart"></canvas>
            </div>
          )}
        </div>
      </section>

      {/* Department Stats */}
      <section className="mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 m-0">สรุปตามแผนก</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">แผนก</th>
                  <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">ทั้งหมด</th>
                  <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">ปกติ</th>
                  <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">สาย</th>
                  <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">ออกก่อน</th>
                  <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">ขาด</th>
                  <th className="pb-3 border-b-2 border-gray-100 text-gray-500 font-semibold">ลา</th>
                </tr>
              </thead>
              <tbody>
                {deptStats.map(dept => (
                  <tr key={dept.department} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 border-b border-gray-50 text-gray-700 font-semibold">{dept.department}</td>
                    <td className="py-4 border-b border-gray-50 text-gray-700">{dept.total}</td>
                    <td className="py-4 border-b border-gray-50">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{dept.present}</span>
                    </td>
                    <td className="py-4 border-b border-gray-50">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{dept.late}</span>
                    </td>
                    <td className="py-4 border-b border-gray-50">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">{dept.earlyLeave || 0}</span>
                    </td>
                    <td className="py-4 border-b border-gray-50">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">{dept.absent}</span>
                    </td>
                    <td className="py-4 border-b border-gray-50">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">{dept.onLeave}</span>
                    </td>
                  </tr>
                ))}
                {deptStats.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">ไม่มีข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Employee Table */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800 m-0">รายการพนักงานทั้งหมด</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex-1 xl:flex-none min-w-[200px] focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-sm">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[140px] text-sm font-medium shadow-sm"
            >
              <option>ทั้งหมด</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-w-[120px] text-sm font-medium shadow-sm"
            >
              <option>ทั้งหมด</option>
              <option>ปกติ</option>
              <option>สาย</option>
              <option>ขาด</option>
              <option>ลา</option>
              <option>ออกก่อนเวลา</option>
              <option>วันหยุด</option>
              <option>ยังไม่เข้างาน</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
            <thead>
              <tr>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">พนักงาน</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">ตำแหน่ง</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">แผนก</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">เข้างาน</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">ออกงาน</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">ชั่วโมง</th>
                <th className="bg-gray-50/80 px-6 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-200">สถานะ</th>
                <th className="bg-gray-50/80 px-6 py-4 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentEmployees.length > 0 ? (
                currentEmployees.map(emp => {
                  const workHours = calcWorkHours(emp.checkInTime, emp.checkOutTime);
                  return (
                    <tr
                      key={emp.id_employee}
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3 font-medium text-gray-800">
                          {emp.avatar ? (
                            <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-sm group-hover:bg-indigo-200 transition-colors">
                              {emp.firstname?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <span>{emp.firstname} {emp.lastname}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-gray-600 font-medium">{emp.position}</td>
                      <td className="px-6 py-4 align-middle text-sm text-gray-700 font-medium">{emp.department}</td>
                      <td className="px-6 py-4 align-middle">
                        {emp.checkInTime
                          ? <strong className="text-gray-700 font-semibold">{emp.checkInTime}</strong>
                          : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {emp.checkOutTime
                          ? <strong className="text-gray-700 font-semibold">{emp.checkOutTime}</strong>
                          : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {workHours
                          ? <div className="bg-indigo-50/80 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold inline-block border border-indigo-100 shadow-sm">{workHours} ชม.</div>
                          : <span className="text-gray-400 ml-4">-</span>}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block shadow-sm border ${statusClass(emp.overallStatus)}`}>
                          {emp.overallStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <button
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors outline-none border-none bg-transparent cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); }}
                        >
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <UserX size={32} className="text-gray-400" />
                      </div>
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
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <button
                      key={pageNum}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-all shadow-sm cursor-pointer ${currentPage === pageNum
                          ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 bg-white'
                        }`}
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
              <ChevronLeft size={18} className="rotate-180" />
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mt-5 font-medium">
          แสดง <span className="text-gray-700 font-bold">{filteredEmployees.length > 0 ? startIndex + 1 : 0}</span> ถึง{' '}
          <span className="text-gray-700 font-bold">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span> จากทั้งหมด{' '}
          <span className="text-gray-700 font-bold">{filteredEmployees.length}</span> รายการ
        </div>
      </section>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10 border-none bg-transparent cursor-pointer"
              onClick={() => setSelectedEmployee(null)}
            >
              <X size={24} />
            </button>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>

              {selectedEmployee.avatar ? (
                <img
                  src={selectedEmployee.avatar}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white/30 shadow-lg shrink-0 relative z-10"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl sm:text-5xl font-bold backdrop-blur-md shadow-lg shrink-0 relative z-10">
                  {selectedEmployee.firstname?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-center sm:text-left relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold m-0">{selectedEmployee.firstname} {selectedEmployee.lastname}</h2>
                <p className="text-indigo-100 text-lg sm:text-xl m-0 font-medium">{selectedEmployee.position}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="bg-white/15 border border-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {selectedEmployee.department}
                  </span>
                  {selectedEmployee.shiftStart && (
                    <span className="bg-black/15 border border-black/10 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      กะ {selectedEmployee.shiftStart} – {selectedEmployee.shiftEnd}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">ข้อมูลการลงเวลา</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0"><Clock size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium mb-1">เวลาเข้างาน</span>
                    <strong className="text-gray-800 text-lg font-bold">{selectedEmployee.checkInTime || '-'}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0"><Clock size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium mb-1">เวลาออกงาน</span>
                    <strong className="text-gray-800 text-lg font-bold">{selectedEmployee.checkOutTime || '-'}</strong>
                  </div>
                </div>

                {calcWorkHours(selectedEmployee.checkInTime, selectedEmployee.checkOutTime) && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0"><TrendingUp size={20} /></div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium mb-1">ชั่วโมงทำงาน</span>
                      <strong className="text-gray-800 text-lg font-bold">
                        {calcWorkHours(selectedEmployee.checkInTime, selectedEmployee.checkOutTime)}{' '}
                        <span className="text-sm font-medium text-gray-500 ml-1">ชั่วโมง</span>
                      </strong>
                    </div>
                  </div>
                )}

                <div className={`flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm ${!calcWorkHours(selectedEmployee.checkInTime, selectedEmployee.checkOutTime) ? 'sm:col-span-2' : ''}`}>
                  <div className="p-2.5 bg-gray-200 text-gray-600 rounded-lg shrink-0"><AlertCircle size={20} /></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm text-gray-500 font-medium mb-1">สถานะปัจจุบัน</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block w-fit shadow-sm border ${statusClass(selectedEmployee.overallStatus)}`}>
                      {selectedEmployee.overallStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* รูปถ่ายเช็คอิน / เช็คเอาท์ */}
              {(selectedEmployee.checkInPhoto || selectedEmployee.checkOutPhoto) && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">รูปถ่ายการลงเวลา</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedEmployee.checkInPhoto && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-500 font-medium">รูปเช็คอิน</span>
                        <img
                          src={selectedEmployee.checkInPhoto}
                          alt="Check-in photo"
                          className="w-full rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                      </div>
                    )}
                    {selectedEmployee.checkOutPhoto && (
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-500 font-medium">รูปเช็คเอาท์</span>
                        <img
                          src={selectedEmployee.checkOutPhoto}
                          alt="Check-out photo"
                          className="w-full rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                      </div>
                    )}
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
