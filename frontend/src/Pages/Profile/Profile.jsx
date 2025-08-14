import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import UserProfile from "./UserProfile";
import CarProfile from "./CarProfile";
import ContractProfile from "./ContractProfile";
import "./Profile.css";
const Profile = () => {
  const [activeSection, setActiveSection] = useState("user");

  const renderContent = () => {
    switch (activeSection) {
      case "user":
        return <UserProfile />;
      case "car":
        return <CarProfile />;
      case "contract":
        return <ContractProfile />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div
      className="d-flex"
      style={{ background: "linear-gradient(to right, #F5F5F5, #E0F7FA)" }}
    >
      <div
        style={{
          minWidth: "200px",
          minHeight: "100vh",
        }}
        className="sidebar-profile"
      >
        <Navbar className="flex-column p-3">
          <Navbar.Brand className="fw-bold fs-5 mb-3">
            Trang cá nhân
          </Navbar.Brand>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => setActiveSection("user")}
              active={activeSection === "user"}
            >
              Thông tin người dùng
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveSection("car")}
              active={activeSection === "car"}
            >
              Quản lý xe
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveSection("contract")}
              active={activeSection === "contract"}
            >
              Hợp đồng
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>

      <Container className="p-4 content border" fluid>
        {renderContent()}
      </Container>
    </div>
  );
};

export default Profile;
