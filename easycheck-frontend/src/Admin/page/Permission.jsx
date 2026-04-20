import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Api from '../../Api';
import styles from './Permission.module.css';

const permissionNameMap = {
  'view_dashboard': 'dashboard',
  'view_attendance_report': 'viewAllStatistics',
  'view_employee': 'viewEmployeeDetails',
  'create_employee': 'addNewEmployee',
  'edit_employee': 'editEmployeeInformation',
  'delete_employee': 'deleteEmployee',
  'view_time_logs': 'timeLog',
  'approve_time_logs': 'approveChanges',
  'edit_time_logs': 'editClockTime',
  'export_data': 'exportData',
  'manage_gps': 'systemLog'
};

const defaultPermissions = {
  dashboard: false,
  viewAllStatistics: false,
  viewEmployeeDetails: false,
  addNewEmployee: false,
  editEmployeeInformation: false,
  deleteEmployee: false,
  timeLog: false,
  approveChanges: false,
  editClockTime: false,
  exportData: false,
  systemLog: false
};



const Permission = () => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); }
      catch { setUser({}); }
    } else {
      setUser({});
    }
  }, []);

const fetchPermissions = async (showLoading = false) => {
  try {
    if (showLoading) setIsLoading(true);

    const res = await Api.get("/api/permissions");

    const names = res.data.permissions; // ← ดึง array จาก key "permissions"

    const updated = { ...defaultPermissions };
    names.forEach(name => {
      const key = permissionNameMap[name];
      if (key) updated[key] = true;
    });

    setPermissions(updated);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchPermissions(true);
    const interval = setInterval(() => fetchPermissions(false), 3000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user || isLoading) {
    return (
      <div className={styles.layout}>
        <div className={styles.content}>
          <div className={styles.skeleton} />
          <div className={styles.skeletonGrid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonTitle} />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className={styles.skeletonItem} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderItem = (key, label) => (
    <div className={`${styles.item} ${permissions[key] ? styles.active : styles.inactive}`}>
      <span className={styles.itemIcon}>
        {permissions[key] ? '✓' : '✕'}
      </span>
      <span className={styles.itemLabel}>{label}</span>
      <span className={`${styles.status} ${permissions[key] ? styles.statusActive : styles.statusInactive}`}>
        {permissions[key] ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.header}>
            <h1>Permission</h1>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}></span>
              Dashboard and Report
            </h2>
            <div className={styles.items}>
              {renderItem('dashboard', 'Dashboard')}
              {renderItem('viewAllStatistics', 'View All Statistics')}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}></span>
              Work Time Management
            </h2>
            <div className={styles.items}>
              {renderItem('timeLog', 'Time Log')}
              {renderItem('approveChanges', 'Approve Changes')}
              {renderItem('editClockTime', 'Edit Clock-In/Clock-Out Time')}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}></span>
              Employees
            </h2>
            <div className={styles.items}>
              {renderItem('viewEmployeeDetails', 'View Employee Details')}
              {renderItem('editEmployeeInformation', 'Edit Employee Information')}
              {renderItem('addNewEmployee', 'Add New Employee')}
              {renderItem('deleteEmployee', 'Delete Employee')}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}></span>
              System Settings
            </h2>
            <div className={styles.items}>
              {renderItem('exportData', 'Export Data')}
              {renderItem('systemLog', 'System Log')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;