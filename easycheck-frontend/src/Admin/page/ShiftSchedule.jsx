import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Table, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/Shiftcustom.css'
import Api from "../../Api";
import { usePermission } from '../../usePermission';
import { useAuth } from '../../AuthContext.jsx';


const ShiftSchedule = () => {
    const [shifts, setShifts] = useState([]);
    //เก็บข้อมูล “ทั้งหมด” จาก backend

    const [selectedLevel, setSelectedLevel] = useState("");
    //level ที่ user เลือก (จาก dropdown)

    const [filteredData, setFilteredData] = useState([]);
    //ข้อมูล “หลังกรองแล้ว”

    const [numPages, setNumPages] = useState(1);
    const [curPage, setCurPage] = useState(1);
    const rowsPerPage = 5;
    //แบ่งหน้า

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //ควบคุม modal (เปิด/ปิด)

    const newIdRef = useRef();

    const [newShift, setNewShift] = useState('');
    const [newRole, setNewRole] = useState('');
    //ใช้รับค่าตอน “เพิ่ม shift”

    const [showEdit, setShowEdit] = useState(false);

    const handleOpenEdit = () => setShowEdit(true);
    const handleCloseEdit = () => setShowEdit(false);


    const [editingUserId, setEditingUserId] = useState(null);
    const [editingShiftId, setEditingShiftId] = useState(null);
    const [editRole, setEditRole] = useState(null);
    const [editShift, setEditShift] = useState(null);
    //edit


    const { can } = usePermission();
    const { permissions, loading } = useAuth();
    //permissions access control

    if (loading) {
        return <div>Loading...</div>;
    }

    //กั้นหน้า ถ้าไม่มีสิทธิ์จ้า
    if (!can("edit_time_logs")) {
        return <div> คุณไม่มีสิทธิ์เข้าถึงหน้านี้ </div>;
    }






    // -------------------------- handleEdit -----------------------------------//
    const handleEdit = (item) => {
        console.log("EDIT:", item);

        const shift_id = shiftMap[item.start_time]; // map เวลา → id
        const role_id = roleMap[item.level];        // map role → id

        setEditingUserId(item.userId);
        setEditingShiftId(item.shift_id);

        setEditShift(shift_id || null); // ใช้ค่าที่ map แล้ว
        setEditRole(role_id || null);   // ค่าที่ map แล้ว

        setShowEdit(true);
    };

    //ตอนกด Edit:


    const shiftMap = {
        "08:00:00": 1,
        "09:00:00": 2,
        "10:00:00": 3
    };

    const roleMap = {
        "user": 1,
        "approver": 2,
        "admin": 3,
    };

    const roleLabel = (roleId) => {
        switch (roleId) {
            case 1: return "User";
            case 2: return "Approver";
            case 3: return "Admin";
            default: return "";
        }
    };

    const shiftLabel = (shiftId) => {
        switch (shiftId) {
            case 1: return "08:00 - 17:00";
            case 2: return "09:00 - 18:00";
            case 3: return "10:00 - 19:00";
            default: return "";
        }
    };

    // -------------------------- handleEdit -----------------------------------//


    // โหลดข้อมูลจาก backend
    useEffect(() => {
        Api.get("/admin/userShift")
            .then(res => {
                console.log("DATA:", res.data);

                setShifts(res.data);
            })
            .catch(err => console.error("Error fetching shifts:", err));
    }, []);



    //---------------------- filter Level ------------------------------------------------//

    // กรองตาม Level
    useEffect(() => {
        // selectedLevel เป็นช่องว่างไหม ถ้าว่างแสดง shift ( แสดง shift ทั้งหมด )
        // แต่ถ้า selectedLevel มึค่า ให้กรองข้อมูล ใช้ filter กลองจาก shifts ที่ item level = level ที่เราเลือก
        const filtered =
            selectedLevel === ""
                ? shifts
                : shifts.filter(item => String(item.level) === selectedLevel);

        setFilteredData(filtered);
        setCurPage(1); //รีเซ็ตกลับไปหน้าแรกทุกครั้งที่การกรองใหม่

    }, [selectedLevel, shifts]);

    //---------------------- filter Level ------------------------------------------------//






    //------------------------------------------ page control --------------------------------//

    // คำนวณจำนวนหน้า ทำงานทุกครั้งที่ filteredData
    // ได้จำนวนหน้าทั้งหมด .max ปัดขึ้น
    // ถ้าไม่มีข้อมูลเลย ก็ยังบังคับให้มีอย่างน้อย 1 หน้า (Math.max(1, ...))
    useEffect(() => {
        const pages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
        setNumPages(pages); //เก็บตัวคำนวณไว้ใน setNumPages
        setCurPage(prev => Math.min(prev, pages)); //หน้าปัจจุบันที่ตารางอยู่ prev ค่า curPage ก่อนเปลี่ยน pages ค่าที่คำนวณได้ || Math.min เลือกค่าที่น้อยที่สุด
    }, [filteredData]);

    const startIndex = (curPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pagedData = filteredData.slice(startIndex, endIndex);

    //------------------------------------------ page control --------------------------------//






    //---------------------- saveClicked ------------------------------------------------//

    // ---------------------- ADD ---------------------- //
    const saveClicked = async () => {
        const userId = newIdRef.current?.value || '';

        if (!userId || !newShift || !newRole) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            await Api.post("/admin/newUserShift", {
                userId,
                shiftId: newShift,
                roleId: newRole
            });

            // fetch ใหม่ให้ data ตรง
            const res = await Api.get("/admin/userShift");
            setShifts(res.data);

            setNewShift('');
            setNewRole('');
            newIdRef.current.value = '';
            setShow(false);

        } catch (err) {
            alert(err.response?.data?.message || "Failed to save shift");
        }
    };



    //---------------------- save Clicked ------------------------------------------------//







    //---------------------- Delete Clicked ------------------------------------------------//
    // ---------------------- DELETE ---------------------- //
    const handleDelete = async (userId, shiftId) => {
        try {
            await Api.delete("/admin/deleteUserShift", {
                data: { userId, shiftId }
            });

            // ลบออกจาก state ทันที
            setShifts(prev =>
                prev.filter(item =>
                    !(item.userId === userId && item.shift_id === shiftId)
                )
            );

        } catch (err) {
            console.error(err);
        }
    };
    //---------------------- Delete Clicked ------------------------------------------------//





    //---------------------- SaveEditeShift Clicked ------------------------------------------------//

    const SaveEditeShift = async (userId, shiftId, newShiftId, roleId) => {
        console.log("SEND DATA:", { userId, shiftId, newShiftId, roleId });

        try {
            await Api.put("/admin/editShift", {
                userId,
                shiftId,
                newShiftId,
                roleId
            });

            const res = await Api.get("/admin/userShift");
            setShifts(res.data);

            handleCloseEdit();
        } catch (err) {
            console.error(err);
        }
    };

    //---------------------- SaveEditeShift Clicked ------------------------------------------------//









    return (

        <div style={{
            background: 'linear-gradient(to bottom, #3C467B, #6E80E1)',
            position: 'fixed',
            top: 0,
            left: 260,             // กัน sidebar
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            padding: '2rem'
        }}>

            {/* header */}
            <div className="position-relative py-4">
                <h1 className="text-center m-4" style={{ color: '#FFFF', fontWeight: 500 }}>
                    Shift Schedule
                </h1>
            </div>

            {/* control box / filter */}
            <div className="align-items-center d-flex justify-content-end gap-3 mb-4">
                <Form.Select
                    style={{ backgroundColor: '#000957', color: '#ffffff' }}
                    className="p-1 w-25"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option value="">Select Level</option>
                    {[...new Set(shifts.map(s => s.level))].map(level => (
                        <option key={level} value={String(level)}>
                            {level}
                        </option>
                    ))}
                </Form.Select>


                <Button
                    variant="light"
                    title="ADD Shift Schedule"
                    style={{ backgroundColor: '#000957', color: '#ffffff', cursor: 'pointer' }}
                    onClick={handleShow}
                >
                    <i className="bi bi-plus-lg"></i>
                </Button>
            </div>

            {/* table */}
            <div style={{ backgroundColor: 'transparent' }} className="table-container">
                <Table variant="light" style={{ color: '#ffffff', border: 'none' }}>
                    <thead style={{ color: '#ffffff' }}>
                        <tr>
                            <th className="p-4">ID Employee</th>
                            <th className="p-4">First name</th>
                            <th className="p-4">Last name</th>
                            <th className="p-4">Shift</th>
                            <th className="p-4">Level</th>
                            <th className="p-4"></th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>

                    <tbody style={{ color: '#ffffff' }}>
                        {pagedData.map((item, index) => (
                            <tr key={index}>
                                <td className="p-4">{item.userId || "-"}</td>
                                <td className="p-4">{item.firstname}</td>
                                <td className="p-4">{item.lastname}</td>
                                <td className="p-4">{item.start_time} - {item.end_time}</td>
                                <td className="p-4">{item.level}</td>
                                <td className="p-4">
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleDelete(item.userId, item.shift_id)}
                                    >
                                        Delete
                                    </Button> &nbsp;

                                    {/* edit button */}
                                    <Button variant="warning" onClick={() => handleEdit(item)}>
                                        <i className="bi bi-pen"></i>
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>




                </Table>
            </div>




            {/* modal */}
            <Modal
                show={show}
                onHide={handleClose}
                centered
                backdrop="static"
                keyboard={false} >
                <Modal.Header closeButton style={{ backgroundColor: '#000957', color: '#ffffff' }}>
                    <Modal.Title style={{ color: '#ffffff' }}>ADD Shift Schedule</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ backgroundColor: '#000957', color: '#ffffff' }}>
                    <Form>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label></Form.Label>
                            <Form.Control
                                placeholder="ID Employee :"
                                autoFocus
                                ref={newIdRef}
                                maxLength={6}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, ''); // กรองเฉพาะตัวเลข
                                }}
                            />
                        </Form.Group>

                        <DropdownButton
                            title={newRole ? `Role: ${roleLabel(newRole)}` : "Role :"}
                            className="mb-4 mt-4"
                            variant="light"
                        >
                            <Dropdown.Item onClick={() => setNewRole(1)}>User</Dropdown.Item>
                            <Dropdown.Item onClick={() => setNewRole(2)}>Approver</Dropdown.Item>
                            <Dropdown.Item onClick={() => setNewRole(3)}>Admin</Dropdown.Item>
                        </DropdownButton>



                        <DropdownButton
                            title={newShift ? `Shift: ${shiftLabel(newShift)}` : "Shift :"}
                            className="mb-4 mt-4"
                            variant="light"
                        >
                            <Dropdown.Item onClick={() => setNewShift(1)}>08.00 - 17.00</Dropdown.Item>
                            <Dropdown.Item onClick={() => setNewShift(2)}>09.00 - 18.00</Dropdown.Item>
                            <Dropdown.Item onClick={() => setNewShift(3)}>10.00 - 19.00</Dropdown.Item>
                        </DropdownButton>

                    </Form>

                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#000957', color: '#ffffff' }}>
                    <Button variant="danger" onClick={handleClose}>Dismiss</Button>
                    <Button variant="success" onClick={saveClicked}>Save</Button>
                </Modal.Footer>
            </Modal>





            {/* edit modal */}
            <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Shift</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <DropdownButton
                            title={editRole ? `Role: ${roleLabel(editRole)}` : "Role :"}
                            className="mb-4 mt-4"
                            variant="light"
                        >
                            <Dropdown.Item onClick={() => setEditRole(1)}>User</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEditRole(2)}>Approver</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEditRole(3)}>Admin</Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton
                            title={editShift ? `Shift: ${shiftLabel(editShift)}` : "Shift :"}
                            className="mb-4 mt-4"
                            variant="light"
                        >
                            <Dropdown.Item onClick={() => setEditShift(1)}>08:00 - 17:00</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEditShift(2)}>09:00 - 18:00</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEditShift(3)}>10:00 - 19:00</Dropdown.Item>
                        </DropdownButton>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseEdit}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() =>
                            SaveEditeShift(
                                editingUserId,
                                editingShiftId,
                                editShift,
                                editRole
                            )
                        }
                    >
                        Save
                    </Button>

                </Modal.Footer>
            </Modal>





            {/* page control */}
            <div className="text-center">
                <Button
                    variant="light"
                    style={{ backgroundColor: '#000957', color: '#ffffff' }}
                    onClick={() => setCurPage(1)}
                    disabled={curPage === 1}
                >
                    First
                </Button>
                {' '}
                <Button
                    variant="light"
                    style={{ backgroundColor: '#000957', color: '#ffffff' }}
                    onClick={() => curPage > 1 && setCurPage(curPage - 1)}
                    disabled={curPage === 1}
                >
                    Previous
                </Button>
                {' '}
                <span>{curPage} / {numPages}</span>
                {' '}
                <Button
                    variant="light"
                    style={{ backgroundColor: '#000957', color: '#ffffff' }}
                    onClick={() => curPage < numPages && setCurPage(curPage + 1)}
                    disabled={curPage === numPages}
                >
                    Next
                </Button>
                {' '}
                <Button
                    variant="light"
                    style={{ backgroundColor: '#000957', color: '#ffffff' }}
                    onClick={() => setCurPage(numPages)}
                    disabled={curPage === numPages}
                >
                    Last
                </Button>
            </div>
        </div>
    );
};


export default ShiftSchedule;
