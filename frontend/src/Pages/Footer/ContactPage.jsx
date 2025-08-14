import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Liên hệ với chúng tôi</h1>
      <p className="text-center text-muted mb-5">
        Nếu bạn có thắc mắc hoặc cần hỗ trợ, hãy liên hệ trực tiếp qua điện
        thoại hoặc email.
      </p>

      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <p>
            <FaPhone className="me-2" /> 092.777.1919
          </p>
          <p>
            <FaEnvelope className="me-2" /> otod.vn@gmail.com
          </p>
          <p>
            <FaMapMarkerAlt className="me-2" /> 19 Tạ Hiện, P. Thạnh Mỹ Lợi, TP.
            Thủ Đức
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
