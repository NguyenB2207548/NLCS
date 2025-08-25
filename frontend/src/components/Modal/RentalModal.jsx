import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

const RentalModal = ({
  show,
  handleClose,
  carInfo,
  onSuccess,
  suggestionsRef,
}) => {
  const [rental_start_date, setStartDate] = useState("");
  const [rental_end_date, setEndDate] = useState("");
  const [renterName, setRenterName] = useState("");
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRenterName(decoded.fullname || "Người dùng");
      } catch (err) {
        console.error("Không thể decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (carInfo?.carID) {
      fetch(`http://localhost:3000/car/rentedPeriods/${carInfo.carID}`)
        .then((res) => res.json())
        .then((data) => {
          setBookedRanges(data || []);
        })
        .catch((err) =>
          console.error("Lỗi khi lấy danh sách thời gian thuê:", err)
        );
    }
  }, [carInfo?.carID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập để thuê xe");

    try {
      const res = await fetch(`http://localhost:3000/rental/${carInfo.carID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rental_start_date,
          rental_end_date,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Thuê xe thành công");
        handleClose();
        onSuccess?.();
      } else {
        if (
          result.message === "Xe đang được thuê trong khoảng thời gian này" ||
          result.message === "Xe đang bảo trì, không thể thuê vào lúc này" ||
          result.message === "Ngày thuê không hợp lệ" ||
          result.message ===
            "Bạn đã có hợp đồng thuê xe này trong cùng khoảng thời gian"
        ) {
          alert(result.message);
          handleClose();

          setTimeout(() => {
            suggestionsRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 250);
        }
      }
    } catch (error) {
      console.error("Lỗi gửi yêu cầu thuê xe:", error);
      alert("Lỗi máy chủ");
    }
  };

  useEffect(() => {
    if (show) {
      setStartDate("");
      setEndDate("");
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
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
              <Form.Label>Chủ xe</Form.Label>
              <Form.Control
                value={carInfo?.ownerName || "Không có thông tin"}
                disabled
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Nơi nhận xe</Form.Label>
              <Form.Control
                value={carInfo?.pickup_location || "Không có thông tin"}
                disabled
              />
            </Col>
            <Col>
              <Form.Label>Giá thuê (VNĐ/ngày)</Form.Label>
              <Form.Control
                value={
                  carInfo?.price_per_date?.toLocaleString("vi-VN") + " ₫" ||
                  "---"
                }
                disabled
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Ngày bắt đầu thuê</Form.Label>
              <Form.Control
                type="date"
                value={rental_start_date}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Label>Ngày kết thúc thuê</Form.Label>
              <Form.Control
                type="date"
                value={rental_end_date}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Label className="text-danger">📅 Lịch thuê xe:</Form.Label>
              <ul className="mb-2" style={{ paddingLeft: "1.2rem" }}>
                {carInfo?.car_status === "maintenance" ? (
                  <div className="text-warning">
                    🛠️ Xe đang bảo trì, tạm thời không khả dụng
                  </div>
                ) : bookedRanges.length === 0 ? (
                  <div className="text-success">
                    ✅ Xe đang sẵn sàng cho thuê
                  </div>
                ) : (
                  bookedRanges.map((range, idx) => (
                    <li key={idx}>
                      {new Date(range.rental_start_date).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      -{" "}
                      {new Date(range.rental_end_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </li>
                  ))
                )}
              </ul>
            </Col>
          </Row>

          <Button type="submit" className="w-100">
            Xác nhận thuê xe
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RentalModal;
