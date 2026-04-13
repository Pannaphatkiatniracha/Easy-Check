import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'

export default function AccessControl() {

  const [selectedRole, setSelectedRole] = useState(null)

  const [openMenu, setOpenMenu] = useState(null)

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu)
  }



  // api role counts
  const [counts, setCounts] = useState([])

  //save role permission
  const [role_id, setRoleId] = useState(null);
  const [role_permissions, setRolePermissions] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/GetPositionCount")
        setCounts(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])




  const countMap = counts.reduce((acc, item) => {
    acc[item.role] = item.total
    return acc
  }, {})

  // acc(accumulator) คือ ตัวที่เก็บผลลัพธ์ไว้เรื่อย ๆ เหมือนกล่องอ่ะ
  // ใช้ reduce มารวม array ทุกอย่างไว้ แล้วแปลงเป็น object{} หนึ่งตัว(แต่ในนั้นมีข้อมูลหลายค่า) แล้วเก็บมันไว้ใน countmap

  // กันงงนะ reduce = คนที่ "วน loop"
  // acc = ของที่ "ค่อย ๆ ถูกสร้าง" 



  const SaveRolePermissions = async () => {

    if (!role_id) {
      alert("กรุณาเลือกข้อมูล");
      return;
    }

    try {
      await axios.post("http://localhost:5000/admin/SaveRolePermissions", {
        role_id,
        role_permissions
      });

      alert("บันทึกสำเร็จ");

    } catch (err) {
      console.error(err);
    }
  };

  const GetRolePermissions = async (role_id) => {
    try {
      const res = await axios.get("http://localhost:5000/admin/GetRolePermissions", {
        params: { role_id }
      }
      );

      const ids = res.data.map(item => item.id_permission); //เอาแต่ id_permission ออกมา
      setRolePermissions(ids); //setRolePermissions ด้วย ([1,2,3])

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (role_id) {
      GetRolePermissions(role_id)
    }
  }, [role_id])



  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, #3C467B, #6E80E1)',
        minHeight: '100vh',
        paddingBottom: '60px',
        width: '100vw',
      }}
    >
      {/* header */}
      <div className="py-4">
        <h1 className="fw-bold text-center m-4" style={{ color: '#FFFF' }}>
          Access Control System
        </h1>
      </div>

      {/* content */}
      <div
        className="mx-auto mt-5"
        style={{
          width: '500px',
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: 12
        }}
      >

        <h3 className="mb-4" style={{ color: '#0A0043' }}>
          จัดการสิทธิ์การเข้าถึง
        </h3>


        <Card className="mb-2">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <span style={{ fontWeight: "bold" }}>Admin</span>
            <span
              style={{
                backgroundColor: "#0A0043",
                color: "#fff",
                padding: "3px 20px",
                borderRadius: "20px",
                fontWeight: "bold"
              }}
            >{countMap["admin"] || 0}</span>
          </div>
        </Card>

        <Card className="mb-2">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <span style={{ fontWeight: "bold" }}>Super Admin</span>
            <span
              style={{
                backgroundColor: "#0A0043",
                color: "#fff",
                padding: "3px 20px",
                borderRadius: "20px",
                fontWeight: "bold"
              }}
            >{countMap["super admin"] || 0}</span>
          </div>
        </Card>

        <Card className="mb-2">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <span style={{ fontWeight: "bold" }}>Approver</span>
            <span
              style={{
                backgroundColor: "#0A0043",
                color: "#fff",
                padding: "3px 20px",
                borderRadius: "20px",
                fontWeight: "bold"
              }}
            >{countMap["approver"] || 0}</span>
          </div>
        </Card>

        <Card className="mb-2">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <span style={{ fontWeight: "bold" }}>User</span>
            <span
              style={{
                backgroundColor: "#0A0043",
                color: "#fff",
                padding: "3px 20px",
                borderRadius: "20px",
                fontWeight: "bold"
              }}
            >{countMap["user"] || 0}</span>
          </div>
        </Card>

        <hr />

        {/* 🔥 ปุ่มเพิ่ม */}
        <Dropdown className="mb-4">

          <Dropdown.Toggle
            style={{ backgroundColor: '#0A0043' }}
            className="w-100"
          >
            <i className="bi bi-plus" /> เลือก
          </Dropdown.Toggle>






          <Dropdown.Menu className="w-100">
            <Dropdown.Item
              onClick={() => {
                setSelectedRole('Admin')
                setRoleId(3)
                setRolePermissions([])
              }}>
              Admin
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
              setSelectedRole('super admin')
              setRoleId(4)
              setRolePermissions([])
            }}>
              Super Admim
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
              setSelectedRole('approver')
              setRoleId(2)
              setRolePermissions([])
            }}>
              Approver
            </Dropdown.Item>
            <Dropdown.Item onClick={() => {
              setSelectedRole('user')
              setRoleId(1)
              setRolePermissions([])
            }}>
              User
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>



        {/* แสดงสิทธิ์เมื่อเลือก */}
        {selectedRole && (
          <div>

            <h4 className="mb-3" style={{ color: '#0A0043' }}>
              สิทธิ์การเข้าถึง - {selectedRole}
            </h4>
            {/* 🔹 Dashboard */}
            <Card className="mb-2" >
              <div className="p-2 text-white">

                <Button
                  variant="light"
                  className="w-100"
                  onClick={() => toggleMenu("dashboard")}
                >
                  Dashboard และรายงาน
                </Button>

                {openMenu === "dashboard" && (
                  <div className="mt-2 bg-white text-dark p-2 rounded">
                    <Form.Check
                      label="ดู Dashboard"
                      checked={role_permissions.includes(1)}
                      onChange={(e) =>
                        setRolePermissions(prev => //prev = ค่าเก่าของ role_permissions
                          e.target.checked
                            ? [...new Set([...prev, 1])]
                            //ตอนติ๊ก (เพิ่ม)
                            : prev.filter(id => id !== 1)
                            //ตอนเอาติ๊กออก (ลบ)
                        )
                      }
                    />

                    <Form.Check label="ดูรายงานการเข้าออกของพนักงาน"
                      checked={role_permissions.includes(2)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 2])]
                            : prev.filter(id => id !== 2)
                        )
                      }
                    />
                  </div>
                )}

              </div>
            </Card>



            {/* พนักงาน */}
            <Card className="mb-2">
              <div className="p-2 text-white">

                <Button
                  variant="light"
                  className="w-100"
                  onClick={() => toggleMenu("employee")}
                >
                  จัดการพนักงาน
                </Button>

                {openMenu === "employee" && (
                  <div className="mt-2 bg-white text-dark p-2 rounded">
                    <Form.Check
                      label="ดูข้อมูลพนักงาน"
                      checked={role_permissions.includes(3)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 3])]
                            : prev.filter(id => id !== 3)
                        )
                      } />
                    <Form.Check
                      label="เพิ่มรายชื่อพนักงาน"
                      checked={role_permissions.includes(4)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 4])]
                            : prev.filter(id => id !== 4)
                        )
                      } />
                    <Form.Check
                      label="แก้ไขข้อมูลพนักงาน"
                      checked={role_permissions.includes(5)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 5])]
                            : prev.filter(id => id !== 5)
                        )
                      } />
                    <Form.Check
                      label="ลบรายชื่อพนักงาน"
                      checked={role_permissions.includes(6)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 6])]
                            : prev.filter(id => id !== 6)
                        )
                      } />
                  </div>
                )}

              </div>
            </Card>




            {/* เวลา */}
            <Card className="mb-2">
              <div className="p-2 text-white">

                <Button
                  variant="light"
                  className="w-100"
                  onClick={() => toggleMenu("time")}
                >
                  จัดการเวลาทำงาน
                </Button>

                {openMenu === "time" && (
                  <div className="mt-2 bg-white text-dark p-2 rounded">
                    <Form.Check
                      label="ดูบันทึกเวลาเข้าออกงาน"
                      checked={role_permissions.includes(7)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 7])]
                            : prev.filter(id => id !== 7)
                        )
                      } />
                    <Form.Check
                      label="อนุมัติการเข้าออกงาน"
                      checked={role_permissions.includes(8)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 8])]
                            : prev.filter(id => id !== 8)
                        )
                      } />
                    <Form.Check
                      label="แก้ไขเวลาเข้าออกงาน"
                      checked={role_permissions.includes(9)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 9])]
                            : prev.filter(id => id !== 9)
                        )
                      } />
                  </div>
                )}

              </div>
            </Card>



            {/* ตั้งค่า */}
            <Card className="mb-2" >
              <div className="p-2 text-white">

                <Button
                  variant="light"
                  className="w-100"
                  onClick={() => toggleMenu("settings")}
                >
                  ตั้งค่าระบบ
                </Button>

                {openMenu === "settings" && (
                  <div className="mt-2 bg-white text-dark p-2 rounded">
                    <Form.Check
                      label="ส่งออกข้อมูล"
                      checked={role_permissions.includes(10)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 10])]
                            : prev.filter(id => id !== 10)
                        )
                      }
                    />
                    <Form.Check
                      label="กำหนดสิทธิ์การเข้าถึง"
                      checked={role_permissions.includes(11)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 11])]
                            : prev.filter(id => id !== 11)
                        )
                      } />
                    <Form.Check
                      label="จัดการ GPS"
                      checked={role_permissions.includes(12)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 12])]
                            : prev.filter(id => id !== 12)
                        )
                      } />
                    <Form.Check
                      label="ดูบันทึกระบบ"
                      checked={role_permissions.includes(13)}
                      onChange={(e) =>
                        setRolePermissions(prev =>
                          e.target.checked
                            ? [...new Set([...prev, 13])]
                            : prev.filter(id => id !== 13)
                        )
                      } />
                  </div>
                )}

              </div>

            </Card>



            {/* ปุ่ม save / cancel */}

            <div className="d-flex justify-content-center mt-5 mb-3" style={{ gap: '150px' }}>
              <Button
                variant="success"
                style={{ color: '#ffffff' }}
                onClick={SaveRolePermissions}
              > Save </Button>
              <Button variant="danger" style={{ color: '#FFF' }} onClick={() => setSelectedRole(null)}> Cancel</Button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
