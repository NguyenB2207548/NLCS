import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";
import CarList from "../../components/CarList";
import { Button, Form } from "react-bootstrap";

const Home = () => {
  const [location, setLocation] = useState("");
  const [seat, setSeat] = useState("");
  const [brand, setBrand] = useState("");
  const [filters, setFilters] = useState({});
  const [brands, setBrands] = useState([]);
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:3000/brand/getAll");
        const data = await res.json();
        setBrands(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hãng xe:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleSearch = () => {
    setFilters({
      location,
      seat,
      brand,
      sort,
    });
  };

  const locationState = useLocation();

  useEffect(() => {
    if (locationState.state?.reset) {
      setLocation("");
      setSeat("");
      setBrand("");
      setFilters({});
      setSort("");

      window.history.replaceState({}, document.title);
    }
  }, [locationState]);

  return (
    <div className="">
      <Form
        className="filter-form gx-2 gy-2 py-3 px-2 bg-light rounded-4 shadow-sm mb-3 "
        //
      >
        <div className="row mx-auto" style={{ maxWidth: "1000px" }}>
          <div className="col-12 col-sm-6 col-md-2">
            <Form.Select
              className="select-filter"
              aria-label="Vị trí"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            >
              <option value="">Tất cả vị trí</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </Form.Select>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <Form.Select
              className="select-filter"
              aria-label="Số chỗ"
              onChange={(e) => setSeat(e.target.value)}
              value={seat}
            >
              <option value="">Tất cả số chỗ</option>
              <option value="4">4 chỗ</option>
              <option value="5">5 chỗ</option>
              <option value="7">7 chỗ</option>
              <option value="9">9 chỗ</option>
              <option value="16">16 chỗ</option>
            </Form.Select>
          </div>

          <div className="col-12 col-sm-6 col-md-2">
            <Form.Select
              className="select-filter"
              aria-label="Hãng xe"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
            >
              <option value="">Tất cả hãng</option>
              {brands.map((b) => (
                <option key={b.brandID} value={b.brandname}>
                  {b.brandname}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <Form.Select
              className="select-filter"
              aria-label="Sắp xếp theo giá"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
            >
              <option value="">Sắp xếp theo giá</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </Form.Select>
          </div>

          <div className="col-12 col-md-2">
            <div className="d-grid">
              <Button
                className="form-control button-timkiem"
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </Form>

      <CarList filters={filters} />
    </div>
  );
};

export default Home;
