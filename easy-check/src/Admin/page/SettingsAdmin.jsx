import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

function SettingsAdmin() {
    return (
        <>

            <div style={{
                background: 'linear-gradient(to bottom, #3C467B, #6E80E1)',
            }}>

                <Container fluid className="min-vh-100 py-5">
                    <Row className="mb-4">
                        <Col className="text-center">
                            <i
                                className="bi bi-chevron-left position-absolute"
                                style={{ color: '#FFFF', fontSize: '30px', left: '20px', top: '50%', transform: 'translateY(-50%)' }}
                            ></i>
                            <h1 className="fw-bold" style={{ color: '#FFFF' }}>Settings</h1>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={6} className="d-flex flex-column gap-3 ">

                            {/* Notification */}

                            <div className="d-flex justify-content-between align-items-center shadow-sm px-3 py-2"
                                style={{ backgroundColor: '#0A0043', marginBottom: '20px', borderRadius: '8px' }}>
                                <div className="d-flex align-items-center gap-2 text-white">
                                    <i className="bi bi-bell-fill fs-4"></i> &nbsp;&nbsp;
                                    <span>Notification</span>
                                </div>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    label=""
                                />
                            </div>

                            {/* Dark Mode */}
                            <div className="d-flex justify-content-between align-items-center shadow-sm px-3 py-2"
                                style={{ backgroundColor: '#0A0043', marginBottom: '20px', borderRadius: '8px' }}>
                                <div className="d-flex align-items-center gap-2 text-white">
                                    <i className="bi bi-circle-half fs-4"></i> &nbsp;&nbsp;
                                    <span>Dark Mode</span>
                                </div>
                                <Form.Check type="switch" id="dark-mode-switch" label="" />
                            </div>

                            {/* Edit Profile */}
                            <Button
                                variant="link"
                                className="d-flex justify-content-between align-items-center text-decoration-none text-white shadow-sm px-3 py-2"
                                style={{ backgroundColor: '#0A0043', marginBottom: '20px', borderRadius: '8px' }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-pencil-fill fs-4"></i> &nbsp;&nbsp;
                                    <span>Edit Profile</span>
                                </div>
                                <i className="bi bi-chevron-right fs-4"></i>
                            </Button>

                            {/* User Permission */}
                            <Button
                                variant="link"
                                className="d-flex justify-content-between align-items-center text-decoration-none text-white shadow-sm px-3 py-2"
                                style={{ backgroundColor: '#0A0043', marginBottom: '20px', borderRadius: '8px' }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-person-fill-gear fs-4"></i> &nbsp;&nbsp;
                                    <span>User Permission</span>
                                </div>
                                <i className="bi bi-chevron-right fs-4"></i>
                            </Button>

                            {/* Privacy Policy */}
                            <Button
                                variant="link"
                                className="d-flex justify-content-between align-items-center text-decoration-none text-white shadow-sm px-3 py-2"
                                style={{ backgroundColor: '#0A0043', marginBottom: '20px', borderRadius: '8px' }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-shield-lock fs-4"></i> &nbsp;&nbsp;
                                    <span>Privacy Policy</span>
                                </div>
                                <i className="bi bi-chevron-right fs-4"></i>
                            </Button>

                            {/* Set Permission Area */}
                            <Button
                                variant="link"
                                className="d-flex justify-content-between align-items-center text-decoration-none text-white shadow-sm px-3 py-2"
                                style={{ backgroundColor: '#0A0043', marginBottom: '20px', borderRadius: '8px' }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-crosshair fs-4"></i> &nbsp;&nbsp;
                                    <span>Set Permission Area</span>
                                </div>
                                <i className="bi bi-chevron-right fs-4"></i>
                            </Button>

                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    );
}

export default SettingsAdmin;


