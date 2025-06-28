import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const RentalModal = ({ show, handleClose, carInfo, onSuccess, suggestionsRef }) => {
  const [rental_start_date, setStartDate] = useState('');
  const [rental_end_date, setEndDate] = useState('');
  const [renterName, setRenterName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRenterName(decoded.fullname || "Người dùng");
      } catch (err) {
        console.error("Không thể decode token:", err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert("Bạn cần đăng nhập để thuê xe");

    try {
      const res = await fetch(`http://localhost:3000/rental/${carInfo.carID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rental_start_date, rental_end_date })
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message || 'Thuê xe thành công');
        handleClose();
        onSuccess?.();
      } else {
        if (result.message === 'Xe đã được đặt trong khoảng thời gian này') {
          alert(result.message);
          handleClose();

          setTimeout(() => {
            suggestionsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 250);
        }
      }
    } catch (error) {
      console.error("Lỗi gửi yêu cầu thuê xe:", error);
      alert("Lỗi máy chủ");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thuê xe: {carInfo?.carname}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Người thuê</Form.Label>
              <Form.Control value={renterName} disabled />
            </Col>
            <Col>
              <Form.Label>Biển số</Form.Label>
              <Form.Control value={carInfo?.license_plate} disabled />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Ngày bắt đầu thuê</Form.Label>
              <Form.Control type="date" value={rental_start_date} onChange={(e) => setStartDate(e.target.value)} required />
            </Col>
            <Col>
              <Form.Label>Ngày kết thúc thuê</Form.Label>
              <Form.Control type="date" value={rental_end_date} onChange={(e) => setEndDate(e.target.value)} required />
            </Col>
          </Row>

          <Button type="submit" className="w-100">Xác nhận thuê xe</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RentalModal;
