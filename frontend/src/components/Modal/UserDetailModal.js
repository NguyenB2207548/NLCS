import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';

const UserDetailModal = ({ show, handleClose, userId }) => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('token');
    setLoading(true);

    Promise.all([
      fetch(`http://localhost:3000/admin/user/detail/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),

      fetch(`http://localhost:3000/admin/user/${userId}/cars`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),

      fetch(`http://localhost:3000/admin/user/${userId}/contracts`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ])
      .then(([userData, carData, contractData]) => {
        setUser(userData);
        setCars(carData);
        setContracts(contractData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thông tin chi tiết người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <>
            <h5>👤 Thông tin người dùng</h5>
            <p><strong>Họ tên:</strong> {user.fullname}</p>
            <p><strong>Ngày sinh:</strong> {new Date(user.date_of_birth).toLocaleDateString('vi-VN')}</p>
            <p><strong>Số điện thoại:</strong> {user.phone_number}</p>
            <p><strong>Vai trò:</strong> {user.admin ? 'Quản trị viên' : 'Người dùng'}</p>

            <hr />

            <h5>🚗 Danh sách xe sở hữu</h5>
            <Table size="sm" striped bordered>
              <thead>
                <tr>
                  <th>Tên xe</th>
                  <th>Biển số</th>
                  <th>Năm</th>
                  <th>Giá thuê</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.carID}>
                    <td>{car.carname}</td>
                    <td>{car.license_plate}</td>
                    <td>{car.year_manufacture}</td>
                    <td>{car.price_per_date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <hr />

            <h5>📄 Hợp đồng thuê xe</h5>
            <Table size="sm" striped bordered>
              <thead>
                <tr>
                  <th>Xe</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(c => (
                  <tr key={c.contractID}>
                    <td>{c.carname}</td>
                    <td>{new Date(c.rental_start_date).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(c.rental_end_date).toLocaleDateString('vi-VN')}</td>
                    <td>{c.contract_status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
