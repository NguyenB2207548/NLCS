import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import './Header.css'
import LoginModal from "../Modal/LoginModal";
import AccountModal from "../Modal/AccoutModal";
import RegisterModal from "../Modal/RegisterModal";


const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [])

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
                    alert('Đăng nhập thành công');
                    setIsLoggedIn(true);
                    setShowLogin(false);
                } else {
                    alert(data.message);
                }
            })
            .catch(err => {
                console.error('Lỗi đăng nhập:', err);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setShowAccount(false);
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
            } else {
                alert(data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
        }
    };

    return (
        <Navbar expand="lg" sticky="top" className="nav-header">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="fw-bold">
                    Thuê Xe Tự Lái
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="p-3 text-nav">TRANG CHỦ</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="p-3 text-nav">HƯỚNG DẪN ĐẶT XE</Nav.Link>

                        {isLoggedIn ? (
                            <Nav.Link onClick={() => setShowAccount(true)} className="text-nav">
                                <i className="bi bi-person-circle icon-login"></i>
                            </Nav.Link>
                        ) : (
                            <>
                                <Nav.Link onClick={() => setShowLogin(true)} className="p-3 text-nav">Đăng nhập</Nav.Link>
                                <Nav.Link onClick={() => setShowRegister(true)} className="p-3 text-nav">Đăng ký</Nav.Link>
                            </>
                        )}

                    </Nav>
                </Navbar.Collapse>

                <LoginModal
                    show={showLogin}
                    handleClose={() => setShowLogin(false)}
                    handleLogin={handleLogin} />


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

}

export default Header;