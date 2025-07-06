import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CarList = ({ filters = {} }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (filters.location)
      queryParams.append("pickup_location", filters.location);
    if (filters.seat) queryParams.append("seats", filters.seat);
    if (filters.brand) queryParams.append("brandname", filters.brand);
    if (filters.sort) queryParams.append("sort", filters.sort);
    // queryParams.append('car_status', 'available');

    fetch(`http://localhost:3000/car?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, [filters]);

  return (
    <div className="py-4 list-cars">
      <h2 className="mb-4 fw-bold text-center title-list">Danh sách xe</h2>
      <Row>
        {cars.length > 0 ? (
          cars.map((car) => (
            <Col key={car.carID} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm rounded-4">
                <Card.Img
                  variant="top"
                  src={`http://localhost:3000/uploads/${car.img_URL}`}
                  className="car-img"
                />
                <Card.Body>
                  <Card.Title>{car.carname}</Card.Title>
                  <Card.Text>
                    Số ghế: <strong>{car.seats} chỗ</strong>
                  </Card.Text>
                  <Card.Text>
                    Vị trí: <strong>{car.pickup_location}</strong>
                  </Card.Text>
                  <Card.Text>
                    Giá thuê:{" "}
                    <strong>{car.price_per_date.toLocaleString()}đ/ngày</strong>
                  </Card.Text>
                  <Button
                    className="w-100 button-xemchitiet"
                    as={Link}
                    to={`/car/detail/${car.carID}`}
                  >
                    Xem chi tiết
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">Không tìm thấy xe phù hợp.</p>
        )}
      </Row>
    </div>
  );
};

export default CarList;
