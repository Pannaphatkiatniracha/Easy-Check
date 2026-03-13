import React, { useState } from 'react';
import './Personalsummary.css';

const Personalsummary = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      empCode: 'EMP001',
      position: 'Frontend Developer',
      department: 'Development',
      phone: '081-234-5678',
      email: 'somchai@company.com',
      supervisor: 'คุณสมหมาย',
      startDate: '2022-01-15',
      attendanceRate: 95,
      workStats: {
        present: 20,
        late: 1,
        absent: 0
      },
      leaveBalance: {
        personal: 5,
        sick: 25,
        vacation: 8,
        maternity: 0
      },
      avatarColor: '#50589C'
    },
    {
      id: 2,
      firstName: 'สมหญิง',
      lastName: 'รักที',
      empCode: 'EMP002',
      position: 'UI/UX Designer',
      department: 'Design',
      phone: '082-345-6789',
      email: 'somying@company.com',
      supervisor: 'คุณสมศรี',
      startDate: '2021-06-20',
      attendanceRate: 98,
      workStats: {
        present: 21,
        late: 0,
        absent: 0
      },
      leaveBalance: {
        personal: 6,
        sick: 28,
        vacation: 10,
        maternity: 90
      },
      avatarColor: '#636CCB'
    },
    {
      id: 3,
      firstName: 'สมพงษ์',
      lastName: 'มั่งคั่ง',
      empCode: 'EMP003',
      position: 'Backend Developer',
      department: 'Development',
      phone: '083-456-7890',
      email: 'sompong@company.com',
      supervisor: 'คุณสมหมาย',
      startDate: '2020-03-10',
      attendanceRate: 92,
      workStats: {
        present: 19,
        late: 2,
        absent: 0
      },
      leaveBalance: {
        personal: 4,
        sick: 22,
        vacation: 6,
        maternity: 0
      },
      avatarColor: '#6E8CFB'
    }
  ]);

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
    <div className="app-conadd">
      <header className="header">
        <h1>ระบบสรุปข้อมูลรายบุคคล</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + เพิ่มพนักงาน
        </button>
      </header>

      <div className="filters-container">
        <input
          type="text"
          placeholder="ค้นหาตามชื่อหรือรหัสพนักงาน..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="">ทุกแผนก</option>
          {allDepartments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
        </select>
        <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}>
          <option value="">ทุกตำแหน่ง</option>
          {allPositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>
      </div>

      <div className="employee-grid">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="employee-card">
            <div className="card-header">
              <div className="avatar" style={{ backgroundColor: employee.avatarColor }}>
                {getInitials(employee.firstName, employee.lastName)}
              </div>
              <div className="status-dot"></div>
            </div>
            
            <div className="card-body">
              <h2>{employee.firstName} {employee.lastName}</h2>
              <p className="emp-code">รหัส: {employee.empCode}</p>
              <p className="position">{employee.position}</p>
              <p className="department">{employee.department}</p>
            </div>

            <div className="card-footer">
              <button className="detail-btn" onClick={() => openDetails(employee)}>
                ดูรายละเอียด
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedEmployee && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            
            <div className="modal-header-Personalsummary">
              <div className="avatar-large-Personalsummary" style={{ backgroundColor: selectedEmployee.avatarColor }}>
                {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
              </div>
              <h2>{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
              <p className="emp-code">{selectedEmployee.empCode}</p>
            </div>

            <div className="modal-body">
              <section className="info-section">
                <h3>ข้อมูลทั่วไป</h3>
                <div className="info-row">
                  <span className="label">เบอร์โทรศัพท์:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  ) : (
                    <span>{selectedEmployee.phone}</span>
                  )}
                </div>
                <div className="info-row">
                  <span className="label">อีเมล:</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : (
                    <span>{selectedEmployee.email}</span>
                  )}
                </div>
                <div className="info-row">
                  <span className="label">ตำแหน่ง:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.position}
                      onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                    />
                  ) : (
                    <span>{selectedEmployee.position}</span>
                  )}
                </div>
                <div className="info-row">
                  <span className="label">แผนก:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.department}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                    />
                  ) : (
                    <span>{selectedEmployee.department}</span>
                  )}
                </div>
                <div className="info-row">
                  <span className="label">หัวหน้า:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.supervisor}
                      onChange={(e) => setEditData({ ...editData, supervisor: e.target.value })}
                    />
                  ) : (
                    <span>{selectedEmployee.supervisor}</span>
                  )}
                </div>
              </section>

              <section className="info-section">
                <h3>ข้อมูลการทำงาน</h3>
                <div className="info-row">
                  <span className="label">วันเริ่มงาน:</span>
                  <span>{new Date(selectedEmployee.startDate).toLocaleDateString('th-TH')}</span>
                </div>
                <div className="info-row">
                  <span className="label">อายุงาน:</span>
                  <span>{calculateWorkDuration(selectedEmployee.startDate)}</span>
                </div>
                <div className="info-row">
                  <span className="label">สถิติการทำงานเดือนนี้:</span>
                  <div className="work-stats">
                    <>
                      <span>มา: {selectedEmployee.workStats.present} วัน</span>
                      <span>สาย: {selectedEmployee.workStats.late} วัน</span>
                      <span>ขาด: {selectedEmployee.workStats.absent} วัน</span>
                    </>
                  </div>
                </div>
              </section>

              <section className="info-section">
                <h3>สัดส่วนการเข้างาน</h3>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${selectedEmployee.attendanceRate}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{selectedEmployee.attendanceRate}%</span>
                </div>
              </section>

              <section className="info-section">
                <h3>วันลาคงเหลือ</h3>
                <div className="leave-grid">
                  <div className="leave-item">
                    <span className="leave-label">ลากิจ</span>
                    <span className="leave-value">{selectedEmployee.leaveBalance.personal} วัน</span>
                  </div>
                  <div className="leave-item">
                    <span className="leave-label">ลาป่วย</span>
                    <span className="leave-value">{selectedEmployee.leaveBalance.sick} วัน</span>
                  </div>
                  <div className="leave-item">
                    <span className="leave-label">ลาพักร้อน</span>
                    <span className="leave-value">{selectedEmployee.leaveBalance.vacation} วัน</span>
                  </div>
                  <div className="leave-item">
                    <span className="leave-label">ลาคลอด</span>
                    <span className="leave-value">{selectedEmployee.leaveBalance.maternity} วัน</span>
                  </div>
                </div>
              </section>

              <div className="modal-actions-Personalsummary">
                {isEditing ? (
                  <>
                    <button className="save-Personalsummary-btn" onClick={handleSave}>บันทึก</button>
                    <button className="cancel-btn" onClick={handleCancel}>ยกเลิก</button>
                  </>
                ) : (
                  <button className="edit-btn" onClick={handleEdit}>แก้ไขข้อมูล</button>
                )}
                <button className="delete-btn" onClick={() => handleDeleteEmployee(selectedEmployee.id)}>ลบ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            
            <div className="modal-header-Personalsummary">
              <h2>เพิ่มพนักงานใหม่</h2>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>ชื่อ:</label>
                  <input 
                    type="text" 
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>นามสกุล:</label>
                  <input 
                    type="text" 
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>รหัสพนักงาน:</label>
                  <input 
                    type="text" 
                    value={newEmployee.empCode}
                    onChange={(e) => setNewEmployee({...newEmployee, empCode: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>ตำแหน่ง:</label>
                  <input 
                    type="text" 
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>แผนก:</label>
                  <input 
                    type="text" 
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>เบอร์โทรศัพท์:</label>
                  <input 
                    type="text" 
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>อีเมล:</label>
                  <input 
                    type="email" 
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>หัวหน้า:</label>
                  <input 
                    type="text" 
                    value={newEmployee.supervisor}
                    onChange={(e) => setNewEmployee({...newEmployee, supervisor: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>วันเริ่มงาน:</label>
                  <input 
                    type="date" 
                    value={newEmployee.startDate}
                    onChange={(e) => setNewEmployee({...newEmployee, startDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions-Personalsummary">
                <button className="save-Personalsummary-btn" onClick={handleAddEmployee}>เพิ่มพนักงาน</button>
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personalsummary;