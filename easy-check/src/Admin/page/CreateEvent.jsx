import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const CreateEvent = () => {
    const [flipped, setFlipped] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')
    const [eventText, setEventText] = useState('')
    const [currentTime, setCurrentTime] = useState(new Date())
    const today = new Date()
    const todayDate = today.getDate().toString().padStart(2, '0')

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleDayClick = (day) => {
        setSelectedDate(`Oct ${day}th, 2025`)
        setFlipped(true)
    }

    const handleBack = () => {
        setFlipped(false)
    }

    const formatDateTime = (date) => {
        return date.toLocaleString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <div
            style={{
                background: 'linear-gradient(to bottom, #3C467B, #6E80E1)',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <div className="d-flex justify-content-center align-items-center py-5 position-relative">
                <i
                    className="bi bi-chevron-left position-absolute"
                    style={{
                        color: '#FFFF',
                        fontSize: '30px',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}
                ></i>
                <h1 className="text-white m-0">Event Management</h1>
            </div>

            {/* Card Centered */}
            <Container className="d-flex justify-content-center align-items-center ">
                <Row className="justify-content-center w-100">
                    <Col md={12} className="d-flex justify-content-center">
                        <Card
                            className="shadow-lg rounded-4 mt-5 mx-auto"
                            style={{
                                width: '90vw',
                                height: '500px',
                                background: 'linear-gradient(to bottom, #FFFFFF, #A4B7FC)',
                                border: 'none',
                                overflow: 'hidden',
                            }}
                        >
                            {!flipped ? (
                                <Card.Body>
                                    <Card.Title
                                        style={{ color: '#0A0043' }}
                                        className="text-center mb-4 mt-3"
                                    >
                                        {formatDateTime(currentTime)}
                                    </Card.Title>

                                    {/* Calendar Header */}
                                    <Row
                                        style={{ color: '#0A0043' }}
                                        className="text-center fw-bold text-secondary mb-3"
                                    >
                                        <Col>MON</Col>
                                        <Col>TUE</Col>
                                        <Col>WED</Col>
                                        <Col>THU</Col>
                                        <Col>FRI</Col>
                                        <Col>SAT</Col>
                                        <Col>SUN</Col>
                                    </Row>

                                    {/* Calendar Grid */}
                                    {['first', 'second', 'third', 'fourth', 'fifth'].map((week, i) => (
                                        <Row key={i} className="text-center mb-3 " title="Select the date and time" style={{ cursor: "pointer"}}>
                                            {getDaysForWeek(week).map((day, idx) => (
                                                <Col
                                                    key={idx}
                                                    className={`py-3 rounded ${day.className?.includes('last-month')
                                                        ? 'text-muted'
                                                        : 'cursor-pointer'
                                                        } ${day.day === todayDate &&
                                                            !day.className?.includes('last-month')
                                                            ? 'text-white fw-normal'
                                                            : ''
                                                        }`}
                                                    style={
                                                        day.day === todayDate &&
                                                            !day.className?.includes('last-month')
                                                            ? { backgroundColor: '#0A0043' }
                                                            : {}
                                                    }
                                                    onClick={() =>
                                                        !day.className?.includes('last-month') &&
                                                        handleDayClick(day.day)
                                                    }
                                                >
                                                    {day.day}
                                                </Col>
                                            ))}
                                        </Row>
                                    ))}
                                </Card.Body>
                            ) : (
                                <Card.Body>
                                    <Form.Group className="mb-3 d-flex justify-content-center">
                                        <Form.Control
                                            type="text"
                                            placeholder="What's the event?"
                                            value={eventText}
                                            onChange={(e) => setEventText(e.target.value)}
                                            style={{
                                                backgroundColor: '#0A0043',
                                                color: '#FFF',
                                                width: '100%',
                                                height: '50px',
                                                border: 'none',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </Form.Group>

                                    <div
                                        style={{ color: '#0A0043', marginTop: '50px' }}
                                        className="mb-3"
                                    >
                                        <p>
                                            Date: <span>{selectedDate}</span> &nbsp;&nbsp; <i className="bi bi-clock"></i>
                                        </p>
                                        <p style={{ marginTop: '20px' }}>
                                            Time: <span>{formatDateTime(currentTime)}</span> &nbsp; <i className="bi bi-calendar4"></i>
                                        </p>
                                        <p style={{ marginTop: '20px' }}>
                                            Address: <span>79 Bangna-Trad Road, Chonburi Province 20000</span>
                                        </p>
                                        <p style={{ marginTop: '20px' }}>
                                            Observations: <span>Be there 15 minutes earlier</span>
                                        </p>
                                    </div>

                                    <div
                                        style={{ gap: '70px', marginTop: '100px' }}
                                        className="d-flex justify-content-center"
                                    >
                                        <Button variant="success" onClick={handleBack}>
                                            Save
                                        </Button>
                                        <Button variant="danger" onClick={handleBack}>
                                            Dismiss
                                        </Button>
                                    </div>
                                </Card.Body>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container>

            <br />

            <div className='text-center text-white mt-5'>

                <h2 className='mb-4'> How to Add an Event </h2>
                <p> Select the date and time </p>
                <p> Write the event details </p>
                <p> Click Save to store the event or Dismiss to cancel </p>

            </div>


        </div>
    )
}

// Calendar data
const getDaysForWeek = (week) => {
    const data = {
        first: [
            { day: '28', className: 'last-month' },
            { day: '29', className: 'last-month' },
            { day: '30', className: 'last-month' },
            { day: '31', className: 'last-month' },
            { day: '01' },
            { day: '02' },
            { day: '03' },
        ],
        second: [
            { day: '04' },
            { day: '05' },
            { day: '06', className: 'event' },
            { day: '07' },
            { day: '08' },
            { day: '09' },
            { day: '10' },
        ],
        third: [
            { day: '11' },
            { day: '12' },
            { day: '13' },
            { day: '14' },
            { day: '15' },
            { day: '16' },
            { day: '17' },
        ],
        fourth: [
            { day: '18' },
            { day: '19' },
            { day: '20' },
            { day: '21' },
            { day: '22' },
            { day: '23' },
            { day: '24' },
        ],
        fifth: [
            { day: '25' },
            { day: '26' },
            { day: '27' },
            { day: '28' },
            { day: '29' },
            { day: '30' },
            { day: '01', className: 'next-month' },
        ],
    }
    return data[week] || []
}

export default CreateEvent
