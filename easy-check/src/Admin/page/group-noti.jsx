import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './group-noti.module.css';

const GroupNoti = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [message, setMessage] = useState('');

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


  const departments = [
    { id: 1, name: 'แผนก A' },
    { id: 2, name: 'แผนก B' },
    { id: 3, name: 'แผนก C' },
    { id: 4, name: 'แผนก D' },
    { id: 5, name: 'แผนก E' }
  ];

  const handleToggleDepartment = (id) => {
    if (selectedDepartments.includes(id)) {
      setSelectedDepartments(selectedDepartments.filter(deptId => deptId !== id));
    } else {
      setSelectedDepartments([...selectedDepartments, id]);
    }
  };

  const handleViewDetails = (departmentId) => {
    navigate(`/groupnoti2/${departmentId}`);
  };

  const handleSend = () => {
    if (selectedDepartments.length === 0) {
      alert('กรุณาเลือกแผนกที่ต้องการส่งการแจ้งเตือน');
      return;
    }
    if (!message.trim()) {
      alert('กรุณากรอกข้อความ');
      return;
    }
    alert(`ส่งการแจ้งเตือนไปยัง ${selectedDepartments.length} แผนกเรียบร้อยแล้ว`);
    setMessage('');
    setSelectedDepartments([]);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-layout">
{/* Main Content - Notification Page */}
<div className="main-content">
  <div className={styles.container}>
    <div className={styles.contentWrapper}>
      {/* ย้าย Header เข้าไปในกรอบ contentWrapper */}
      <div className={styles.header}>
        <h1>Notification</h1>
      </div>

      <div className={styles.selectWrapper}>
        <select className={styles.departmentSelect}>
          <option>Select</option>
          <option>ทั้งหมด</option>
          <option>เลือกแล้ว</option>
        </select>
      </div>

      <div className={styles.departmentList}>
        {departments.map((dept) => (
          <div 
            key={dept.id} 
            className={`${styles.departmentItem} ${selectedDepartments.includes(dept.id) ? styles.selected : ''}`}
          >
            <input
              type="checkbox"
              className={styles.departmentCheckbox}
              checked={selectedDepartments.includes(dept.id)}
              onChange={() => handleToggleDepartment(dept.id)}
            />
            <span className={styles.departmentName}>{dept.name}</span>
            <button 
              className={styles.detailsBtn}
              onClick={() => handleViewDetails(dept.id)}
            >
              Details
            </button>
          </div>
        ))}
      </div>

      <div className={styles.messageBox}>
        <textarea
          className={styles.messageInput}
          placeholder="พิมพ์ข้อความที่นี่..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
      </div>

      <div className={styles.sendSection}>
        <button className={styles.sendBtn} onClick={handleSend}>
          Sent
        </button>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default GroupNoti;