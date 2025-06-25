import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import UserProfile from './UserProfile';
import CarProfile from './CarProfile';
import ContractProfile from './ContractProfile';
import RevenueProfile from './RevenueProfile';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('user'); // mặc định là Thông tin người dùng

  const renderContent = () => {
    switch (activeSection) {
      case 'user':
        return <UserProfile />;
      case 'car':
        return <CarProfile />;
      case 'contract':
        return <ContractProfile />;
      case 'revenue':
        return <RevenueProfile />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="d-flex">
      <div style={{ minWidth: '200px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Navbar className="flex-column p-3">
          <Navbar.Brand>Trang cá nhân</Navbar.Brand>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setActiveSection('user')} active={activeSection === 'user'}>
              Thông tin người dùng
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('car')} active={activeSection === 'car'}>
              Quản lý xe
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('contract')} active={activeSection === 'contract'}>
              Hợp đồng
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('revenue')} active={activeSection === 'revenue'}>
              Doanh thu
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>

      <Container className="p-4" fluid>
        {renderContent()}
      </Container>
    </div>
  );
};

export default Profile;
