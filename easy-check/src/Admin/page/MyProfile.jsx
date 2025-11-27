import React, { useState, useEffect } from 'react';
import { User, Lock, Briefcase, UserRound } from 'lucide-react';
import './MyProfile.css'

function MyProfile () {
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
        </div>
        <div className="profile-text-info">
          <h2>{adminData.fullName || "ไม่พบข้อมูล"}</h2>
          <p>{adminData.position} {adminData.department && `| ${adminData.department}`}</p>
        </div>
      </div>

    
      <div className="profile-form-section">
        
     
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
              className="form-input"
              disabled
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              name="email"
              value={adminData.email}
              className="form-input"
              disabled
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={adminData.phone}
              className="form-input"
              disabled
              readOnly
            />
          </div>
        </div>

     
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
              className="form-input"
              disabled
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">สิทธิ์การใช้งาน</label>
            <input
              type="text"
              id="role"
              name="role"
              value={adminData.role === 'admin' ? 'ผู้ดูแลระบบ' : adminData.role === 'superadmin' ? 'ผู้ดูแลระบบสูงสุด' : adminData.role}
              className="form-input"
              disabled
              readOnly
            />
          </div>
        </div>


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
              className="form-input"
              disabled
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">แผนก</label>
            <input
              type="text"
              id="department"
              name="department"
              value={adminData.department}
              className="form-input"
              disabled
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">ตำแหน่ง</label>
            <input
              type="text"
              id="position"
              name="position"
              value={adminData.position}
              className="form-input"
              disabled
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="joinDate">วันที่เริ่มงาน</label>
            <input
              type="text"
              id="joinDate"
              name="joinDate"
              value={adminData.joinDate}
              className="form-input"
              disabled
              readOnly
            />
          </div>
        </div>

    
        

      </div>
    </div>
  );
    
}

export default MyProfile;