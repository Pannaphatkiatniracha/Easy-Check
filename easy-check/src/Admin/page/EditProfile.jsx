import React, { useState, useEffect } from 'react';
import { User, Lock, Briefcase, UserRound, Save, Camera } from 'lucide-react';
import './EditProfile.css';

function EditProfile() {
  const [adminData, setAdminData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    department: "",
    position: "",
    employeeCode: "",
    joinDate: "",
    role: "",
    avatarUrl: null
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // โหลดข้อมูลจาก localStorage เมื่อ component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAdminData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          username: user.username || "",
          department: user.department || "",
          position: user.position || "",
          employeeCode: user.employeeCode || "",
          joinDate: user.joinDate || "",
          role: user.role || "",
          avatarUrl: user.profileImage || null
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ฟังก์ชันจัดการการอัพโหลดรูปภาพ
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData(prev => ({
          ...prev,
          avatarUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSaveProfile = () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      // สร้างออบเจ็กต์ข้อมูลที่จะบันทึก
      const updatedUser = {
        fullName: adminData.fullName,
        email: adminData.email,
        phone: adminData.phone,
        username: adminData.username,
        department: adminData.department,
        position: adminData.position,
        employeeCode: adminData.employeeCode,
        joinDate: adminData.joinDate,
        role: adminData.role,
        profileImage: adminData.avatarUrl
      };

      // บันทึกลง localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // แสดงข้อความสำเร็จ
      setSaveMessage("บันทึกข้อมูลสำเร็จ!");
      
      // ซ่อนข้อความหลัง 3 วินาที
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);

    } catch (error) {
      console.error('Error saving user data:', error);
      setSaveMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-profile-container">
      <div className="gradient-header-bg"></div>

      <div className="profile-main-info">
        <div className="profile-avatar-wrapper">
          {adminData.avatarUrl ? (
            <img src={adminData.avatarUrl} alt="Profile" />
          ) : (
            <User size={80} strokeWidth={1} color='#81808086'/>
          )}
          <label htmlFor="avatar-upload" className="avatar-upload-label">
            <Camera size={18} />
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div className="profile-text-info">
          <h2>{adminData.fullName || "ไม่พบข้อมูล"}</h2>
          <p>{adminData.position} {adminData.department && `| ${adminData.department}`}</p>
        </div>
      </div>

      <div className="profile-form-section">
        
        {/* ข้อมูลส่วนตัว */}
        <h3 className="form-section-title">
          <UserRound /> ข้อมูลส่วนตัว
        </h3>
        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="fullName">ชื่อ-นามสกุล</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={adminData.fullName}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              name="email"
              value={adminData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={adminData.phone}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        {/* ข้อมูลบัญชี */}
        <h3 className="form-section-title">
          <Lock /> ข้อมูลบัญชี
        </h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={adminData.username}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">สิทธิ์การใช้งาน</label>
            <select
              id="role"
              name="role"
              value={adminData.role}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="superadmin">ผู้ดูแลระบบสูงสุด</option>
              <option value="user">ผู้ใช้งานทั่วไป</option>
            </select>
          </div>
        </div>

        {/* ข้อมูลการทำงาน */}
        <h3 className="form-section-title">
          <Briefcase /> ข้อมูลการทำงาน
        </h3>
        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="employeeCode">รหัสพนักงาน</label>
            <input
              type="text"
              id="employeeCode"
              name="employeeCode"
              value={adminData.employeeCode}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">แผนก</label>
            <input
              type="text"
              id="department"
              name="department"
              value={adminData.department}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">ตำแหน่ง</label>
            <input
              type="text"
              id="position"
              name="position"
              value={adminData.position}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="joinDate">วันที่เริ่มงาน</label>
            <input
              type="date"
              id="joinDate"
              name="joinDate"
              value={adminData.joinDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <div className="save-btn-container">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="save-profile-btn"
          >
            <Save size={20} />
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>

        {/* ข้อความแจ้งเตือน */}
        {saveMessage && (
          <div className={`save-message ${saveMessage.includes('สำเร็จ') ? 'success' : 'error'}`}>
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfile;