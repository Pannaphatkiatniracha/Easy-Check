import React, { useEffect, useRef, useState } from 'react';
import { fetchApi } from '../../data/Api';
import { Button, Form, Table, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
// import '../../css/custom.css';
import '../../css/custom.css';


const ShiftSchedule = () => {
  const [apiRaw, setApiRaw] = useState([]);
  const [Api, setApi] = useState([]);



  const [selectedLevel, setSelectedLevel] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [numPages, setNumPages] = useState(1);


  const [curPage, setCurPage] = useState(1);
  const rowsPerPage = 5;


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const newIdRef = useRef();
  const [newShift, setNewShift] = useState('');
  const [newLevel, setNewLevel] = useState('');


  useEffect(() => {
    setApiRaw(fetchApi());
  }, []); //โหลดข้อมูลครั้งแรกจาก API


  useEffect(() => {
    setApi(apiRaw);
  }, [apiRaw]); //sync ข้อมูลดิบมาเป็นข้อมูลที่ใช้แสดง


  useEffect(() => {
    if (selectedLevel) {
      setFilteredData(Api.filter(item => item.Level === selectedLevel));
    } else {
      setFilteredData(Api);
    }
    setCurPage(1);
  }, [selectedLevel, Api]); //กรองข้อมูลตาม Level ที่เลือก และ reset หน้าเป็น 1



  useEffect(() => {
    const pages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    setNumPages(pages);
    setCurPage(prev => Math.min(prev, pages));
  }, [filteredData]); //คำนวณจำนวนหน้าทุกครั้งที่ข้อมูลกรองเปลี่ยนแปลง



  const startIndex = (curPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pagedData = filteredData.slice(startIndex, endIndex); //ตัดข้อมูลเฉพาะช่วงที่ต้องแสดงในหน้าปัจจุบัน


  const saveClicked = () => {
    const Idemployee = newIdRef.current?.value || '';
    const Shift = newShift;
    const Level = newLevel;

    if (Idemployee.trim() === '' || Shift.trim() === '' || Level.trim() === '') {
      alert("Please fill in all required fields.");
      return;
    } // ตัดช่องว่างด้วย trim() ถ้ามีช่องว่างให้แจ้งเตือนว่าให้กรอกข้อมูลให้ครบ

    const newData = {
      id: Date.now(),
      photo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      Firstname: "New", //อนาคตต้องเพิ่มช่องกรอกชื่อ-นามสกุล
      Lastname: "User",
      Idemployee,
      Shift,
      Level
    };

    const idPattern = /^[0-9]{1,6}$/; // เอา ตัวเลข 1–6 หลัก // ^ คือจุดเริ่มต้น $ คือจุดสิ้นสุด [0-9] → อนุญาตเฉพาะตัวเลข 0–9 และ {1,6} → ต้องมีความยาวอย่างน้อย 1 หลัก และไม่เกิน 6 หลัก
    if (!idPattern.test(Idemployee)) { //!idPattern.test(...) → ถ้าไม่ตรงตามกฎ idPattern  → เข้าเงื่อนไข alert(...)
      alert("ID Employee must be numeric and up to 6 digits.");
      return;
    }

    //prev คือค่าปัจจุบันของ Api
    setApi(prev => [...prev, newData]); //กระจายข้อมูลเดิมทั้งหมดออกมา แล้วต่อท้ายด้วย newData
    handleClose();
    setNewShift('');
    setNewLevel('');
  };



  return (
    <div style={{
      background: 'linear-gradient(to bottom, #3C467B, #6E80E1)',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      padding: '5rem',
      position: 'relative',

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
          aria-label="Select level"
          className="p-1 w-25"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="" style={{ backgroundColor: '#000957', color: '#ffffff' }}>
            Select Level
          </option>
          <option value="Executive Level" style={{ backgroundColor: '#ABABAB', color: '#ffffff' }}>
            Executive Level
          </option>
          <option value="Management Level" style={{ backgroundColor: '#ABABAB', color: '#ffffff' }}>
            Management Level
          </option>
          <option value="Staff Level" style={{ backgroundColor: '#ABABAB', color: '#ffffff' }}>
            Staff Level
          </option>
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
      <div style={{ backgroundColor: 'transparent' }} className="p-3 w-auto">
        <Table variant="light" style={{ color: '#ffffff', border: 'none' }}>
          <thead style={{ color: '#ffffff' }}>
            <tr>
              <th className="p-4">Photo</th>
              <th className="p-4">ID Employee</th>
              <th className="p-4">First name</th>
              <th className="p-4">Last name</th>
              <th className="p-4">Shift</th>
              <th className="p-4">Level</th>
            </tr>
          </thead>

          <tbody style={{ color: '#ffffff' }}>
            {pagedData.map((item) => (
              <tr key={item.id}>
                <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '1rem' }}>
                  <img
                    src={item.photo}
                    alt={`${item.Firstname} ${item.Lastname}`}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      display: 'inline-block' // ใช้ inline-block แทน block เพื่อไม่บังคับให้อยู่กลาง
                    }}
                  />
                </td>

                <td className="justify-center items-center p-4">{item.Idemployee}</td>
                <td className="justify-center items-center p-4">{item.Firstname}</td>
                <td className="justify-center items-center p-4">{item.Lastname}</td>
                <td className="justify-center items-center p-4">{item.Shift}</td>
                <td className="justify-center items-center p-4">{item.Level}</td>
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
          <Modal.Title closeButton style={{ color: '#ffffff' }}>ADD Shift Schedule</Modal.Title>
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

            <DropdownButton title={newShift || "Shift :"} className="mb-4 mt-4" variant="light">
              <Dropdown.Item onClick={() => setNewShift("08.00 - 17.00")}>08.00 - 17.00</Dropdown.Item>
              <Dropdown.Item onClick={() => setNewShift("09.00 - 18.00")}>09.00 - 18.00</Dropdown.Item>
              <Dropdown.Item onClick={() => setNewShift("10.00 - 19.00")}>10.00 - 19.00</Dropdown.Item>
            </DropdownButton>


            <DropdownButton title={newLevel || "Level :"} className="mb-4 mt-4" variant="light">
              <Dropdown.Item onClick={() => setNewLevel("Executive Level")}>Executive Level</Dropdown.Item>
              <Dropdown.Item onClick={() => setNewLevel("Management Level")}>Management Level</Dropdown.Item>
              <Dropdown.Item onClick={() => setNewLevel("Staff Level")}>Staff Level</Dropdown.Item>
            </DropdownButton>


          </Form>

        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#000957', color: '#ffffff' }}>
          <Button variant="danger" onClick={handleClose}>Dismiss</Button>
          <Button variant="success" onClick={saveClicked}>Save</Button>
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
