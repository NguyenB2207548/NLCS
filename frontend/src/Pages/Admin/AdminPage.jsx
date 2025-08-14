import React from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import "./Admin.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  const decoded = jwtDecode(token);
  if (decoded.admin === 0) return <Navigate to="/" />;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout">
      {/* Nội dung menu */}
      <div className="sidebar">
        <Navbar className="flex-column p-3">
          <Navbar.Brand className="fw-bold fs-5 mb-4 text-white">
            Admin Panel
          </Navbar.Brand>
          <Nav className="flex-column gap-2 flex-grow-1">
            <Nav.Link href="/admin/dashboard">📊 Dashboard</Nav.Link>
            <Nav.Link href="/admin/users">👤 Người dùng</Nav.Link>
            <Nav.Link href="/admin/cars">🚗 Xe</Nav.Link>
            <Nav.Link href="/admin/contracts">📄 Hợp đồng</Nav.Link>
          </Nav>
        </Navbar>

        <div className="p-3">
          <div className="fw-bold mb-2">{decoded.fullname || "Admin"}</div>
          <button
            className="btn btn-danger w-100 rounded-3"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <Container className="p-4" fluid>
        <Outlet />
      </Container>
    </div>
  );
};

export default AdminPage;
