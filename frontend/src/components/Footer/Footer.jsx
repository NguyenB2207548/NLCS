import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-4">
      <div className="container">
        <p className="mb-1">
          &copy; 2025 Hệ thống thuê xe du lịch tự lái. All rights reserved.
        </p>
        <div>
          <Link to="/about" className="text-muted me-3">
            Giới thiệu
          </Link>
          <Link to="/contact" className="text-muted me-3">
            Liên hệ
          </Link>
          <Link to="/policy" className="text-muted">
            Chính sách
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
