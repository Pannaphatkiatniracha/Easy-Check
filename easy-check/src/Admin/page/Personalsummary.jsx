import React, { useState } from 'react';
import { User, Star, Phone, Mail, Calendar, Briefcase, Edit, X, Search, Filter, ChevronDown, Clock, UserCheck, Plus, Trash2, Check } from 'lucide-react';
// import './Personalsummary.css'
import '../page/Personalsummary.css'
const Personalsummary = () => {
  const [employees, setEmployees] = useState([
    {
      id: 'EMP001',
      name: 'สมชาย ใจดี',
      position: 'Senior Developer',
      department: 'Development',
      manager: 'นภา สุขใจ',
      rating: 5,
      workYears: 3.5,
      phone: '089-123-4567',
      email: 'somchai@company.com',
      startDate: '2021-05-15',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 19,
        late: 3,
        absent: 0,
        workHours: 198
      },
      leave: {
        personal: 3,
        sick: 5,
        vacation: 10,
        maternity: 0
      }
    },
    {
      id: 'EMP002',
      name: 'สมหญิง รักงาน',
      position: 'Frontend Developer',
      department: 'Development',
      manager: 'นภา สุขใจ',
      rating: 4,
      workYears: 2.0,
      phone: '089-234-5678',
      email: 'somying@company.com',
      startDate: '2022-11-01',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 21,
        late: 1,
        absent: 0,
        workHours: 200
      },
      leave: {
        personal: 3,
        sick: 2,
        vacation: 8,
        maternity: 98
      }
    },
    {
      id: 'EMP003',
      name: 'ธนา มานะ',
      position: 'Backend Developer',
      department: 'Development',
      manager: 'นภา สุขใจ',
      rating: 4,
      workYears: 2.5,
      phone: '089-345-6789',
      email: 'thana@company.com',
      startDate: '2022-05-20',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 20,
        late: 2,
        absent: 0,
        workHours: 199
      },
      leave: {
        personal: 1,
        sick: 8,
        vacation: 9,
        maternity: 0
      }
    },
    {
      id: 'EMP004',
      name: 'วิภา ชำนาญ',
      position: 'UI/UX Designer',
      department: 'Design',
      manager: 'นภา สุขใจ',
      rating: 5,
      workYears: 4.0,
      phone: '089-456-7890',
      email: 'wipa@company.com',
      startDate: '2020-08-10',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 22,
        late: 0,
        absent: 0,
        workHours: 198
      },
      leave: {
        personal: 3,
        sick: 1,
        vacation: 12,
        maternity: 98
      }
    },
    {
      id: 'EMP005',
      name: 'ประยุทธ์ ขยัน',
      position: 'DevOps Engineer',
      department: 'Infrastructure',
      manager: 'นภา สุขใจ',
      rating: 4,
      workYears: 3.0,
      phone: '089-567-8901',
      email: 'prayut@company.com',
      startDate: '2021-09-15',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 19,
        late: 2,
        absent: 1,
        workHours: 189
      },
      leave: {
        personal: 0,
        sick: 4,
        vacation: 7,
        maternity: 0
      }
    },
    {
      id: 'EMP006',
      name: 'นภา สุขใจ',
      position: 'Project Manager',
      department: 'Management',
      manager: 'มาลี สวย',
      rating: 5,
      workYears: 5.0,
      phone: '089-678-9012',
      email: 'napa@company.com',
      startDate: '2019-11-01',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 22,
        late: 0,
        absent: 0,
        workHours: 198
      },
      leave: {
        personal: 3,
        sick: 0,
        vacation: 15,
        maternity: 0
      }
    },
    {
      id: 'EMP007',
      name: 'ธีรพงษ์ เก่ง',
      position: 'QA Engineer',
      department: 'Quality Assurance',
      manager: 'นภา สุขใจ',
      rating: 3,
      workYears: 1.5,
      phone: '089-789-0123',
      email: 'teeraphong@company.com',
      startDate: '2023-05-10',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 17,
        late: 4,
        absent: 1,
        workHours: 189
      },
      leave: {
        personal: 2,
        sick: 10,
        vacation: 6,
        maternity: 0
      }
    },
    {
      id: 'EMP008',
      name: 'ปิยะ ดี',
      position: 'Data Analyst',
      department: 'Analytics',
      manager: 'นภา สุขใจ',
      rating: 4,
      workYears: 2.2,
      phone: '089-890-1234',
      email: 'piya@company.com',
      startDate: '2022-09-01',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 20,
        late: 2,
        absent: 0,
        workHours: 198
      },
      leave: {
        personal: 3,
        sick: 3,
        vacation: 8,
        maternity: 0
      }
    },
    {
      id: 'EMP009',
      name: 'อรุณ แจ่มใส',
      position: 'System Administrator',
      department: 'Infrastructure',
      manager: 'นภา สุขใจ',
      rating: 4,
      workYears: 3.8,
      phone: '089-901-2345',
      email: 'arun@company.com',
      startDate: '2021-02-15',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 19,
        late: 3,
        absent: 0,
        workHours: 198
      },
      leave: {
        personal: 2,
        sick: 1,
        vacation: 11,
        maternity: 0
      }
    },
    {
      id: 'EMP010',
      name: 'มาลี สวย',
      position: 'HR Manager',
      department: 'Human Resources',
      manager: 'CEO',
      rating: 5,
      workYears: 6.0,
      phone: '089-012-3456',
      email: 'malee@company.com',
      startDate: '2018-11-20',
      status: 'Active',
      workStats: {
        workDays: 22,
        onTime: 21,
        late: 1,
        absent: 0,
        workHours: 198
      },
      leave: {
        personal: 3,
        sick: 2,
        vacation: 18,
        maternity: 0
      }
    }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: '',
    position: '',
    department: 'Development',
    manager: '',
    phone: '',
    email: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const departments = ['ทั้งหมด', 'Development', 'Design', 'Infrastructure', 'Management', 'Quality Assurance', 'Analytics', 'Human Resources'];
  const departmentsForForm = ['Development', 'Design', 'Infrastructure', 'Management', 'Quality Assurance', 'Analytics', 'Human Resources'];

  const getInitial = (name) => {
    const parts = name.split(' ');
    return parts[0].charAt(0).toUpperCase();
  };

  const getInitialColor = (name) => {
    const colors = ['#3C467B', '#50589C', '#636CCB', '#6E8CFB', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };



  const calculateAttendancePercentage = (workStats) => {
    const total = workStats.workDays;
    if (total === 0) return { onTime: 0, late: 0, absent: 0 };
    return {
      onTime: Math.round((workStats.onTime / total) * 100),
      late: Math.round((workStats.late / total) * 100),
      absent: Math.round((workStats.absent / total) * 100)
    };
  };

  const generateEmployeeId = () => {
    const maxId = employees.reduce((max, emp) => {
      const num = parseInt(emp.id.replace('EMP', ''));
      return num > max ? num : max;
    }, 0);
    return `EMP${String(maxId + 1).padStart(3, '0')}`;
  };

  const handleEditClick = () => {
    setEditForm({
      name: selectedEmployee.name,
      position: selectedEmployee.position,
      department: selectedEmployee.department,
      manager: selectedEmployee.manager,
      phone: selectedEmployee.phone,
      email: selectedEmployee.email,
      startDate: selectedEmployee.startDate
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id 
        ? { 
            ...emp, 
            ...editForm,
            workYears: calculateWorkYears(editForm.startDate)
          } 
        : emp
    );
    setEmployees(updatedEmployees);
    setSelectedEmployee({ ...selectedEmployee, ...editForm, workYears: calculateWorkYears(editForm.startDate) });
    setIsEditing(false);
    setEditForm(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const calculateWorkYears = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.round(years * 10) / 10;
  };

  const handleAddEmployee = () => {
    const newEmployee = {
      id: generateEmployeeId(),
      ...newEmployeeForm,
      rating: null,
      workYears: calculateWorkYears(newEmployeeForm.startDate),
      status: 'Active',
      workStats: {
        workDays: 0,
        onTime: 0,
        late: 0,
        absent: 0,
        workHours: 0
      },
      leave: {
        personal: 0,
        sick: 0,
        vacation: 0,
        maternity: 0
      }
    };
    
    setEmployees([...employees, newEmployee]);
    setShowAddModal(false);
    setNewEmployeeForm({
      name: '',
      position: '',
      department: 'Development',
      manager: '',
      phone: '',
      email: '',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSelectEmployee = (empId) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredAndSortedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredAndSortedEmployees.map(emp => emp.id));
    }
  };

  const handleDeleteSelected = () => {
    setEmployees(employees.filter(emp => !selectedEmployees.includes(emp.id)));
    setSelectedEmployees([]);
    setShowDeleteConfirm(false);
  };

  const handleDeleteSingle = () => {
    setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    setSelectedEmployee(null);
    setShowDeleteConfirm(false);
  };

  const filteredAndSortedEmployees = employees
    .filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDepartment = filterDepartment === 'ทั้งหมด' || emp.department === filterDepartment;
      return matchSearch && matchDepartment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'th');
        case 'id':
          return a.id.localeCompare(b.id);
        case 'rating':
          if (a.rating === null) return 1;
          if (b.rating === null) return -1;
          return b.rating - a.rating;
        case 'workYears':
          return b.workYears - a.workYears;
        case 'late':
          return b.workStats.late - a.workStats.late;
        default:
          return 0;
      }
    });

  return (
    <div className="employee-system">
      

      <div className="header">
        <div className="header-top">
          <h1>ระบบสรุปข้อมูลรายบุคคล</h1>
          <div className="header-actions">
            <button className="add-employee-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              เพิ่มพนักงาน
            </button>
            {selectedEmployees.length > 0 && (
              <button 
                className="delete-selected-btn" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={20} />
                ลบที่เลือก ({selectedEmployees.length})
              </button>
            )}
          </div>
        </div>
        <div className="header-info">
          <span>พนักงานทั้งหมด: {employees.length} คน</span>
          <span>กำลังแสดง: {filteredAndSortedEmployees.length} คน</span>
        </div>
      </div>

      <div className="controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, รหัสพนักงาน, ตำแหน่ง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={20} />
          ตัวกรองและเรียงลำดับ
          <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <div className="filter-group">
            <label>แผนก/ฝ่าย</label>
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>เรียงลำดับตาม</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">ชื่อ (A-Z)</option>
              <option value="id">รหัสพนักงาน</option>
              <option value="workYears">อายุงาน (มาก-น้อย)</option>
              <option value="late">มาสาย (มาก-น้อย)</option>
              </select>
          </div>
        </div>
            
      )}

      <div className="select-all-container">
        <input 
          type="checkbox" 
          id="selectAll"
          checked={selectedEmployees.length === filteredAndSortedEmployees.length && filteredAndSortedEmployees.length > 0}
          onChange={handleSelectAll}
        />
        <label htmlFor="selectAll">เลือกทั้งหมด</label>
      </div>

      {filteredAndSortedEmployees.length === 0 ? (
        <div className="empty-state">
          <User size={64} />
          <h3>ไม่พบข้อมูลพนักงาน</h3>
          <p>ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง</p>
        </div>
      ) : (
        <div className="employee-grid">
          {filteredAndSortedEmployees.map(employee => {
            const initial = getInitial(employee.name);
            const bgColor = getInitialColor(employee.name);
            return (
              <div key={employee.id} className="employee-card">
                <input 
                  type="checkbox" 
                  className="employee-card-checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectEmployee(employee.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div onClick={() => setSelectedEmployee(employee)}>
                  <div className="card-header">
                    <div className="profile-initial" style={{ backgroundColor: bgColor }}>
                      {initial}
                    </div>
                  </div>
                  <div className="card-body">
                    <h3>{employee.name}</h3>
                    <div className="info-row">
                      <span className="label">รหัส:</span>
                      <span className="value">{employee.id}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">แผนก:</span>
                      <span className="value">{employee.department}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">ตำแหน่ง:</span>
                      <span className="value">{employee.position}</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="view-details-btn">ดูรายละเอียด</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedEmployee && (
        <div className="modal-overlay" onClick={() => {
          setSelectedEmployee(null);
          setIsEditing(false);
          setEditForm(null);
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => {
              setSelectedEmployee(null);
              setIsEditing(false);
              setEditForm(null);
            }}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <div className="modal-profile-initial" style={{ backgroundColor: getInitialColor(selectedEmployee.name) }}>
                {getInitial(selectedEmployee.name)}
              </div>
              <div className="modal-header-info">
                <h2>{selectedEmployee.name}</h2>
                <p className="modal-position">{selectedEmployee.position}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <h3>ข้อมูลทั่วไป</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <Briefcase size={18} />
                    <div>
                      <span className="info-label">รหัสพนักงาน</span>
                      <span className="info-value">{selectedEmployee.id}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Briefcase size={18} />
                    <div>
                      <span className="info-label">ชื่อ-นามสกุล</span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="info-input"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                      ) : (
                        <span className="info-value">{selectedEmployee.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <Briefcase size={18} />
                    <div>
                      <span className="info-label">ตำแหน่ง</span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="info-input"
                          value={editForm.position}
                          onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                        />
                      ) : (
                        <span className="info-value">{selectedEmployee.position}</span>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <Briefcase size={18} />
                    <div>
                      <span className="info-label">แผนก/ฝ่าย</span>
                      {isEditing ? (
                        <select
                          className="info-select"
                          value={editForm.department}
                          onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                        >
                          {departmentsForForm.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="info-value">{selectedEmployee.department}</span>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <UserCheck size={18} />
                    <div>
                      <span className="info-label">หัวหน้าแผนก</span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="info-input"
                          value={editForm.manager}
                          onChange={(e) => setEditForm({...editForm, manager: e.target.value})}
                        />
                      ) : (
                        <span className="info-value">{selectedEmployee.manager}</span>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <Calendar size={18} />
                    <div>
                      <span className="info-label">อายุงาน</span>
                      <span className="info-value">{selectedEmployee.workYears} ปี</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Calendar size={18} />
                    <div>
                      <span className="info-label">วันที่เริ่มงาน</span>
                      {isEditing ? (
                        <input
                          type="date"
                          className="info-input"
                          value={editForm.startDate}
                          onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                        />
                      ) : (
                        <span className="info-value">{new Date(selectedEmployee.startDate).toLocaleDateString('th-TH')}</span>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <Phone size={18} />
                    <div>
                      <span className="info-label">เบอร์โทร</span>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="info-input"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                      ) : (
                        <span className="info-value">{selectedEmployee.phone}</span>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <Mail size={18} />
                    <div>
                      <span className="info-label">อีเมล</span>
                      {isEditing ? (
                        <input
                          type="email"
                          className="info-input"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                      ) : (
                        <span className="info-value">{selectedEmployee.email}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>สถิติการทำงานเดือนนี้</h3>
                
                <div className="stats-container">
                  <div className="stat-box work-days">
                    <div className="stat-icon">
                      <Calendar size={20} color="#3b82f6" />
                    </div>
                    <div className="stat-number">{selectedEmployee.workStats.workDays}</div>
                    <div className="stat-label">วันที่ทำงาน</div>
                  </div>
                  <div className="stat-box on-time">
                    <div className="stat-icon">
                      <Clock size={20} color="#10b981" />
                    </div>
                    <div className="stat-number">{selectedEmployee.workStats.onTime}</div>
                    <div className="stat-label">ตรงเวลา</div>
                  </div>
                  <div className="stat-box late">
                    <div className="stat-icon">
                      <Clock size={20} color="#f59e0b" />
                    </div>
                    <div className="stat-number">{selectedEmployee.workStats.late}</div>
                    <div className="stat-label">มาสาย</div>
                  </div>
                  <div className="stat-box absent">
                    <div className="stat-icon">
                      <X size={20} color="#ef4444" />
                    </div>
                    <div className="stat-number">{selectedEmployee.workStats.absent}</div>
                    <div className="stat-label">ขาดงาน</div>
                  </div>
                  <div className="stat-box work-hours">
                    <div className="stat-icon">
                      <Clock size={20} color="#8b5cf6" />
                    </div>
                    <div className="stat-number">{selectedEmployee.workStats.workHours}</div>
                    <div className="stat-label">ชั่วโมงทำงาน</div>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>วันลาคงเหลือ (วัน)</h3>
                <div className="leave-info">
                  <div className="leave-item">
                    <div className="leave-number">{selectedEmployee.leave.personal}</div>
                    <div className="leave-label">ลากิจ</div>
                  </div>
                  <div className="leave-item">
                    <div className="leave-number">{selectedEmployee.leave.sick}</div>
                    <div className="leave-label">ลาป่วย</div>
                  </div>
                  <div className="leave-item">
                    <div className="leave-number">{selectedEmployee.leave.vacation}</div>
                    <div className="leave-label">ลาพักร้อน</div>
                  </div>
                  <div className="leave-item">
                    <div className="leave-number">{selectedEmployee.leave.maternity}</div>
                    <div className="leave-label">ลาคลอด</div>
                  </div>
                </div>
              </div>
              

              <div className="info-section">
                <h3>สัดส่วนการเข้างาน</h3>
                <div className="attendance-chart">
                  <div className="chart-bars">
                    <div className="chart-row">
                      <div className="chart-label">ตรงเวลา</div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar on-time" 
                          style={{ width: `${calculateAttendancePercentage(selectedEmployee.workStats).onTime}%` }}
                        >
                          {calculateAttendancePercentage(selectedEmployee.workStats).onTime}%
                        </div>
                      </div>
                    </div>
                    <div className="chart-row">
                      <div className="chart-label">มาสาย</div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar late" 
                          style={{ width: `${calculateAttendancePercentage(selectedEmployee.workStats).late}%` }}
                        >
                          {calculateAttendancePercentage(selectedEmployee.workStats).late}%
                        </div>
                      </div>
                    </div>
                    <div className="chart-row">
                      <div className="chart-label">ขาดงาน</div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar absent" 
                          style={{ width: `${calculateAttendancePercentage(selectedEmployee.workStats).absent}%` }}
                        >
                          {calculateAttendancePercentage(selectedEmployee.workStats).absent}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                {isEditing ? (
                  <>
                    <button className="save-btn" onClick={handleSaveEdit}>
                      <Check size={18} />
                      บันทึกการแก้ไข
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      ยกเลิก
                    </button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={handleEditClick}>
                      <Edit size={18} />
                      แก้ไขข้อมูล
                    </button>
                    <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                      ลบพนักงาน
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <h2>เพิ่มพนักงานใหม่</h2>
            
            <div className="form-group">
              <label>ชื่อ-นามสกุล *</label>
              <input
                type="text"
                value={newEmployeeForm.name}
                onChange={(e) => setNewEmployeeForm({...newEmployeeForm, name: e.target.value})}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>

            <div className="form-group">
              <label>ตำแหน่ง *</label>
              <input
                type="text"
                value={newEmployeeForm.position}
                onChange={(e) => setNewEmployeeForm({...newEmployeeForm, position: e.target.value})}
                placeholder="กรอกตำแหน่งงาน"
              />
            </div>

            <div className="form-group">
              <label>แผนก/ฝ่าย *</label>
              <select
                value={newEmployeeForm.department}
                onChange={(e) => setNewEmployeeForm({...newEmployeeForm, department: e.target.value})}
              >
                {departmentsForForm.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>หัวหน้าแผนก *</label>
              <input
                type="text"
                value={newEmployeeForm.manager}
                onChange={(e) => setNewEmployeeForm({...newEmployeeForm, manager: e.target.value})}
                placeholder="กรอกชื่อหัวหน้าแผนก"
              />
            </div>

            <div className="form-group">
              <label>เบอร์โทร *</label>
              <input
                type="tel"
                value={newEmployeeForm.phone}
                onChange={(e) => setNewEmployeeForm({...newEmployeeForm, phone: e.target.value})}
                placeholder="0XX-XXX-XXXX"
              />
            </div>

            <div className="form-group">
              <label>อีเมล *</label>
              <input
                type="email"
                value={newEmployeeForm.email}
                onChange={(e) => setNewEmployeeForm({...newEmployeeForm, email: e.target.value})}
                placeholder="example@company.com"
              />
            </div>

            <div className="form-group">
              <label>วันที่เริ่มงาน *</label>
              <input
                type="date"
                value={newEmployeeForm.startDate}
                onChange={(e) => setNewEmployeeForm({...newEmployeeForm, startDate: e.target.value})}
              />
            </div>

            <div className="form-actions">
              <button 
                className="submit-btn" 
                onClick={handleAddEmployee}
                disabled={!newEmployeeForm.name || !newEmployeeForm.position || !newEmployeeForm.manager || !newEmployeeForm.phone || !newEmployeeForm.email}
              >
                เพิ่มพนักงาน
              </button>
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <Trash2 size={64} />
            <h3>ยืนยันการลบ</h3>
            <p>
              {selectedEmployee 
                ? `คุณต้องการลบพนักงาน "${selectedEmployee.name}" ใช่หรือไม่?`
                : `คุณต้องการลบพนักงาน ${selectedEmployees.length} คน ใช่หรือไม่?`
              }
              <br />
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="confirm-actions">
              <button 
                className="confirm-delete-btn" 
                onClick={selectedEmployee ? handleDeleteSingle : handleDeleteSelected}
              >
                ยืนยันการลบ
              </button>
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personalsummary;