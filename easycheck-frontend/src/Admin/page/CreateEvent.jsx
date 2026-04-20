import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Api from "../../Api";
import '../../css/EventAdmincustom.css'

const CreateEvent = () => {

    const [flipped, setFlipped] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')


    const [eventDescription, seteventDescription] = useState('')
    const [eventTitle, seteventTitle] = useState('')
    const [eventDate, seteventDate] = useState('')
    const [eventTime, seteventTime] = useState('')
    const [eventLocation, seteventLocation] = useState('')
    const [eventRegister_start, seteventRegister_start] = useState('')
    const [eventRegister_end, seteventRegister_end] = useState('')
    const [eventType, seteventType] = useState('')
    const [eventMax_Participants, seteventMax_Participants] = useState('')
    const [eventCurrent_Participants, seteventCurrent_Participants] = useState('')
    const [eventNote, seteventNote] = useState('')








    const [currentTime, setCurrentTime] = useState(new Date())
    const [currentDate, setCurrentDate] = useState(new Date())

    const today = new Date()
    const todayDate = today.getDate().toString().padStart(2, '0')

    const [showTable, setShowTable] = useState(false)

    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null);


    // const [SelectedEditDate , setSelectedEditDate] = useState('')
    // const [SelectedEditTitle , setSelectedEditTitle] = useState('')
    // const [SelectedEditDescription , setSelectedEditDescription] = useState('')




    const handleBack = () => {
        setFlipped(false)
    }





    // -------------------- calendar -----------------------------//
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])


    const handleDayClick = (dayObj) => {
        const day = Number(dayObj.day)

        let date

        if (dayObj.className === 'last-month') {
            date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
        } else if (dayObj.className === 'next-month') {
            date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
        } else {
            date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        }

        setSelectedDate(formatDateTime(date))
        setFlipped(true)
    }


    // calendar generator
    const getCalendarWeeks = (year, month) => {
        const weeks = []
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const daysInPrevMonth = new Date(year, month, 0).getDate()

        let currentDay = 1
        let nextMonthDay = 1

        for (let week = 0; week < 6; week++) {
            const days = []

            for (let i = 0; i < 7; i++) {
                if (week === 0 && i < firstDay) {
                    days.push({
                        day: String(daysInPrevMonth - firstDay + i + 1).padStart(2, '0'),
                        className: 'last-month'
                    })
                } else if (currentDay > daysInMonth) {
                    days.push({
                        day: String(nextMonthDay++).padStart(2, '0'),
                        className: 'next-month'
                    })
                } else {
                    days.push({
                        day: String(currentDay++).padStart(2, '0')
                    })
                }
            }

            weeks.push(days)
            if (currentDay > daysInMonth && nextMonthDay > 7) break
        }

        return weeks
    }






    const formatDateTime = (date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    // change month
    const nextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    }

    const prevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    }

    const weeks = getCalendarWeeks(
        currentDate.getFullYear(),
        currentDate.getMonth()
    )

    // -------------------- calendar -----------------------------//





    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await Api.get("/admin/Event")

                console.log("API:", res.data)

                setEvents(Array.isArray(res.data) ? res.data : Object.values(res.data))

            } catch (err) {
                console.error("Error fetching events:", err)
            }
        }

        fetchEvents()
    }, [])



    const formatDateTimeSQL_FULL = (dateTime) => {
        if (!dateTime) return null;

        return dateTime
            .replace("T", " ")
            .replace("Z", "")
            .split(".")[0];
    };


    const formatToInputDateTime = (dateTime) => {
        if (!dateTime) return "";

        const d = new Date(dateTime);

        const pad = (n) => n.toString().padStart(2, "0");

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };





    const SaveEvent = async () => {

        if (!eventTitle || !eventDate || !eventTime || !eventLocation || !eventMax_Participants) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const res = await Api.post("/admin/CreateEvent", {
                title: eventTitle,
                //ใช้ formatDate ให้รูปแบบถูกต้องเพื่อส่งไป backend
                event_date: eventDate,
                description: eventDescription,
                event_time: eventTime + ":00",
                location: eventLocation,
                register_start: formatDateTimeSQL_FULL(eventRegister_start),
                register_end: formatDateTimeSQL_FULL(eventRegister_end),
                type: eventType,
                max_participants: eventMax_Participants
            });

            console.log("RESPONSE:", res.data);

            alert("Event created successfully");

        } catch (err) {
            console.error("ERROR:", err.response?.data || err);
            return alert("Create failed");
        }

        try {
            const res = await Api.get("/admin/Event");
            setEvents(res.data);
        } catch (err) {
            console.error("GET ERROR:", err);
        }

        handleBack();

        // เคลียร์ input

        setEventTitle("");
        setEventDate("");
        setEventDescription("");
        seteventTime("");
        seteventLocation("");
        seteventType("");
        seteventRegister_start("");
        seteventRegister_end("");
        seteventMax_Participants("");



        window.location.reload();



    };







    const DeleteEvent = async (id) => {
        console.log("SEND ID:", id);

        if (!id) return alert("NO event id");

        try {
            const res = await Api.delete(
                "/admin/DeleteEvent",
                { data: { id } }
            );

            alert(res.data.message);

            setEvents(prev => prev.filter(e => e.id !== id));

            setSelectedEvent(null);


        } catch (error) {
            console.error(error);
            alert("Error deleting");
        }


    };





    const formatDateTimeSQL = (dateTime) => {
        if (!dateTime) return null;

        return dateTime.replace("T", " ") + ":00";
    };


    const SaveEditEvent = async () => {

        try {
            const payload = {
                id: selectedEvent.id,
                title: selectedEvent.title,
                event_date: selectedEvent.event_date,
                description: selectedEvent.description,

                event_time: selectedEvent.event_time + ":00",

                location: selectedEvent.location,

                register_start: formatDateTimeSQL(selectedEvent.register_start),
                register_end: formatDateTimeSQL(selectedEvent.register_end),

                type: selectedEvent.type,
                max_participants: selectedEvent.max_participants
            };

            console.log("SEND DATA:", payload); // 🔥 debug

            const res = await Api.patch(
                "/admin/EditEvent",
                payload
            );

            console.log(res.data);
            window.location.reload();

        } catch (error) {
            console.error("ERROR FULL:", error.response?.data || error);
        }

    }



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
            {/* Header */}
            <div className="d-flex justify-content-center align-items-center py-5 position-relative">
                <h1 className="text-white m-0">Event Management</h1>
            </div>

            <div className='text-center text-white mt-5'>

                <h2 className='mb-4'> How to Add an Event </h2>
                <p> Select the date and time </p>
                <p> Write the event details </p>
                <p> Click Save to store the event or Dismiss to cancel </p>

            </div>

            {/* Card Centered */}
            <Container className="d-flex justify-content-center align-items-center ">
                <Row className="justify-content-center w-100">
                    <Col md={12} className="d-flex justify-content-center">
                        <Card
                            className="shadow-lg rounded-4 mt-5 mx-auto"
                            style={{
                                width: '50vw',
                                minHeight: '500px',
                                background: 'linear-gradient(to bottom, #FFFFFF, #A4B7FC)',
                                border: 'none',
                                overflow: 'hidden',
                            }}
                        >
                            {!flipped ? (
                                <Card.Body>

                                    <h5 className="text-center mb-3">
                                        {formatDateTime(currentTime)}
                                    </h5>

                                    {/* month control */}
                                    <div className="d-flex justify-content-between mb-3">
                                        <Button
                                            onClick={prevMonth}
                                            style={{ backgroundColor: '#1c1d27', color: '#fff', border: 'none' }}
                                        >
                                            <i class="bi bi-arrow-left"></i>
                                        </Button>
                                        <strong>
                                            {currentDate.toLocaleDateString('en-GB', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </strong>
                                        <Button
                                            onClick={nextMonth}
                                            style={{ backgroundColor: '#1c1d27', color: '#fff', border: 'none' }}

                                        >
                                            <i class="bi bi-arrow-right"></i>
                                        </Button>
                                    </div>

                                    {/* header */}
                                    <Row className="text-center fw-bold mb-2">
                                        <Col>MON</Col><Col>TUE</Col><Col>WED</Col>
                                        <Col>THU</Col><Col>FRI</Col><Col>SAT</Col><Col>SUN</Col>
                                    </Row>

                                    {/* calendar */}
                                    {weeks.map((week, i) => (
                                        <Row key={i} className="text-center mb-2">
                                            {week.map((day, idx) => (
                                                <Col
                                                    key={idx}
                                                    className={`py-2 ${day.className ? 'text-muted' : ''
                                                        } ${day.day === todayDate && !day.className
                                                            ? 'bg-dark text-white'
                                                            : ''
                                                        }`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleDayClick(day)}
                                                >
                                                    {day.day}
                                                </Col>
                                            ))}
                                        </Row>
                                    ))}

                                </Card.Body>
                            ) : (
                                <Card.Body
                                    style={{
                                        maxHeight: '570px',
                                        overflowY: 'auto'
                                    }}
                                >

                                    <strong> Detail Event :</strong>
                                    &nbsp;

                                    <Form.Control
                                        placeholder="Title :"
                                        value={eventTitle}
                                        onChange={(e) => seteventTitle(e.target.value)}
                                    />

                                    &nbsp;

                                    <Form.Control
                                        placeholder="Event detail :"
                                        value={eventDescription}
                                        onChange={(e) => seteventDescription(e.target.value)}
                                    />

                                    &nbsp;



                                    <Form.Control
                                        placeholder="Location detail :"
                                        value={eventLocation}
                                        onChange={(e) => seteventLocation(e.target.value)}
                                    />

                                    &nbsp;

                                    <div>

                                        <strong> Event Date :</strong>
                                        &nbsp;
                                        <input
                                            type="date"
                                            className="form-control mt-1"
                                            value={eventDate}
                                            onChange={(e) => seteventDate(e.target.value)}
                                        />

                                        <input
                                            type="time"
                                            className="form-control mt-1"
                                            value={eventTime}
                                            onChange={(e) => seteventTime(e.target.value)}
                                        />
                                    </div>

                                    &nbsp;

                                    <div>

                                        <strong> Max Participants :</strong>
                                        &nbsp;
                                        <input
                                            className="form-control mt-1"
                                            value={eventMax_Participants}
                                            onChange={(e) => seteventMax_Participants(e.target.value)}
                                        />


                                    </div>



                                    &nbsp;

                                    <div>

                                        <strong> Register DateTime :</strong>
                                        &nbsp;


                                        <div>
                                            <p style={{ marginBottom: '4px' }}>Start</p>
                                            <input
                                                type="datetime-local"
                                                className="form-control mt-1"
                                                value={eventRegister_start}
                                                onChange={(e) => seteventRegister_start(e.target.value)}

                                            />

                                            <p style={{ marginBottom: '4px' }}>End</p>
                                            <input
                                                type="datetime-local"
                                                className="form-control mt-1"
                                                value={eventRegister_end}
                                                onChange={(e) => seteventRegister_end(e.target.value)}
                                            />

                                        </div>

                                    </div>


                                    &nbsp;

                                    <div style={{ position: "relative" }}>

                                        <strong> Select Event Type : </strong>

                                        <select
                                            className="form-control mt-1"
                                            value={eventType}
                                            onChange={(e) => seteventType(e.target.value)}
                                        >
                                            <option value="">Type Event</option>
                                            <option value="internal">internal</option>
                                            <option value="external">external</option>
                                        </select>

                                        <i
                                            className="bi bi-caret-down-fill"
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "75%",
                                                transform: "translateY(-50%)",
                                                pointerEvents: "none"
                                            }}
                                        ></i>
                                    </div>




                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        {/* ตรงสร้าง event */}
                                        <Button onClick={SaveEvent}>Save</Button>
                                        <Button variant="danger" onClick={handleBack}>Cancel</Button>
                                    </div>
                                </Card.Body>
                            )}

                        </Card>
                    </Col>
                </Row>
            </Container>

            <br />







            {/* all event */}

            <div className="d-flex justify-content-center mt-4">
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="container">
                        <h3 className="mb-3 text-center" style={{ color: 'white', marginTop: '20px' }}>
                            All Events
                        </h3>

                        <div className="border rounded p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            <div className="list-group">
                                {Array.isArray(events) && events.map((event) => (
                                    <a
                                        key={event.id}
                                        className="list-group-item list-group-item-action"
                                        data-bs-toggle="modal"
                                        data-bs-target="#eventModal"
                                        onClick={() =>
                                            setSelectedEvent({
                                                ...event,
                                                event_date: event.event_date
                                                    ? event.event_date.split("T")[0]
                                                    : "",

                                                event_time: event.event_time
                                                    ? event.event_time.slice(0, 5)
                                                    : "",


                                                register_start: event.register_start || "",
                                                register_end: event.register_end || ""
                                            })
                                        }
                                    >
                                        {event.title}
                                    </a>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* MODAL (ตัวเดียวพอ) */}
            <div className="modal fade" id="eventModal" tabIndex="-1">
                <div
                    className="modal-dialog"
                    style={{
                        maxWidth: '650px',
                        marginTop: '50px',
                        marginBottom: '50px'
                    }}
                >
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedEvent?.title || "Event"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <strong> Event Date :</strong>
                                <input
                                    type="date"
                                    className="form-control mt-1"
                                    value={
                                        selectedEvent?.event_date
                                            ? selectedEvent.event_date.split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            //กระจาย event ออกมา แล้วเปลี่ยนเฉพาะ date
                                            ...selectedEvent,
                                            event_date: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="mb-3" >

                                <strong> Event Time : </strong>
                                <input
                                    type="time"
                                    className="form-control mt-1"
                                    value={selectedEvent?.event_time || ""}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            event_time: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="mb-3" >

                                <strong>Location Detail : </strong>
                                <input
                                    className="form-control mt-1"
                                    value={selectedEvent?.location || ""}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            location: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="mb-3" >

                                <strong> Max Participants : </strong>
                                <input
                                    className="form-control mt-1"
                                    value={selectedEvent?.max_participants || ""}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            max_participants: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="mb-3" >

                                <strong> Current Participants : </strong>
                                <input
                                    className="form-control mt-1"
                                    value={selectedEvent?.current_participants || ""}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            current_participants: e.target.value

                                        })
                                    }
                                    readOnly
                                />

                            </div>





                            <div className="mb-3" >

                                <strong>Registration Start Time : </strong>
                                <input
                                    type="datetime-local"
                                    className="form-control mt-1"
                                    value={formatToInputDateTime(selectedEvent?.register_start)}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            register_start: e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="mb-3" >

                                <strong>Registration End Time : </strong>
                                <input
                                    type="datetime-local"
                                    className="form-control mt-1"
                                    value={formatToInputDateTime(selectedEvent?.register_end)}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            register_end: e.target.value
                                        })
                                    }
                                />

                            </div>






                            <div className="mb-3">
                                <strong>ผู้สมัคร :</strong>{" "}
                                <Button
                                    variant="warning"
                                    onClick={() => setShowTable(!showTable)}
                                >
                                    <i className="bi bi-pen"></i>
                                </Button>

                            </div>

                            {showTable && (
                                <Table bordered hover className="custom-tableEvent" style={{ marginTop: '30px', border: '20px' }}>
                                    <thead style={{ backgroundColor: "#212529", color: "white" }}>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>ID Employee</th>
                                            <th>Note</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedEvent?.users?.length > 0 ? (
                                            selectedEvent.users.map((user, index) => (
                                                <tr key={user.id_employee}>
                                                    <td>{user.firstname}</td>
                                                    <td>{user.lastname}</td>
                                                    <td>{user.id_employee}</td>
                                                    <td>{user.notes || " - "}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: "center" }}>
                                                    ไม่มีข้อมูล
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}




                            <textarea
                                className="form-control"
                                rows="3"
                                value={selectedEvent?.description || ""}
                                onChange={(e) =>
                                    setSelectedEvent({
                                        ...selectedEvent,
                                        description: e.target.value
                                    })
                                }
                                style={{ color: "blue" }}
                            />



                            <button
                                className="btn btn-primary mt-2"
                                onClick={SaveEditEvent}
                            >
                                Save changes
                            </button>

                            &nbsp;

                            <button
                                className="btn btn-danger mt-2"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    DeleteEvent(selectedEvent?.id)
                                }}                            >
                                Delete
                            </button>

                        </div>





                    </div>
                </div>
            </div>




        </div>
    )
}


export default CreateEvent
