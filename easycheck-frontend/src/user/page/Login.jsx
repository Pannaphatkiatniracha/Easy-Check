import { InputGroup, FormControl, Button, Modal } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import Api from '../../Api';

const Login = ({ setToken, setRole }) => {
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');

        try {
            if (!username || !password) {
                setError('กรุณากรอก Employee ID และ Password');
                setShowModal(true);
                return;
            }

            const response = await Api.post('/auth/login', {
                id_employee: username,
                password: password
            });

            console.log("LOGIN RESPONSE =", response.data);

            const { token, refreshToken, role, user } = response.data;

            const isAdmin = role === "admin" || role === "super admin";

            if (isAdmin) {
                throw new Error("Admins must login through the Admin page");
            }

            let mappedRole = "user";

            if (role === "approver") {
                mappedRole = "approver";
            } else {
                mappedRole = "user";
            }

            sessionStorage.setItem('token', token || '');
            sessionStorage.setItem('role', mappedRole);
            sessionStorage.setItem('refreshToken', refreshToken || '');

            sessionStorage.setItem('user', JSON.stringify(user || {}));
            sessionStorage.setItem('id_employee', user?.id_employee || username);

            console.log("SAVED user =", sessionStorage.getItem("user"));
            console.log("SAVED id_employee =", sessionStorage.getItem("id_employee"));

            setToken(token);
            setRole(mappedRole);

            navigate('/home', { replace: true });

        } catch (err) {
            console.error("LOGIN ERROR =", err);
            const errMsg = err.response?.data?.message || err.message || 'Login failed';
            setError(errMsg);
            setShowModal(true);
        }
    };

    // ให้มันแทนการกดปุ่มล้อคอินด้วยปุ่ม enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className='app-container'>
            <div className="w-25 mx-auto mt-28">
                <img src="/easycheck/img/who.webp" className="rounded-circle w-100 h-100" />
            </div>

            <div className='d-flex flex-column align-items-center'>
                <div className='mt-12 w-75'>
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-person-fill"></i>
                        </InputGroup.Text>
                        <FormControl
                            type='text'
                            placeholder='Employee ID'
                            value={username}
                            onChange={(e) => {
                                let enter = e.target.value.replace(/\D/g, "");
                                enter = enter.slice(0, 6);
                                setUsername(enter);
                            }}
                            onKeyDown={handleKeyPress}
                        />
                    </InputGroup>
                </div>

                <div className='mt-6 w-75'>
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-lock-fill"></i>
                        </InputGroup.Text>
                        <FormControl
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                    </InputGroup>

                    <Link to="/forgotpassword" className='text-decoration-none'>
                        <p className='text-white text-end fw-lighter mt-2'>Forget Password?</p>
                    </Link>

                    {error && <p className="text-danger text-center fw-semibold mt-4">{error}</p>}
                </div>
            </div>

            <div className='text-center mt-14'>
                <Button
                    className='rounded-3 w-25 fw-semibold'
                    style={{ backgroundColor: '#636CCB', border: 'none' }}
                    onClick={handleLogin}
                >
                    LOGIN
                </Button>
            </div>

            <Modal
                size="sm"
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                backdrop={true}
                keyboard={true}
            >
                <Modal.Body className="text-center py-5">
                    <i className="bi-x-circle-fill fs-1 text-danger"></i>
                    <h5 className="fw-bold mt-2">Login Failed</h5>
                    <p>{error}</p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Login;