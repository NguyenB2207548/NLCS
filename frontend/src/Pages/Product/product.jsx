import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import CarList from "../../components/CarList";

const Products = () => {
  const [location, setLocation] = useState("");
  const [seat, setSeat] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();

    // validate ngày
    if (startDate && !endDate) {
      alert("Vui lòng chọn ngày kết thúc khi đã chọn ngày bắt đầu!");
      return;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!");
      return;
    }

    setFilters({ location, seat, startDate, endDate });
  };

  return (
    <div className="container py-4">
      <Form
        className="filter-form gx-2 gy-2 p-4 bg-white rounded-4 shadow-sm mb-4 mx-auto"
        onSubmit={handleSearch}
        style={{ maxWidth: "800px" }}
      >
        {/* Hàng 1: vị trí + số chỗ */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <Form.Select
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              className="py-2"
            >
              <option value="">Tất cả vị trí</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </Form.Select>
          </div>

          <div className="col-12 col-md-6">
            <Form.Select
              onChange={(e) => setSeat(e.target.value)}
              value={seat}
              className="py-2"
            >
              <option value="">Tất cả số chỗ</option>
              <option value="4">4 chỗ</option>
              <option value="5">5 chỗ</option>
              <option value="7">7 chỗ</option>
              <option value="9">9 chỗ</option>
              <option value="16">16 chỗ</option>
            </Form.Select>
          </div>
        </div>

        {/* Hàng 2: ngày bắt đầu + ngày kết thúc */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-2"
            />
          </div>
          <div className="col-12 col-md-6">
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-2"
              min={startDate || undefined} // chỉ cho phép chọn ngày >= startDate
              required={!!startDate} // bắt buộc khi đã chọn ngày bắt đầu
            />
          </div>
        </div>

        {/* Hàng 3: nút tìm kiếm */}
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <Button
              type="submit"
              className="btn fw-bold rounded-3 px-4 py-2"
              style={{ background: "#043c78" }}
            >
              🔍 Tìm kiếm
            </Button>
          </div>
        </div>
      </Form>

      {/* danh sách xe */}
      <CarList filters={filters} />
    </div>
  );
};

export default Products;
