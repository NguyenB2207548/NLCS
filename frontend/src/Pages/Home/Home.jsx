import React, { useState, useEffect } from "react";
import "./Home.css";
import { Button } from "react-bootstrap";
import CarCard from "../../components/CarCard"; // Bạn tạo CarCard hiển thị 1 xe
import { Link } from "react-router-dom";
import img_home from "../../assets/img_homepage.jpg";

const Home = () => {
  const [luxuryCars, setLuxuryCars] = useState([]);
  const [cheapCars, setCheapCars] = useState([]);

  // Lấy xe cao cấp
  const fetchLuxuryCars = async () => {
    try {
      const res = await fetch("http://localhost:3000/car/getLuxuryCars");
      const data = await res.json();
      setLuxuryCars(data);
    } catch (err) {
      console.error("Lỗi khi lấy xe cao cấp:", err);
    }
  };

  // Lấy xe giá rẻ
  const fetchCheapCars = async () => {
    try {
      const res = await fetch("http://localhost:3000/car/getCheapCars");
      const data = await res.json();
      setCheapCars(data);
    } catch (err) {
      console.error("Lỗi khi lấy xe giá rẻ:", err);
    }
  };

  useEffect(() => {
    fetchLuxuryCars();
    fetchCheapCars();
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section
        className="hero text-white text-center d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${img_home})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
          position: "relative",
          padding: "0 15px", // tránh text dính sát màn nhỏ
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
          }}
        ></div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <h1
            className="fw-bold mb-4"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3rem)", // co dãn theo màn hình
              fontWeight: "bold",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            Chào mừng đến với hệ thống thuê xe du lịch
          </h1>
          <p
            className="lead"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)", // tự động thu nhỏ
              marginBottom: "1.5rem",
            }}
          >
            Khám phá hàng trăm mẫu xe đa dạng, đặt xe nhanh chóng và an toàn
            tuyệt đối
          </p>
          <Link
            to="/products"
            style={{
              backgroundColor: "#ffc107",
              color: "#000",
              padding: "12px 28px",
              border: "none",
              borderRadius: "50px",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              display: "inline-block",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Bắt đầu khám phá
          </Link>
        </div>
      </section>

      {/* Xe cao cấp */}
      <section className="py-5 xecaocap">
        <h2
          className="mb-4 fw-bold text-center"
          style={{
            fontSize: "2.2rem",
            // color: "#ff6f00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "2.4rem" }}>🚗</span>
          Xe cao cấp
        </h2>
        <div className="container">
          <div className="row">
            {luxuryCars.map((car) => (
              <div key={car.carID} className="col-md-6 col-lg-3 mb-4">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Xe giá rẻ */}
      <section className="py-4 xegiare">
        <h2
          className="mb-4 fw-bold text-center"
          style={{
            fontSize: "2.2rem",
            // color: "#0077b6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "2.4rem" }}>💰</span>
          Xe giá rẻ
        </h2>
        <div className="container">
          <div className="row">
            {cheapCars.map((car) => (
              <div key={car.carID} className="col-md-6 col-lg-3 mb-4">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
