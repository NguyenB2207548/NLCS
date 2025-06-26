import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Lấy danh sách xe
    fetch('http://localhost:3000/admin/car/getAllCar', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error(err));

    // Lấy thống kê xe
    fetch('http://localhost:3000/car/admin/getAllCarStats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Lỗi khi lấy thống kê:', err));
  }, []);

  const handleDelete = (carID) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;

    fetch(`http://localhost:3000/admin/car/delete/${carID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Xóa thành công')
          setCars(prev => prev.filter(car => car.carID !== carID));
        else alert(data.message);
      });
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-center">Quản lý xe</h3>

      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h5>Tổng số xe</h5>
                <h3>{stats.total}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h5>Xe sẵn sàng</h5>
                <h3 className="text-success">{stats.available}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h5>Xe đang thuê</h5>
                <h3 className="text-warning">{stats.rented}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h5>Xe giá cao nhất</h5>
                {stats.maxPriceCar ? (
                  <>
                    <div><strong>{stats.maxPriceCar.carname}</strong></div>
                    <div>{Number(stats.maxPriceCar.price_per_date).toLocaleString()}₫/ngày</div>
                  </>
                ) : (
                  <div>Không có</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên xe</th>
            <th>Biển số</th>
            <th>Số chỗ</th>
            <th>Năm sản xuất</th>
            <th>Nhiên liệu</th>
            <th>Vị trí</th>
            <th>Giá/ngày</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car.carID}>
              <td>{car.carID}</td>
              <td>{car.carname}</td>
              <td>{car.license_plate}</td>
              <td>{car.seats}</td>
              <td>{car.year_manufacture}</td>
              <td>{car.fuel_type}</td>
              <td>{car.pickup_location}</td>
              <td>{Number(car.price_per_date).toLocaleString()}₫</td>
              <td>
                {car.car_status === 'available' && <Badge bg="success">Sẵn sàng</Badge>}
                {car.car_status === 'rented' && <Badge bg="warning" text="dark">Đang thuê</Badge>}
                {car.car_status === 'maintenance' && <Badge bg="secondary">Đang bảo trì</Badge>}
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(car.carID)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Cars;
