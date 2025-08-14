import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutPage = () => {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">
        Giới thiệu hệ thống thuê xe du lịch tự lái
      </h1>
      <p className="text-center text-muted mb-5">
        Chúng tôi cung cấp dịch vụ thuê xe du lịch tự lái tiện lợi, nhanh chóng
        và an toàn, với đa dạng các loại xe phù hợp cho mọi chuyến đi của bạn.
      </p>

      <Row className="gy-4">
        <Col md={4}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <Card.Title>Đa dạng xe</Card.Title>
              <Card.Text>
                Hệ thống của chúng tôi có nhiều loại xe từ sedan, SUV đến
                minivan, đáp ứng nhu cầu du lịch, công tác hay gia đình.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <Card.Title>Đặt xe nhanh chóng</Card.Title>
              <Card.Text>
                Chỉ với vài bước đơn giản, bạn có thể đặt xe trực tuyến, chọn
                thời gian, loại xe và nhận xác nhận ngay lập tức.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <Card.Title>An toàn & Tin cậy</Card.Title>
              <Card.Text>
                Mỗi xe đều được kiểm tra định kỳ, trang bị đầy đủ giấy tờ và bảo
                hiểm, đảm bảo bạn có chuyến đi an toàn và yên tâm.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="gy-4 mt-4">
        <Col md={4}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <Card.Title>Giá cả minh bạch</Card.Title>
              <Card.Text>
                Hệ thống hiển thị giá thuê rõ ràng theo ngày, không phí ẩn và dễ
                dàng thanh toán trực tuyến.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <Card.Title>Hỗ trợ 24/7</Card.Title>
              <Card.Text>
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi thắc
                mắc, từ đặt xe đến khi trả xe.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <Card.Title>Trải nghiệm linh hoạt</Card.Title>
              <Card.Text>
                Thuê xe tự lái giúp bạn chủ động về lịch trình, thoải mái khám
                phá các điểm du lịch yêu thích.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
