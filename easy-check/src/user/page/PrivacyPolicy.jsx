import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#3C467B] flex flex-col items-center px-4 py-6 text-black">
      {/* Header */}
      <div className="w-full max-w-md flex items-center text-white mb-4">
        <button onClick={() => navigate(-1)} className="text-2xl font-bold mr-3">
          ←
        </button>
        <h1 className="text-xl font-bold text-center flex-1">Privacy Policy</h1>
      </div>

      {/* Content Box */}
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg text-sm leading-relaxed space-y-4 overflow-y-auto">
        <section>
          <h2 className="font-bold mb-1">บทนำ</h2>
          <p>
            เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
            นโยบายนี้อธิบายถึงข้อมูลที่เรารวบรวม วิธีการใช้งาน
            และเหตุผลที่เราต้องการข้อมูลสำหรับให้บริการระบบเช็กอิน–เช็กเอาท์
            (Easy Check) ได้อย่างมีประสิทธิภาพ
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-1">ข้อมูลที่เรารวบรวม</h2>
          <p>
            เพื่อให้คุณสามารถใช้งานแอปพลิเคชันนี้ได้
            เราเก็บข้อมูลบางประเภทดังต่อไปนี้:
          </p>
          <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
            <li>ข้อมูลส่วนตัว เช่น ชื่อ-นามสกุล, รหัสพนักงาน</li>
            <li>
              ข้อมูลตำแหน่ง (GPS) เพื่อบันทึกตำแหน่งขณะเช็กอินหรือเช็กเอาท์
            </li>
            <li>ข้อมูลเวลาทำงาน เช่น เวลาทำงาน ประวัติการลา และข้อมูลการทำงานล่วงเวลา (OT)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold mb-1">เราใช้ข้อมูลของคุณอย่างไร</h2>
          <p>ข้อมูลของคุณจะถูกใช้เพื่อวัตถุประสงค์ในการบริหารจัดการเวลาทำงานขององค์กร เช่น:</p>
          <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
            <li>ยืนยันตัวตนและบันทึกเวลาทำงานของคุณ</li>
            <li>ตรวจสอบเวลาการเข้า–ออกงาน</li>
            <li>ใช้ในฝ่ายทรัพยากรบุคคล (HR)</li>
            <li>เพื่อการวิเคราะห์และการทำสถิติด้านเวลา</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold mb-1">การเปิดเผยข้อมูล</h2>
          <p>
            ข้อมูลของคุณจะถูกจัดเก็บภายในระบบ
            และจะไม่ถูกเปิดเผยต่อบุคคลภายนอก
            เว้นแต่จะได้รับความยินยอมจากคุณโดยชัดเจน
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-1">การรักษาความปลอดภัยของข้อมูล</h2>
          <p>
            เรามีมาตรการรักษาความปลอดภัยทางเทคนิค
            เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต
          </p>
        </section>

        <section>
          <h2 className="font-bold mb-1">ติดต่อเรา</h2>
          <p>
            หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
            กรุณาติดต่อฝ่ายบุคคลหรือผู้ดูแลระบบ
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
