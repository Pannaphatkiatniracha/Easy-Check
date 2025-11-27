let mockUsers = [
  {
    id: '222222',
    username: 'admin1',
    password: 'pass',
    fullName: 'สมชาย ใจดี',
    role: 'admin',
    email: 'somchai.admin@company.com',
    phone: '081-234-5678',
    profileImage: 'https://cdn.prod.website-files.com/6600e1eab90de089c2d9c9cd/662c092880a6d18c31995e13_66236537d4f46682e079b6ce_Casual%2520Portrait.webp',
    department: 'IT Department',
    position: 'System Administrator',
    joinDate: '2023-01-15',
    employeeCode: 'EMP001' // รหัสพนักงาน
  },
  {
    id: '333333',
    username: 'admin2',
    password: 'pass',
    fullName: 'สมหญิง รักงาน',
    role: 'admin',
    email: 'somying.admin@company.com',
    phone: '082-345-6789',
    profileImage: 'https://cdn.prod.website-files.com/6600e1eab90de089c2d9c9cd/662c092880a6d18c31995dfd_66236531e8288ee0657ae7a7_Business%2520Professional.webp',
    department: 'HR Department',
    position: 'HR Administrator',
    joinDate: '2023-03-20',
    employeeCode: 'EMP002' // รหัสพนักงาน
  },
  {
    id: '444444',
    username: 'superadmin',
    password: 'pass',
    fullName: 'วิชัย ผู้จัดการ',
    role: 'superadmin',
    email: 'wichai.super@company.com',
    phone: '083-456-7890',
    profileImage: 'https://s.magicaitool.com/flux-ai/baby/baby.png',
    department: 'Management',
    position: 'Chief Administrator',
    joinDate: '2022-11-01',
    employeeCode: 'EMP003' // รหัสพนักงาน
  }
];

// ฟังก์ชันสำหรับตรวจสอบการ Login
export const authenticateUser = (id, password) => {
  const user = mockUsers.find(
    u => u.id === id && u.password === password
  );
  
  if (user) {
    // ส่งข้อมูลผู้ใช้กลับไป (ไม่รวม password)
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
      token: `mock-token-${user.id}-${Date.now()}` // สร้าง token สมมติ
    };
  }
  
  return {
    success: false,
    message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  };
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับแสดงในหน้า Manage Users)
export const getAllUsers = () => {
  return mockUsers.map(({ password, ...user }) => user);
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก ID
export const getUserById = (id) => {
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// ฟังก์ชันสำหรับตรวจสอบรหัสพนักงานและอีเมล (ขั้นตอนที่ 1)
export const verifyEmployeeIdentity = (employeeCode, email) => {
  const user = mockUsers.find(
    u => u.employeeCode === employeeCode && u.email === email
  );
  
  if (user) {
    // สร้าง OTP 6 หลัก (ในระบบจริงจะส่งทางอีเมล)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 OTP ส่งไปที่ ${email}: ${otp}`); // แสดงใน Console เพื่อทดสอบ
    
    return {
      success: true,
      otp: otp, // ในระบบจริงจะไม่ส่งกลับมา แต่เก็บไว้ที่ server
      email: email,
      employeeCode: employeeCode,
      message: `ส่งรหัส OTP ไปยัง ${email} เรียบร้อยแล้ว`
    };
  }
  
  return {
    success: false,
    message: 'ไม่พบข้อมูลพนักงาน กรุณาตรวจสอบรหัสพนักงานและอีเมลอีกครั้ง'
  };
};

// ฟังก์ชันสำหรับตรวจสอบ OTP (ขั้นตอนที่ 2)
export const verifyOTP = (employeeCode, otp, correctOTP) => {
  if (otp === correctOTP) {
    return {
      success: true,
      message: 'ยืนยัน OTP สำเร็จ'
    };
  }
  
  return {
    success: false,
    message: 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
  };
};

// ฟังก์ชันสำหรับตั้งรหัสผ่านใหม่ (ขั้นตอนที่ 3)
export const resetPassword = (employeeCode, newPassword) => {
  const userIndex = mockUsers.findIndex(u => u.employeeCode === employeeCode);
  
  if (userIndex !== -1) {
    mockUsers[userIndex].password = newPassword;
    return {
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่'
    };
  }
  
  return {
    success: false,
    message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  };
};

export default mockUsers;