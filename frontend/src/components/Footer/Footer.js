import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer text-dark pt-5 pb-4">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h6 className="fw-bold mb-3">CÔNG TY TNHH 3P RETAIL</h6>
            <p>MST: 0317718600</p>
          </Col>

          <Col md={4} className="mb-4">
            <h6 className="fw-bold mb-3 text-primary border-bottom border-primary d-inline-block">LIÊN HỆ</h6>
            <p><FaPhone className="me-2" />092.777.1919</p>
            <p><FaEnvelope className="me-2" />otod.vn@gmail.com</p>
            <p><FaMapMarkerAlt className="me-2" />19 Tạ Hiện, P. Thạnh Mỹ Lợi, TP. Thủ Đức</p>
          </Col>

          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3 text-primary border-bottom border-primary d-inline-block">Chính Sách</h6>
            <ul className="list-unstyled">
              <li>Chính sách và quy định</li>
              <li>Quy chế hoạt động</li>
              <li>Hướng dẫn thanh toán</li>
              <li>Hỏi và trả lời</li>
            </ul>
          </Col>

          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3 text-primary border-bottom border-primary d-inline-block">Tìm Hiểu Thêm</h6>
            <ul className="list-unstyled">
              <li>Hướng dẫn chung</li>
              <li>Hướng dẫn đặt xe</li>
              <li>Bảo mật thông tin</li>
              <li>Giải quyết tranh chấp</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
