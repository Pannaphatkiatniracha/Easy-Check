import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './group2-noti.module.css';

const GroupNoti2 = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  // โหลดข้อมูลผู้ใช้จาก localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser({});
      }
    } else {
      setUser({});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/adminlogin');
  };


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
    navigate('/groupnoti');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-layout">

      {/* Main Content - Group Notification Detail Page */}
      <div className="main-content">

        <div className={styles.container}>
          {/* Header with Back Button */}
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={handleBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1>แผนก A</h1>
          </div>

          <div className={styles.contentWrapper}>
            {/* Select Dropdown */}
            <div className={styles.selectWrapper}>
              <select className={styles.employeeSelect}>
                <option>Select</option>
                <option>ทั้งหมด</option>
                <option>เลือกแล้ว</option>
              </select>
            </div>

            {/* Employee Grid (2 columns) */}
            <div className={styles.employeeGrid}>
              {employees.map((employee) => (
                <div 
                  key={employee.id} 
                  className={`${styles.employeeItem} ${selectedEmployees.includes(employee.id) ? styles.selected : ''}`}
                >
                  <input
                    type="checkbox"
                    className={styles.employeeCheckbox}
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleToggleEmployee(employee.id)}
                  />
                  <div className={styles.employeeAvatar}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <span className={styles.employeeName}>{employee.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupNoti2;