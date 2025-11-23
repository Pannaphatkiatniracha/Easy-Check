import React, { useState } from 'react';
import './Manageusers.css' 

// คอมโพเนนต์สำหรับไอคอนรูปคน (ใช้เมื่อยังไม่มีรูปโปรไฟล์)
const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="person-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.5 1.5 0 0 1 18 21.75H6A1.5 1.5 0 0 1 4.501 20.118Z" />
  </svg>
);

// คอมโพเนนต์หลักของแอป
function App() {
  // State สำหรับเก็บ URL ของรูปโปรไฟล์ (สำหรับ Preview)
  const [profileImage, setProfileImage] = useState(null);
  
  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    branch: '',
    department: '',
    position: '',
  });

  // ฟังก์ชันเมื่อมีการเลือกไฟล์รูป
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // ยกเลิก URL เก่าถ้ามี เพื่อป้องกัน Memory Leak
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
      
      // สร้าง URL ชั่วคราวสำหรับแสดงรูปภาพ
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      // ในแอปจริง คุณอาจจะต้องอัปโหลดไฟล์นี้ไปยัง Server
    }
  };

  // ฟังก์ชันเมื่อมีการเปลี่ยนแปลงข้อมูลใน Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ฟังก์ชันเมื่อกดปุ่มบันทึก
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ข้อมูลที่บันทึก:", formData);
    if (profileImage) {
      console.log("มีการอัปเดตรูปโปรไฟล์");
    }
    
    // **NOTE: ห้ามใช้ alert() ใน Canvas/Immersive Environment**
    // ใช้วิธีแสดงข้อความใน Console หรือ Modal แทน
    console.log("บันทึกข้อมูลสำเร็จ! (ฟังก์ชัน API ควรทำงานที่นี่)");
    
    // สามารถเพิ่ม logic สำหรับแสดงสถานะการบันทึกสำเร็จบนหน้าจอได้ที่นี่
  };

  return (
    <div className="page-container">
      
      
      <div className="profile-card">
        {/* ส่วนด้านซ้าย: รูปโปรไฟล์และปุ่ม */}
        <div className="left-pane">
          <div className="profile-pic-container">
            {profileImage ? (
              <img src={profileImage} alt="Profile Preview" />
            ) : (
              <PersonIcon />
            )}
          </div>
          
          {/* Input แบบ file ที่ซ่อนไว้ แต่ทำงานผ่าน label */}
          <input 
            type="file" 
            id="fileUpload" 
            className="file-upload-input" 
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="fileUpload" className="file-upload-label">
            เปลี่ยนรูปโปรไฟล์
          </label>

          <button className="save-button" onClick={handleSubmit}>
            บันทึก
          </button>
        </div>
            
        {/* ส่วนด้านขวา: ฟอร์มข้อมูล */}
        <div className="right-pane">
          <form onSubmit={handleSubmit}>
            
            {/* ข้อมูลส่วนตัว */}
            <div className="form-section">
              <h2>ข้อมูลส่วนตัว</h2>
              <div className="input-group">
                <label htmlFor="fullName">ชื่อ-นามสกุล</label>
                <input type="text" id="fullName" name="fullName" className="input-field" value={formData.fullName} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label htmlFor="email">อีเมล</label>
                <input type="email" id="email" name="email" className="input-field" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input type="tel" id="phone" name="phone" className="input-field" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>

            {/* ข้อมูลเบื้องต้น */}
            <div className="form-section">
              <h2>ข้อมูลเบื้องต้น</h2>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" className="input-field" value={formData.username} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" className="input-field" placeholder="กรอกเพื่อเปลี่ยนรหัสผ่าน" onChange={handleInputChange} />
              </div>
            </div>

            {/* ข้อมูลการทำงาน */}
            <div className="form-section">
              <h2>ข้อมูลการทำงาน</h2>
              <div className="input-group">
                <label htmlFor="branch">สาขา</label>
                <input type="text" id="branch" name="branch" className="input-field" value={formData.branch} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label htmlFor="department">แผนก</label>
                <input type="text" id="department" name="department" className="input-field" value={formData.department} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label htmlFor="position">ตำแหน่ง</label>
                <input type="text" id="position" name="position" className="input-field" value={formData.position} onChange={handleInputChange} />
              </div>
            </div>

            {/* ตารางงาน (Work Schedule) - ตามที่ระบุในหัวข้อ */}
          
            {/* NOTE: ลบปุ่มบันทึกออกจาก form เพราะมีปุ่มใน left-pane อยู่แล้วและเราใช้ onClick */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;