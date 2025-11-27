import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../data/mockUsers';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // ฟังก์ชันช่วยแสดง error และลบอัตโนมัติหลัง 5 วินาที
  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ตรวจสอบว่ากรอกครบไหม
    if (!formData.id || !formData.password) {
      showError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setLoading(false);
      return;
    }

    try {
      // จำลองการตรวจสอบข้อมูล (เหมือนรอโหลด)
      setTimeout(() => {
        // เรียกใช้ฟังก์ชัน authenticateUser จาก mock
        const result = authenticateUser(formData.id, formData.password);

        if (result.success) {
          // บันทึก token และข้อมูลผู้ใช้
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));

          // Navigate to dashboard
          navigate('/dashboard');
        } else {
          showError(result.message);
        }

        setLoading(false);
      }, 800);
    } catch (err) {
      showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminLoginPage}>
      <div className={styles.adminLoginContainer}>
        <div className={styles.adminLoginBox}>
          {/* Profile Image */}
          <div className={styles.profileCircle}>
            <div className={styles.profilePlaceholder}>
              <img
                src="https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Profile"
                className={styles.profileImage}
              />
            </div>
          </div>

          {/* Login Form */}
          <form className={styles.adminLoginForm} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  id="id"
                  name="id"
                  placeholder="Employee ID"
                  value={formData.id}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.forgotPasswordLink}>
              <a href="#forgot" onClick={(e) => {
                e.preventDefault();
                navigate('/adminforgotpassword');
              }}>Forgot Password?</a>
            </div>

            <button type="submit" className={styles.adminLoginButton} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;