import React, { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';

const Cars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/admin/car/getAllCar', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (carID) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;

    fetch(`http://localhost:3000/admin/car/${carID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setCars(cars.filter(car => car.carID !== carID));
      });
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Quản lý xe</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên xe</th>
            <th>Biển số</th>
            <th>Giá</th>
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
              <td>{car.price_per_date}</td>
              <td>{car.car_status}</td>
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