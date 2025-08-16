import React from "react";
import { Container, Card } from "react-bootstrap";

const PolicyPage = () => {
  return (
    <Container className="my-5 p-3">
      <Card className="shadow-sm p-4">
        <h2 className="mb-3">Chính sách & Điều khoản</h2>

        <h5>I. Điều kiện thuê xe</h5>
        <ul>
          <li>Người thuê từ 21 tuổi trở lên.</li>
          <li>Có CMND/CCCD và bằng lái B1/B2 còn hiệu lực.</li>
          <li>Không sử dụng xe cho mục đích trái pháp luật.</li>
        </ul>

        <h5>II. Quy trình đặt xe</h5>
        <ol>
          <li>Chọn xe và thời gian thuê.</li>
          <li>Xác nhận giá và điều kiện.</li>
          <li>Chờ chủ xe duyệt.</li>
          <li>Nhận thông báo khi hợp đồng được duyệt.</li>
          <li>Thanh toán khi trả xe</li>
        </ol>

        <h5>III. Giá & Phí</h5>
        <ul>
          <li>Tính theo ngày hiển thị trên xe.</li>
          <li>Phí vượt km, trễ trả, vệ sinh đặc biệt… có thể áp dụng.</li>
          <li>Thanh toán qua thẻ, ví điện tử, hoặc tiền mặt.</li>
        </ul>

        <p className="mt-4 text-muted fst-italic">
          *Vui lòng đọc kỹ và tuân thủ các điều khoản trước khi đặt xe.*
        </p>
      </Card>
    </Container>
  );
};

export default PolicyPage;
