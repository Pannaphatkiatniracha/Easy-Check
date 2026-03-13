import React, { useState } from 'react';

// คอมโพเนนต์สำหรับไอคอนรูปคน (ใช้เมื่อยังไม่มีรูปโปรไฟล์)
const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.5 1.5 0 0 1 18 21.75H6A1.5 1.5 0 0 1 4.501 20.118Z" />
  </svg>
);

// คอมโพเนนต์หลักของแอป
function Manageusers() {
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 px-4 font-['Sarabun'] text-gray-800">
      
      
      <div className="max-w-[1000px] w-[170%] bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-[300px,1fr] mx-2.5">
        {/* ส่วนด้านซ้าย: รูปโปรไฟล์และปุ่ม */}
        <div className="bg-gray-50 p-10 flex flex-col items-center border-r border-gray-200">
          <div className="w-44 h-44 rounded-full bg-gray-200 mb-6 overflow-hidden flex justify-center items-center border-4 border-white shadow-md">
            {profileImage ? (
              <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <PersonIcon />
            )}
          </div>
          
          {/* Input แบบ file ที่ซ่อนไว้ แต่ทำงานผ่าน label */}
          <input 
            type="file" 
            id="fileUpload" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="fileUpload" className="text-indigo-600 font-medium mb-6 text-sm cursor-pointer hover:text-indigo-800 transition-colors">
            เปลี่ยนรูปโปรไฟล์
          </label>

          <button className="w-full max-w-[200px] py-3 bg-indigo-500 text-white border-none rounded-lg text-base font-['Sarabun'] font-semibold cursor-pointer hover:bg-indigo-600 transition-colors" onClick={handleSubmit}>
            บันทึก
          </button>
        </div>
            
        {/* ส่วนด้านขวา: ฟอร์มข้อมูล */}
        <div className="p-10 overflow-y-auto rounded-lg">
          <form onSubmit={handleSubmit}>
            
            {/* ข้อมูลส่วนตัว */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-6 mt-0">ข้อมูลส่วนตัว</h2>
              <div className="mb-4">
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-500">ชื่อ-นามสกุล</label>
                <input type="text" id="fullName" name="fullName" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={formData.fullName} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-500">อีเมล</label>
                <input type="email" id="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-500">เบอร์โทรศัพท์</label>
                <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>

            {/* ข้อมูลเบื้องต้น */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-6">ข้อมูลเบื้องต้น</h2>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-500">Username</label>
                <input type="text" id="username" name="username" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={formData.username} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-500">Password</label>
                <input type="password" id="password" name="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="กรอกเพื่อเปลี่ยนรหัสผ่าน" onChange={handleInputChange} />
              </div>
            </div>

            {/* ข้อมูลการทำงาน */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-6">ข้อมูลการทำงาน</h2>
              <div className="mb-4">
                <label htmlFor="branch" className="block mb-2 text-sm font-medium text-gray-500">สาขา</label>
                <input type="text" id="branch" name="branch" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={formData.branch} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-500">แผนก</label>
                <input type="text" id="department" name="department" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={formData.department} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="position" className="block mb-2 text-sm font-medium text-gray-500">ตำแหน่ง</label>
                <input type="text" id="position" name="position" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-['Sarabun'] transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={formData.position} onChange={handleInputChange} />
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

export default Manageusers;