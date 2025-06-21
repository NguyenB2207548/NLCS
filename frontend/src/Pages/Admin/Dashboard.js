import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); 

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Bảng điều khiển Admin</h2>
      <Row>
        <Col md={4}>
          <Card
            onClick={() => navigate('/admin/users')}
            style={{ cursor: 'pointer' }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Người dùng</h4>
            <p>Quản lý người dùng hệ thống</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            onClick={() => navigate('/admin/cars')}
            style={{ cursor: 'pointer' }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Xe</h4>
            <p>Danh sách và trạng thái các xe</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            onClick={() => navigate('/admin/contracts')}
            style={{ cursor: 'pointer' }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Hợp đồng</h4>
            <p>Quản lý hợp đồng thuê xe</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
