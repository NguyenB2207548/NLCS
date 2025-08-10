import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

const AdminPage = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;

  const decoded = jwtDecode(token);
  if (decoded.admin === 0) return <Navigate to="/" />;

  return (
    <div className="d-flex">
      <div style={{ minWidth: '200px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Navbar className="flex-column p-3">
          <Navbar.Brand>Admin Panel</Navbar.Brand>
          <Nav className="flex-column">
            <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/admin/users">Người dùng</Nav.Link>
            <Nav.Link href="/admin/cars">Xe</Nav.Link>
            <Nav.Link href="/admin/contracts">Hợp đồng</Nav.Link>
          </Nav>
        </Navbar>
      </div>

      <Container className="p-4" fluid>
        <Outlet />
      </Container>
    </div>
  );
};

export default AdminPage;
