import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Permission.module.css';

const Permission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({
    dashboard: true,
    viewAllStatistics: true,
    exportReport: true,
    viewEmployeeDetails: true,
    editEmployeeInformation: true,
    addNewEmployee: true,
    deleteEmployee: true,
    timeLog: true,
    approveChanges: true,
    editClockTime: true,
    exportData: true,
    systemLog: true
  });

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
    navigate('/login');
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.layout}>
      {/* MAIN CONTENT */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Permission</h1>
        </div>

        <div className={styles.grid}>
          {/* Dashboard and Report Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dashboard and Report</h2>
            <div className={styles.items}>
              <div className={styles.item} onClick={() => togglePermission('dashboard')}>
                <div className={`${styles.checkbox} ${permissions.dashboard ? styles.checked : ''}`}>
                  {permissions.dashboard && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Dashboard</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('viewAllStatistics')}>
                <div className={`${styles.checkbox} ${permissions.viewAllStatistics ? styles.checked : ''}`}>
                  {permissions.viewAllStatistics && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>View All Statistics</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('exportReport')}>
                <div className={`${styles.checkbox} ${permissions.exportReport ? styles.checked : ''}`}>
                  {permissions.exportReport && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Export Report</span>
              </div>
            </div>
          </div>

          {/* Work Time Management Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Work Time Management</h2>
            <div className={styles.items}>
              <div className={styles.item} onClick={() => togglePermission('timeLog')}>
                <div className={`${styles.checkbox} ${permissions.timeLog ? styles.checked : ''}`}>
                  {permissions.timeLog && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Time Log</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('approveChanges')}>
                <div className={`${styles.checkbox} ${permissions.approveChanges ? styles.checked : ''}`}>
                  {permissions.approveChanges && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Approve Changes</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('editClockTime')}>
                <div className={`${styles.checkbox} ${permissions.editClockTime ? styles.checked : ''}`}>
                  {permissions.editClockTime && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Edit Clock-In/Clock-Out Time</span>
              </div>
            </div>
          </div>

          {/* Employees Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Employees</h2>
            <div className={styles.items}>
              <div className={styles.item} onClick={() => togglePermission('viewEmployeeDetails')}>
                <div className={`${styles.checkbox} ${permissions.viewEmployeeDetails ? styles.checked : ''}`}>
                  {permissions.viewEmployeeDetails && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>View Employee Details</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('editEmployeeInformation')}>
                <div className={`${styles.checkbox} ${permissions.editEmployeeInformation ? styles.checked : ''}`}>
                  {permissions.editEmployeeInformation && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Edit Employee Information</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('addNewEmployee')}>
                <div className={`${styles.checkbox} ${permissions.addNewEmployee ? styles.checked : ''}`}>
                  {permissions.addNewEmployee && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Add New Employee</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('deleteEmployee')}>
                <div className={`${styles.checkbox} ${permissions.deleteEmployee ? styles.checked : ''}`}>
                  {permissions.deleteEmployee && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Delete Employee</span>
              </div>
            </div>
          </div>

          {/* System Settings Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>System Settings</h2>
            <div className={styles.items}>
              <div className={styles.item} onClick={() => togglePermission('exportData')}>
                <div className={`${styles.checkbox} ${permissions.exportData ? styles.checked : ''}`}>
                  {permissions.exportData && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>Export Data</span>
              </div>

              <div className={styles.item} onClick={() => togglePermission('systemLog')}>
                <div className={`${styles.checkbox} ${permissions.systemLog ? styles.checked : ''}`}>
                  {permissions.systemLog && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span>System Log</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;