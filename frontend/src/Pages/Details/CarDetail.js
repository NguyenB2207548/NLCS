import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPhoneAlt } from 'react-icons/fa';
import './CarDetail.css';

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/car/detail/${id}`)
      .then((res) => res.json())
      .then((data) => setCar(data))
      .catch((err) => console.error('Fetch car error:', err));
  }, [id]);

  if (!car) return <p>Đang tải...</p>;

  return (
    <Container className="py-5 border">
      <h2 className="fw-bold mb-3">{car.carname}</h2>
      <div className="mb-3">
        <span className="badge bg-light text-dark">Giao xe tận nơi</span>
      </div>

      <Row>
        <Col md={7}>
          {/* Ảnh chính */}
          <img
            src={`http://localhost:3000/uploads/${car.img_URL}`}
            alt={car.carname}
            className="rounded w-100 mb-3"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />

          {/* Ảnh phụ */}
          <Row>
            {car.images && car.images.length > 0 && car.images.map((img, index) => (
              <Col xs={6} md={4} key={index} className="mb-3">
                <img
                  src={`http://localhost:3000/uploads/${img.imgURL}`}
                  alt={`Ảnh phụ ${index + 1}`}
                  className="w-100 rounded"
                  style={{ height: '150px', objectFit: 'cover' }}
                />
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={5}>
          <div className="p-4 border rounded shadow-sm h-100">
            <h4 className="mb-3 fw-bold">GỌI ĐỂ TƯ VẤN</h4>
            <Row>
              <Col xs={6}>Biển số</Col>
              <Col xs={6}>{car.license_plate}</Col>
              <Col xs={6}>Chủ xe</Col>
              <Col xs={6}>{car.ownerName}</Col>
              <Col xs={6}>Hãng</Col>
              <Col xs={6}>{car.brandname}</Col>
              <Col xs={6}>Số ghế</Col>
              <Col xs={6}>{car.seats} chỗ</Col>
              <Col xs={6}>Nhiên liệu</Col>
              <Col xs={6}>{car.fuel_type || 'Xăng'}</Col>
              <Col xs={6}>Năm sản xuất</Col>
              <Col xs={6}>{car.year_manufacture}</Col>
              <Col xs={6}>Nơi nhận xe</Col>
              <Col xs={6}>{car.pickup_location}</Col>
              <Col xs={6}>Giá thuê</Col>
              <Col xs={6}>{car.price_per_date.toLocaleString()}đ/ngày</Col>
            </Row>

            <Link to={`/rental/${car.carID}`}>
              <Button className="w-100 mt-4 mb-3 button-datxe">
                Đặt xe ngay
              </Button>
            </Link>

            <div>
              <p className="text-center text-contract">Liên hệ càng sớm càng tốt</p>
            </div>

            <div className="bg-light p-3 rounded text-center">
              <FaPhoneAlt className="me-2 icon-phone" />
              <strong className="phone-number">{car.phone_number}</strong>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CarDetail;
