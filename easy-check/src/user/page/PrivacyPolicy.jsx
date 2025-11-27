import React from "react";
import { Link } from "react-router-dom"; // ใช้สำหรับลิงก์ย้อนกลับ
import "bootstrap-icons/font/bootstrap-icons.css"; // ใส่ถ้ายังไม่ได้ใส่

function PrivacyPolicy() {
  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F] flex flex-col items-center py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header: icon + title */}
        <div className="flex items-center mb-6">
          <Link to="/setting" className="text-white text-2xl mr-4">
            <i className="bi bi-chevron-left"></i>
          </Link>
          <h1 className="text-[32px] font-bold text-white flex-1 text-center">
            Privacy Policy
          </h1>
          <div className="w-6" /> {/* เว้นขอบขวาเท่ากับ icon */}
        </div>

        {/* กล่องเนื้อหา */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-lg overflow-y-auto space-y-6 leading-relaxed">
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
    </div>
  );
}

export default PrivacyPolicy;
