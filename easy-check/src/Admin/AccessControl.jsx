import React, { useEffect, useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { fetchApi } from '../data/Api'
import Dropdown from 'react-bootstrap/Dropdown'

export default function AccessControl() {
  const [apiRows, setApiRows] = useState([])

  useEffect(() => {
    const rows = fetchApi()
    setApiRows(rows)
  }, [])

  const counts = apiRows.reduce((acc, r) => {
    const level = r.Level || 'Unknown'
    acc[level] = (acc[level] || 0) + 1
    return acc
  }, {})

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, #3C467B, #6E80E1)',
        minHeight: '100vh',
        paddingBottom: '60px'
      }}
    >
      {/* header */}
      <div className="position-relative py-4">
        <i
          className="bi bi-chevron-left position-absolute"
          style={{
            color: '#FFFF',
            fontSize: '30px',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer'
          }}
        ></i>
        <h1 className="fw-bold text-center m-4" style={{ color: '#FFFF' }}>
          Access Control System
        </h1>
      </div>

      {/* content box */}
      <div
        className="mx-auto mt-5"
        style={{
          width: '500px',
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: 12,
          marginBottom: 30
        }}
      >
        {/* Control 1 */}
        <div style={{ padding: '20px', borderRadius: 12, marginBottom: 40 }}>

          <h3 className="mb-4" style={{ color: '#0A0043' }}>จัดการสิทธิ์การเข้าถึง</h3>
          <hr className="mb-4" style={{ border: '1px solid #0A0043' }} />

          {[
            { label: 'Admin', key: 'Admin' },
            { label: 'Executive Level', key: 'Executive Level' },
            { label: 'Management Level', key: 'Management Level' },
            { label: 'Staff Level', key: 'Staff Level' }
          ].map(({ label, key }) => (

            <Card key={key} style={{ border: '5px solid #0A0043', borderRadius: 12 }} className="mb-3">

              <Card.Body className="d-flex justify-content-between align-items-center">
                <div style={{ fontWeight: 600 }}>{label}</div>
                <div style={{
                  minWidth: 40,
                  textAlign: 'right',
                  backgroundColor: '#0A0043',
                  color: '#FFF',
                  borderRadius: 12,
                  padding: '4px 8px'
                }}>
                  {counts[key] || 0} คน
                </div>
              </Card.Body>
            </Card>

          ))}

          <Dropdown>

            <Dropdown.Toggle
              style={{ backgroundColor: '#0A0043' }}
              className="w-100 mb-4"
              id="dropdown-basic"
            >
              <i className="bi bi-plus" /> เพิ่ม
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100 mb-4">
              <Dropdown.Item>Admin</Dropdown.Item>
              <Dropdown.Item>Executive Level</Dropdown.Item>
              <Dropdown.Item>Management Level</Dropdown.Item>
            </Dropdown.Menu>

          </Dropdown>

        </div>

        {/* Control 2 */}
        <div>

          <h3 className="mb-4" style={{ color: '#0A0043' }}>สิทธิ์การเข้าถึง - Admin</h3>
          <hr className="mb-4" style={{ border: '1px solid #0A0043' }} />

          {[
            {
              title: 'Dashboard และ รายงาน',
              items: [{ id: 'dashboard', label: 'ดู Dashboard และรายงาน' }]
            },
            {
              title: 'จัดการพนักงาน',
              items: [
                { id: 'view', label: 'ดูข้อมูลพนักงาน' },
                { id: 'edit', label: 'แก้ไขข้อมูล' },
                { id: 'add', label: 'เพิ่มพนักงาน' },
                { id: 'delete', label: 'ลบพนักงาน' }
              ]
            },
            {
              title: 'จัดการเวลาทำงาน',
              items: [
                { id: 'timeview', label: 'ดูบันทึกเวลา' },
                { id: 'approve', label: 'อนุมัติการแก้ไข' },
                { id: 'edittime', label: 'แก้ไขเวลาเข้าออก' },
                { id: 'report', label: 'กำหนดค่ารายงาน' }
              ]
            },
            {
              title: 'ตั้งค่าระบบ',
              items: [
                { id: 'export', label: 'ส่งออกข้อมูล' },
                { id: 'perm', label: 'กำหนดสิทธิ์' },
                { id: 'gps', label: 'จัดการ GPS' },
                { id: 'log', label: 'ดูบันทึก' }
              ]
            }
          ].map((group) => (

            <div key={group.title} className="mb-4">

              <div className="d-flex justify-content-between align-items-center mb-2">

                <h5 style={{ color: '#0A0043' }}>
                  <i className="bi bi-caret-right-fill" style={{ color: '#735BF2' }} /> {group.title}
                </h5>

                <Button style={{ backgroundColor: '#0A0043', color: '#FFF' }}>เลือกทั้งหมด</Button>

              </div>

              {group.items.map((item) => (

                <Card key={item.id} className="mb-2" style={{ backgroundColor: '#0A0043' }}>
                  <Form className="ml-4" style={{ color: '#FFF' }}>
                    <Form.Check type="checkbox" id={item.id} label={item.label} />
                  </Form>
                </Card>
                
              ))}

            </div>

          ))}
        </div>

        <div className="d-flex justify-content-center mt-5 mb-3" style={{ gap: '150px' }}>
          <Button variant="light" style={{ color: '#0A0043' }}>บันทึก</Button>
          <Button style={{ backgroundColor: '#0A0043', color: '#FFF' }}>ยกเลิก</Button>
        </div>

      </div>

    </div>
  )
}
