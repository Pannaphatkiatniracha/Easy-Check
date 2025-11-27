import React, { useState } from 'react';
import { User, Lock, Briefcase, Camera, UserRound } from 'lucide-react';
import './MyProfile.css'

function MyProfile () {
  const [adminData, setAdminData] = useState({
    // ข้อมูลส่วนตัว
    fullName: "แอ้ว  น่ารัก",
    email: "somchai.admin@company.com",
    phone: "081-234-5678",
    // ข้อมูลเบื้องต้น
    username: "admin_somchai",
    password: "password1234",
    // ข้อมูลการทำงาน
    branch: "สำนักงานใหญ่",
    department: "Technology",
    position: "System Admin",
    // รูปโปรไฟล์
    avatarUrl: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saving Admin Profile:", adminData);
    alert("บันทึกข้อมูลเรียบร้อย!");
  };

  return (
    <div className="admin-profile-container">
      {/* Gradient Header */}
      <div className="gradient-header-bg"></div>

      {/* Profile Avatar & Main Info */}
      <div className="profile-main-info">
        <div className="profile-avatar-wrapper">
          {adminData.avatarUrl ? (
            <img src={adminData.avatarUrl} alt="Profile" />
          ) : (
            <User size={80} strokeWidth={1} color='#81808086'/>
          )}
          <label htmlFor="avatar-upload" className="avatar-upload-label" title="เปลี่ยนรูปโปรไฟล์">
            <Camera />
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
        <div className="profile-text-info">
          <h2>{adminData.fullName}</h2>
          <p>{adminData.position} | {adminData.department}</p>
        </div>
      </div>

      {/* Form Sections */}
      <div className="profile-form-section">
        
        {/* Section 1: ข้อมูลส่วนตัว */}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Section 2: ข้อมูลเบื้องต้น */}
        <h3 className="form-section-title">
          <Lock /> ข้อมูลเบื้องต้น (สำหรับเข้าสู่ระบบ)
        </h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={adminData.username}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={adminData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Section 3: ข้อมูลการทำงาน */}
        <h3 className="form-section-title">
          <Briefcase /> ข้อมูลการทำงาน
        </h3>
        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="branch">สาขา</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={adminData.branch}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        </div>
    </div>
  );
    
}

export default MyProfile;