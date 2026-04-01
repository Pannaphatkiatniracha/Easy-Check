import db from './models/index.cjs';

async function test() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ การเชื่อมต่อ Database สำเร็จแล้ว!');

    // ลองดึงข้อมูล User คนแรกออกมาดู
    const user = await db.User.findOne(); 
    if (user) {
      console.log('✨ ข้อมูลพนักงานคนแรก:', user.full_name);
    } else {
      console.log('⚠️ เชื่อมติดนะ แต่ในตาราง users ยังไม่มีข้อมูลค่ะ');
    }
  } catch (error) {
    console.error('❌ พังสนิท! Error คือ:', error);
  } finally {
    process.exit();
  }
}

test();