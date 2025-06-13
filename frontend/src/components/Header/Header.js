import React from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css'

const Header = () => {
    return (
        <Navbar bg="white" variant="light" expand="lg" sticky="top" className="shadow-sm nav-header">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold">
                    Thuê Xe Tự Lái
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="">TRANG CHỦ</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="">HƯỚNG DẪN ĐẶT XE</Nav.Link>
                        <Nav.Link as={Link} to="/auth/login" className="">Đăng nhập</Nav.Link>
                        <Nav.Link as={Link} to="/auth/register" className="">Đăng ký</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );

}

export default Header;