import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const CarCard = ({ car }) => {
  return (
    <Card
      className="h-100 border-0 rounded-4 shadow-sm transition-all hover-shadow"
      style={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
    >
      <Card.Img
        variant="top"
        src={`http://localhost:3000/uploads/${car.img_URL}`}
        alt={car.carname}
        style={{
          height: "200px",
          objectFit: "cover",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      />
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="fw-bold fs-5 text-dark">
          {car.carname}
        </Card.Title>
        <Card.Text className="text-secondary fw-bold mb-4">
          Giá:{" "}
          <span className="fw-bold">
            {car.price_per_date.toLocaleString()}₫
          </span>{" "}
          / ngày
        </Card.Text>

        <div className="mt-auto">
          <Link
            to={`/car/detail/${car.carID}`}
            className="btn w-100 fw-semibold rounded-3"
            style={{
              transition: "background-color 0.2s ease",
              background: "#043c78",
              color: "#fff",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#0652a0")}
            onMouseLeave={(e) => (e.target.style.background = "#043c78")}
          >
            Xem chi tiết
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;
