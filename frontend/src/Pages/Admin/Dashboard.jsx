import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Bảng điều khiển Admin</h2>
      <Row>
        <Col md={4}>
          <Card
            onClick={() => navigate("/admin/users")}
            style={{ cursor: "pointer" }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Người dùng</h4>
            <p>Quản lý người dùng hệ thống</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            onClick={() => navigate("/admin/cars")}
            style={{ cursor: "pointer" }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Xe</h4>
            <p>Danh sách và trạng thái các xe</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            onClick={() => navigate("/admin/contracts")}
            style={{ cursor: "pointer" }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Hợp đồng</h4>
            <p>Quản lý hợp đồng thuê xe</p>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card
            onClick={() => navigate("/admin/statCar")}
            style={{ cursor: "pointer" }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Lịch thuê</h4>
            <p>Quản lý lịch xe đang được thuê</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            onClick={() => navigate("/admin/statContracts")}
            style={{ cursor: "pointer" }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Thống kê hợp đồng</h4>
            <p>Số lượng hợp đồng được duyệt theo tháng</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            onClick={() => navigate("/admin/statRevenue")}
            style={{ cursor: "pointer" }}
            className="text-center p-3 shadow-sm"
          >
            <h4>Doanh thu</h4>
            <p>Doanh thu theo tháng cho toàn bộ người dùng</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
