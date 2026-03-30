import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, Briefcase, MapPin, Calendar, Plus, X, User, TrendingUp, Clock, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

const AVATAR_COLORS = ['#3C4678', '#50589C', '#636CCB', '#6E8CFB'];

const Personalsummary = () => {
  const [employees, setEmployees] = useState([]);

// ดึงข้อมูลจาก API
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/personal-summary/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const mapped = json.data.map((user, index) => {
            const nameParts = user.full_name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            return {
              id: user.id,
              firstName,
              lastName,
              empCode: user.employee_id,
              position: user.position || '',
              department: user.department || '',
              branch: user.branch || '',
              phone: user.phone || '',
              email: user.email || '',
              supervisor: '',
              startDate: user.join_date ? user.join_date.split('T')[0] : '',
              attendanceRate: 0,
              workStats: { present: 0, late: 0, absent: 0 },
              leaveBalance: { personal: 0, sick: 0, vacation: 0, maternity: 0 },
              avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length]
            };
          });
          setEmployees(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch employees:', err));
  }, []);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    empCode: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    supervisor: '',
    startDate: '',
    attendanceRate: 0,
    workStats: { present: 0, late: 0, absent: 0 },
    leaveBalance: { personal: 0, sick: 0, vacation: 0, maternity: 0 },
    avatarColor: '#3C4678'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterPosition, setFilterPosition] = useState('');


  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const calculateWorkDuration = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} ปี ${months} เดือน`;
    }
    return `${months} เดือน`;
  };

  const openDetails = (employee) => {
    setSelectedEmployee(employee);
    setEditData({
      phone: employee.phone,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      supervisor: employee.supervisor
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id 
        ? { ...emp, ...editData }
        : emp
    );
    setEmployees(updatedEmployees);
    setSelectedEmployee({ ...selectedEmployee, ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      phone: selectedEmployee.phone,
      email: selectedEmployee.email,
      position: selectedEmployee.position,
      department: selectedEmployee.department,
      supervisor: selectedEmployee.supervisor
    });
    setIsEditing(false);
  };

  const handleAddEmployee = () => {
    const colors = ['#3C4678', '#50589C', '#636CCB', '#6E8CFB'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newEmp = {
      ...newEmployee,
      id: employees.length + 1,
      avatarColor: randomColor
    };
    
    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setNewEmployee({
      firstName: '',
      lastName: '',
      empCode: '',
      position: '',
      department: '',
      phone: '',
      email: '',
      supervisor: '',
      startDate: '',
      attendanceRate: 0,
      workStats: { present: 0, late: 0, absent: 0 },
      leaveBalance: { personal: 0, sick: 0, vacation: 0, maternity: 0 },
      avatarColor: '#3C4678'
    });
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานคนนี้?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      closeModal();
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearchTerm = fullName.includes(searchTermLower) || employee.empCode.toLowerCase().includes(searchTermLower);
    const matchesDepartment = filterDepartment ? employee.department === filterDepartment : true;
    const matchesPosition = filterPosition ? employee.position === filterPosition : true;

    return matchesSearchTerm && matchesDepartment && matchesPosition;
  });

  const allDepartments = [...new Set(employees.map(emp => emp.department))];
  const allPositions = [...new Set(employees.map(emp => emp.position))];

  return (
    <div className="w-full flex-1 box-border overflow-x-hidden bg-slate-50 p-4 sm:p-6 md:p-8 font-sans text-gray-800 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 m-0 tracking-tight">ระบบสรุปข้อมูลรายบุคคล</h1>
          <p className="text-gray-500 mt-2 font-medium">จัดการและดูสถิติการทำงานของพนักงานทั้งหมด</p>
        </div>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 border-none cursor-pointer" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> เพิ่มพนักงานใหม่
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ หรือรหัสพนักงาน..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterDepartment} 
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700 min-w-[150px] transition-colors cursor-pointer"
          >
            <option value="">ทุกแผนก</option>
            {allDepartments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <select 
            value={filterPosition} 
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700 min-w-[150px] transition-colors cursor-pointer"
          >
            <option value="">ทุกตำแหน่ง</option>
            {allPositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="p-5 flex items-start gap-4">
              <div className="w-16 h-16 rounded-full text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: employee.avatarColor }}>
                {getInitials(employee.firstName, employee.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-lg font-bold text-gray-800 m-0 truncate group-hover:text-indigo-600 transition-colors">{employee.firstName} {employee.lastName}</h2>
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm ring-4 ring-emerald-50" title="สถานะ: ปกติ"></div>
                </div>
                <p className="text-xs text-indigo-600 mb-2.5 m-0 font-bold bg-indigo-50 inline-block px-2 py-0.5 rounded">{employee.empCode}</p>
                <div className="flex flex-col gap-1.5">
                  <p className="text-gray-500 font-medium m-0 text-sm truncate flex items-center gap-2"><Briefcase size={14} className="text-gray-400"/> {employee.position}</p>
                  <p className="text-gray-500 font-medium m-0 text-sm truncate flex items-center gap-2"><MapPin size={14} className="text-gray-400"/> {employee.department}</p>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-4 bg-gray-50/80 border-t border-b border-gray-100 grid grid-cols-3 gap-2 divide-x divide-gray-200">
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 font-medium mb-1">เข้างาน</span>
                <span className="text-base font-bold text-emerald-600">{employee.attendanceRate}%</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 font-medium mb-1">มาสาย</span>
                <span className="text-base font-bold text-amber-500">{employee.workStats.late} <span className="text-xs font-normal">ครั้ง</span></span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 font-medium mb-1">ลากิจ/ป่วย</span>
                <span className="text-base font-bold text-blue-500">{employee.leaveBalance.personal + employee.leaveBalance.sick} <span className="text-xs font-normal">วัน</span></span>
              </div>
            </div>

            <div className="p-4 mt-auto bg-white">
              <button 
                className="w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white py-2.5 rounded-xl font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border-none" 
                onClick={() => openDetails(employee)}
              >
                ดูรายละเอียดพนักงาน <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 transition-all duration-200" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-20 bg-transparent border-none text-2xl cursor-pointer" onClick={closeModal}><X size={24}/></button>
            
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-10 text-white flex flex-col items-center text-center relative flex-shrink-0">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
              <div className="w-28 h-28 rounded-full border-4 border-white/30 flex items-center justify-center text-4xl font-bold shadow-lg mb-5 text-white z-10" style={{ backgroundColor: selectedEmployee.avatarColor }}>
                {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
              </div>
              <h2 className="text-3xl font-extrabold m-0 z-10 relative">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-indigo-50 font-bold mt-3 z-10 relative backdrop-blur-sm border border-white/10">{selectedEmployee.empCode}</span>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-slate-50">
              <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200 m-0 flex items-center gap-2"><User size={22} className="text-indigo-600"/> ข้อมูลส่วนตัว</h3>
                <div className="flex flex-col bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center py-3.5 border-b border-gray-50 gap-2 sm:gap-0 hover:bg-slate-50 px-4 rounded-xl transition-colors">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm flex items-center gap-2"><Phone size={18} className="text-indigo-400"/> เบอร์โทรศัพท์:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                      <span className="w-full sm:w-2/3 text-gray-900 font-bold">{selectedEmployee.phone}</span>
                  )}
                </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-3.5 border-b border-gray-50 gap-2 sm:gap-0 hover:bg-slate-50 px-4 rounded-xl transition-colors">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm flex items-center gap-2"><Mail size={18} className="text-indigo-400"/> อีเมล:</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                      <span className="w-full sm:w-2/3 text-gray-900 font-bold">{selectedEmployee.email}</span>
                  )}
                </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-3.5 border-b border-gray-50 gap-2 sm:gap-0 hover:bg-slate-50 px-4 rounded-xl transition-colors">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm flex items-center gap-2"><Briefcase size={18} className="text-indigo-400"/> ตำแหน่ง:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.position}
                      onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                        className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                      <span className="w-full sm:w-2/3 text-gray-900 font-bold">{selectedEmployee.position}</span>
                  )}
                </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-3.5 border-b border-gray-50 gap-2 sm:gap-0 hover:bg-slate-50 px-4 rounded-xl transition-colors">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm flex items-center gap-2"><MapPin size={18} className="text-indigo-400"/> แผนก:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.department}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                        className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                      <span className="w-full sm:w-2/3 text-gray-900 font-bold">{selectedEmployee.department}</span>
                  )}
                </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-3.5 border-b border-gray-50 gap-2 sm:gap-0 hover:bg-slate-50 px-4 rounded-xl transition-colors">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm flex items-center gap-2"><User size={18} className="text-indigo-400"/> หัวหน้า:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.supervisor}
                      onChange={(e) => setEditData({ ...editData, supervisor: e.target.value })}
                        className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                      <span className="w-full sm:w-2/3 text-gray-900 font-bold">{selectedEmployee.supervisor}</span>
                  )}
                </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200 m-0 flex items-center gap-2"><Clock size={22} className="text-emerald-600"/> สถิติการทำงาน</h3>
                <div className="flex flex-col bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center py-3.5 border-b border-gray-50 gap-2 sm:gap-0 px-4">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm flex items-center gap-2"><Calendar size={18} className="text-emerald-400"/> วันเริ่มงาน:</span>
                    <span className="w-full sm:w-2/3 text-gray-900 font-bold">{new Date(selectedEmployee.startDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-3.5 border-b border-gray-50 gap-2 sm:gap-0 px-4">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm flex items-center gap-2"><Clock size={18} className="text-emerald-400"/> อายุงาน:</span>
                    <span className="w-full sm:w-2/3 text-gray-900 font-bold">{calculateWorkDuration(selectedEmployee.startDate)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center py-4 px-4 bg-slate-50/50 rounded-xl mt-2">
                    <span className="w-full sm:w-1/3 text-gray-500 font-semibold text-sm mb-3 sm:mb-0 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-400"/> เดือนนี้:</span>
                    <div className="w-full sm:w-2/3 flex flex-wrap gap-3">
                      <div className="flex flex-col items-center bg-white border border-gray-100 shadow-sm rounded-lg px-4 py-2 flex-1"><span className="text-xs text-gray-500 font-semibold mb-1">มาทำงาน</span><span className="text-lg text-emerald-600 font-bold">{selectedEmployee.workStats.present} <span className="text-xs font-medium text-gray-400">วัน</span></span></div>
                      <div className="flex flex-col items-center bg-white border border-gray-100 shadow-sm rounded-lg px-4 py-2 flex-1"><span className="text-xs text-gray-500 font-semibold mb-1">มาสาย</span><span className="text-lg text-amber-500 font-bold">{selectedEmployee.workStats.late} <span className="text-xs font-medium text-gray-400">วัน</span></span></div>
                      <div className="flex flex-col items-center bg-white border border-gray-100 shadow-sm rounded-lg px-4 py-2 flex-1"><span className="text-xs text-gray-500 font-semibold mb-1">ขาดงาน</span><span className="text-lg text-rose-500 font-bold">{selectedEmployee.workStats.absent} <span className="text-xs font-medium text-gray-400">วัน</span></span></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200 m-0 flex items-center gap-2"><CheckCircle2 size={22} className="text-blue-500"/> สัดส่วนการเข้างาน</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative"
                      style={{ width: `${selectedEmployee.attendanceRate}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                  <span className="font-extrabold text-indigo-700 w-16 text-right text-xl">{selectedEmployee.attendanceRate}%</span>
                </div>
              </section>

              <section className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200 m-0 flex items-center gap-2"><FileText size={22} className="text-orange-500"/> โควตาวันลาคงเหลือ</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
                  <div className="bg-gradient-to-b from-blue-50 to-white p-5 rounded-2xl text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-sm text-blue-600 mb-2 font-bold bg-blue-100/50 py-1 rounded-lg">ลากิจ</span>
                    <span className="block text-3xl font-extrabold text-blue-900">{selectedEmployee.leaveBalance.personal} <span className="text-sm font-bold text-blue-400">วัน</span></span>
                  </div>
                  <div className="bg-gradient-to-b from-amber-50 to-white p-5 rounded-2xl text-center border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-sm text-amber-600 mb-2 font-bold bg-amber-100/50 py-1 rounded-lg">ลาป่วย</span>
                    <span className="block text-3xl font-extrabold text-amber-900">{selectedEmployee.leaveBalance.sick} <span className="text-sm font-bold text-amber-400">วัน</span></span>
                  </div>
                  <div className="bg-gradient-to-b from-emerald-50 to-white p-5 rounded-2xl text-center border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-sm text-emerald-600 mb-2 font-bold bg-emerald-100/50 py-1 rounded-lg">ลาพักร้อน</span>
                    <span className="block text-3xl font-extrabold text-emerald-900">{selectedEmployee.leaveBalance.vacation} <span className="text-sm font-bold text-emerald-400">วัน</span></span>
                  </div>
                  <div className="bg-gradient-to-b from-purple-50 to-white p-5 rounded-2xl text-center border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="block text-sm text-purple-600 mb-2 font-bold bg-purple-100/50 py-1 rounded-lg">ลาคลอด</span>
                    <span className="block text-3xl font-extrabold text-purple-900">{selectedEmployee.leaveBalance.maternity} <span className="text-sm font-bold text-purple-400">วัน</span></span>
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap gap-3 justify-end mt-10 pt-6 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all border-none cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5" onClick={handleSave}>บันทึกข้อมูล</button>
                    <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all border border-gray-200 cursor-pointer shadow-sm" onClick={handleCancel}>ยกเลิก</button>
                  </>
                ) : (
                  <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all border-none cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2" onClick={handleEdit}>แก้ไขข้อมูลพนักงาน</button>
                )}
                <button className="px-6 py-3 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl font-bold transition-all border border-rose-200 hover:border-rose-500 cursor-pointer shadow-sm ml-auto sm:ml-0" onClick={() => handleDeleteEmployee(selectedEmployee.id)}>ลบพนักงาน</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6 transition-all duration-200" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-20 bg-transparent border-none text-2xl cursor-pointer" onClick={() => setShowAddModal(false)}><X size={24}/></button>
            
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-8 text-white relative flex-shrink-0">
              <h2 className="text-2xl font-extrabold m-0 z-10 relative flex items-center gap-3"><UserPlus size={28}/> เพิ่มพนักงานใหม่</h2>
              <p className="text-indigo-100 mt-2 font-medium">กรอกข้อมูลพนักงานเพื่อเข้าสู่ระบบ</p>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">ชื่อ:</label>
                  <input 
                    type="text" 
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">นามสกุล:</label>
                  <input 
                    type="text" 
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">รหัสพนักงาน:</label>
                  <input 
                    type="text" 
                    value={newEmployee.empCode}
                    onChange={(e) => setNewEmployee({...newEmployee, empCode: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">ตำแหน่ง:</label>
                  <input 
                    type="text" 
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">แผนก:</label>
                  <input 
                    type="text" 
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">เบอร์โทรศัพท์:</label>
                  <input 
                    type="text" 
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">อีเมล:</label>
                  <input 
                    type="email" 
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">หัวหน้า:</label>
                  <input 
                    type="text" 
                    value={newEmployee.supervisor}
                    onChange={(e) => setNewEmployee({...newEmployee, supervisor: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">วันเริ่มงาน:</label>
                  <input 
                    type="date" 
                    value={newEmployee.startDate}
                    onChange={(e) => setNewEmployee({...newEmployee, startDate: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm w-full md:w-1/2"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-8 border-t border-gray-200">
                <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all border-none cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5" onClick={handleAddEmployee}>บันทึกข้อมูล</button>
                <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all border border-gray-200 cursor-pointer shadow-sm" onClick={() => setShowAddModal(false)}>ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personalsummary;