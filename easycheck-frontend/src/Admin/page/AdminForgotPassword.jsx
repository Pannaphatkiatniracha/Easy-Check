import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../../Api';
import './AdminForgotPassword.css';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=กรอกข้อมูล, 2=กรอก OTP, 3=ตั้งรหัสใหม่
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // ข้อมูลที่เก็บระหว่างขั้นตอน
  const [employeeCode, setEmployeeCode] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  };

  // ขั้นตอนที่ 1: ตรวจสอบรหัสพนักงานและอีเมล
  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!employeeCode || !email) {
      showError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setLoading(false);
      return;
    }

    try {
      const response = await Api.post('/admin/forgot-password/verify-identity', {
        employeeCode,
        email
      });

      if (response.data.success) {
        showSuccess(response.data.message);
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 1500);
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการส่ง OTP';
      showError(message);
    }

    setLoading(false);
  };

  // ขั้นตอนที่ 2: ตรวจสอบ OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!otp) {
      showError('กรุณากรอกรหัส OTP');
      setLoading(false);
      return;
    }

    try {
      const response = await Api.post('/admin/forgot-password/verify-otp', {
        employeeCode,
        email,
        otp
      });

      if (response.data.success) {
        showSuccess(response.data.message);
        setTimeout(() => {
          setStep(3);
          setSuccess('');
        }, 1500);
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการตรวจสอบ OTP';
      showError(message);
    }

    setLoading(false);
  };

  // ขั้นตอนที่ 3: ตั้งรหัสผ่านใหม่
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      showError('กรุณากรอกรหัสผ่านให้ครบถ้วน');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      showError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('รหัสผ่านไม่ตรงกัน กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
      return;
    }

    try {
      const response = await Api.post('/admin/forgot-password/reset-password', {
        employeeCode,
        email,
        newPassword
      });

      if (response.data.success) {
        showSuccess(response.data.message);
        setTimeout(() => {
          navigate('/adminlogin');
        }, 2000);
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน';
      showError(message);
    }

    setLoading(false);
  };

  return (
    <div className="admin-forgot-password-page">
      <div className="admin-forgot-password-container">
        <div className="admin-forgot-password-box">
          {/* Header */}
          <div className="admin-forgot-password-header">
            <button className="back-button" onClick={() => navigate('/adminlogin')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              กลับไปหน้าเข้าสู่ระบบ
            </button>
            
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>รีเซ็ทรหัสผ่าน</h2>
            <p>
              {step === 1 && 'กรุณากรอกข้อมูลเพื่อยืนยันตัวตน'}
              {step === 2 && 'กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมลของคุณ'}
              {step === 3 && 'กรุณาตั้งรหัสผ่านใหม่'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">ยืนยันตัวตน</div>
            </div>
            <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">กรอก OTP</div>
            </div>
            <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">รหัสผ่านใหม่</div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="message error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="message success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              {success}
            </div>
          )}

          {/* Step 1: ยืนยันตัวตน */}
          {step === 1 && (
            <form onSubmit={handleVerifyIdentity} className="admin-forgot-password-form">
              <div className="form-group">
                <label>รหัสพนักงาน</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="กรอกรหัสพนักงาน (เช่น EMP001)"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>อีเมลบริษัท</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    type="email"
                    placeholder="กรอกอีเมลบริษัท"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  'ส่งรหัส OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 2: กรอก OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="admin-forgot-password-form">
              <div className="otp-info">
                <p>ส่งรหัส OTP ไปที่ <strong>{email}</strong> แล้ว</p>
                <p className="otp-note">
                  กด Resend เพื่อส่งอีกครั้ง
                </p>
              </div>

              <div className="form-group">
                <label>รหัส OTP (6 หลัก)</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="กรอกรหัส OTP 6 หลัก"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={loading}
                    maxLength={6}
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  'ยืนยัน OTP'
                )}
              </button>

              <button
                type="button"
                className="resend-button"
                onClick={() => handleVerifyIdentity({ preventDefault: () => {} })}
                disabled={loading}
              >
                ส่งรหัส OTP อีกครั้ง
              </button>
            </form>
          )}

          {/* Step 3: ตั้งรหัสผ่านใหม่ */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="admin-forgot-password-form">
              <div className="form-group">
                <label>รหัสผ่านใหม่</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
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

              <div className="form-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึกรหัสผ่านใหม่'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;