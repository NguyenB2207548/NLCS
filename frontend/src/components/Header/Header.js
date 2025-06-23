import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import LoginModal from "../Modal/LoginModal";
import AccountModal from "../Modal/AccoutModal";
import RegisterModal from "../Modal/RegisterModal";

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [showAccount, setShowAccount] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [fullname, setFullname] = useState('');
    const [loginError, setLoginError] = useState('');

    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const user = JSON.parse(localStorage.getItem('user'));
            setFullname(user?.fullname || '');
        }
    }, []);

    const handleLogin = (username, password) => {
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setIsLoggedIn(true);
                    setShowLogin(false);
                    setLoginError('');
                    setFullname(data.user.fullname);

                    if (data.user.admin === 1) {
                        navigate('/admin');
                    } else {
                        navigate("/", { state: { reset: true } });
                    }

                } else {
                    setLoginError(data.message || 'Đăng nhập thất bại');
                }
            })
            .catch(err => {
                console.error('Lỗi đăng nhập:', err);
                setLoginError('Đã có lỗi xảy ra khi đăng nhập');
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setShowAccount(false);

        navigate("/", { state: { reset: true } });
    };

    const handleRegister = async (formData) => {
        try {
            const res = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('Đăng ký thành công!');
                setShowRegister(false);
                setShowLogin(true);

            } else {
                alert(data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
        }
    };

    const handleAddCarClick = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Bạn cần đăng nhập để đăng xe.");
            setShowLogin(true);
        } else {
            navigate("/car/addCar");
        }
    };

    return (
        <Navbar expand="lg" sticky="top" className="nav-header">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" state={{ reset: true }} className="fw-bold text-primary">
                    Thuê Xe Tự Lái
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="align-items-center ms-auto">
                        <Nav.Link as={Link} to="/" state={{ reset: true }} className="text-nav">TRANG CHỦ</Nav.Link>

                        <Nav.Link onClick={handleAddCarClick} className="text-nav">ĐĂNG XE</Nav.Link>

                        {isLoggedIn ? (

                            <Dropdown align="end">
                                <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent">
                                    <i className="bi bi-person-circle me-2" style={{ fontSize: '1.5rem', color: '#0d3b66' }}></i>
                                    <span className="fw-semibold text-dark">{fullname}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile">Xem hồ sơ</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/rental/history">Xem lịch sử thuê</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger">Đăng xuất</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Nav.Link onClick={() => {
                                    setShowLogin(true);
                                    setLoginError('');
                                }} className="text-nav">Đăng nhập</Nav.Link>
                                <Nav.Link onClick={() => setShowRegister(true)} className="text-nav">Đăng ký</Nav.Link>
                            </>
                        )}

                        {user?.admin === 1 && !location.pathname.startsWith('/admin') && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="ms-3"
                                onClick={() => navigate('/admin')}
                            >
                                🔙 Quay lại quản trị
                            </Button>
                        )}

                    </Nav>
                </Navbar.Collapse>

                <LoginModal
                    show={showLogin}
                    handleClose={() => {
                        setShowLogin(false);
                        setLoginError('');
                    }}
                    handleLogin={handleLogin}
                    loginError={loginError}
                />

                <AccountModal
                    show={showAccount}
                    handleClose={() => setShowAccount(false)}
                    handleLogout={handleLogout}
                />

                <RegisterModal
                    show={showRegister}
                    handleClose={() => setShowRegister(false)}
                    handleRegister={handleRegister}
                />
            </Container>
        </Navbar>
    );
};

export default Header;
