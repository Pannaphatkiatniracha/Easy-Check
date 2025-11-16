import React from "react";
import { Link } from "react-router-dom"; // ใช้สำหรับลิงก์ย้อนกลับ
import "bootstrap-icons/font/bootstrap-icons.css"; // ใส่ถ้ายังไม่ได้ใส่

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#3C467B] flex flex-col items-center px-4 py-8 text-black font-[Inter]">
      {/* ปุ่มย้อนกลับ */}
      <div className="w-full max-w-md flex justify-start mb-4">
        <Link to="/setting" className="text-white text-2xl">
          <i className="bi bi-chevron-left"></i>
        </Link>
      </div>

      {/* หัวข้อหลัก */}
      <h1 className="text-[32px] font-bold text-white mb-6 text-center">
  Privacy Policy
</h1>


      {/* กล่องเนื้อหา */}
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg overflow-y-auto space-y-6 leading-relaxed">
        {/* บทนำ */}
        <section>
          <h2 className="text-[20px] font-semibold mb-2">บทนำ</h2>
          <p className="text-[16px] font-normal text-gray-800">
            เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
            นโยบายนี้อธิบายถึงข้อมูลที่เรารวบรวม วิธีการใช้งาน
            และเหตุผลที่เราต้องการข้อมูล เพื่อให้บริการระบบเช็กอิน–เช็กเอาท์
            (Easy Check) ได้อย่างมีประสิทธิภาพและปลอดภัย
          </p>
        </section>

        {/* ข้อมูลที่เรารวบรวม */}
        <section>
          <h2 className="text-[20px] font-semibold mb-2">ข้อมูลที่เรารวบรวม</h2>
          <p className="text-[16px] font-normal text-gray-800 mb-2">
            เพื่อให้คุณสามารถใช้งานแอปพลิเคชันนี้ได้
            เราเก็บรวบรวมข้อมูลดังต่อไปนี้:
          </p>
          <ul className="list-disc list-inside text-[16px] font-normal text-gray-800 space-y-1 ml-2">
            <li>ข้อมูลส่วนตัว เช่น ชื่อ-นามสกุล และรหัสพนักงาน</li>
            <li>
              ข้อมูลตำแหน่ง (GPS) เพื่อบันทึกตำแหน่งขณะเช็กอินหรือเช็กเอาท์
            </li>
            <li>
              ข้อมูลเวลาทำงาน เช่น เวลาเข้า-ออกงาน ประวัติการลา
              และข้อมูลการทำงานล่วงเวลา (OT)
            </li>
          </ul>
        </section>

        {/* เราใช้ข้อมูลของคุณอย่างไร */}
        <section>
          <h2 className="text-[20px] font-semibold mb-2">
            เราใช้ข้อมูลของคุณอย่างไร
          </h2>
          <p className="text-[16px] font-normal text-gray-800 mb-2">
            ข้อมูลของคุณจะถูกนำไปใช้เพื่อวัตถุประสงค์ในการบริหารจัดการเวลาทำงานขององค์กร
            เช่น:
          </p>
          <ul className="list-disc list-inside text-[16px] font-normal text-gray-800 space-y-1 ml-2">
            <li>ยืนยันตัวตนและบันทึกเวลาทำงานของคุณ</li>
            <li>ตรวจสอบเวลาการเข้า–ออกงานของพนักงาน</li>
            <li>ใช้เพื่อการจัดการในฝ่ายทรัพยากรบุคคล (HR)</li>
            <li>เพื่อการวิเคราะห์และการทำสถิติด้านเวลาทำงาน</li>
          </ul>
        </section>

        {/* การเปิดเผยข้อมูล */}
        <section>
          <h2 className="text-[20px] font-semibold mb-2">การเปิดเผยข้อมูล</h2>
          <p className="text-[16px] font-normal text-gray-800">
            ข้อมูลของคุณจะถูกจัดเก็บและใช้งานภายในระบบเท่านั้น
            และจะไม่ถูกเปิดเผยต่อบุคคลภายนอก
            เว้นแต่จะได้รับความยินยอมจากคุณโดยชัดเจน
          </p>
        </section>

        {/* การรักษาความปลอดภัยของข้อมูล */}
        <section>
          <h2 className="text-[20px] font-semibold mb-2">
            การรักษาความปลอดภัยของข้อมูล
          </h2>
          <p className="text-[16px] font-normal text-gray-800">
            เรามีมาตรการด้านความปลอดภัยทางเทคนิคและการจัดการ
            เพื่อป้องกันไม่ให้บุคคลภายนอกเข้าถึงหรือใช้ข้อมูลของคุณโดยไม่ได้รับอนุญาต
          </p>
        </section>

        {/* ติดต่อเรา */}
        <section>
          <h2 className="text-[20px] font-semibold mb-2">ติดต่อเรา</h2>
          <p className="text-[16px] font-normal text-gray-800">
            หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
            กรุณาติดต่อฝ่ายบุคคลหรือผู้ดูแลระบบขององค์กร
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
