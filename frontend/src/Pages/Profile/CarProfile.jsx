import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditCarModal from "../../components/Modal/EditCarModal";

const CarProfile = () => {
  const [cars, setCars] = useState([]);
  const [carStats, setCarStats] = useState({});
  const [selectedCar, setSelectedCar] = useState(null);
  const [showEditCarModal, setShowEditCarModal] = useState(false);
  const navigate = useNavigate();

  const fetchCars = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/car/getAllCarOfUser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          setCars([]);
        }
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  };

  const fetchStats = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/car/getStatsOfUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCarStats({
          total: data.total || 0,
          available: data.available || 0,
          rented: data.rented || 0,
          maxPriceCarName: data.maxPriceCar?.carname || "",
          maxPrice: data.maxPriceCar?.price_per_date || 0,
        });
      })
      .catch((err) => console.error("Lỗi thống kê xe:", err));
  };

  useEffect(() => {
    fetchCars();
    fetchStats();
  }, []);

  const handleDelete = (carID) => {
    if (!window.confirm("Bạn có chắc muốn xóa xe này?")) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/car/${carID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message !== "Xóa thành công") alert(data.message);
        else {
          setCars((prev) => prev.filter((item) => item.carID !== carID));
        }
        // fetchCars();
      })
      .catch((err) => {
        console.error("Lỗi khi xóa xe:", err);
        alert("Lỗi khi xóa xe");
      });
  };

  return (
    <div className="p-4">
      {carStats && (
        <div className="mb-4">
          <h4 className="fw-bold mb-4">Thống kê xe</h4>
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body min-width-card">
                  <h6 className="text-muted">Tổng số xe</h6>
                  <h4>{carStats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body min-width-card">
                  <h6 className="text-muted">Xe sẵn sàng</h6>
                  <h4 className="text-success">{carStats.available}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body min-width-card">
                  <h6 className="text-muted">Xe đang cho thuê</h6>
                  <h4 className="text-warning">{carStats.rented}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card text-center shadow-sm">
                <div className="card-body min-width-card">
                  <h6 className="text-muted">Xe giá cao nhất</h6>
                  {carStats.maxPriceCarName ? (
                    <>
                      <div>
                        <strong>{carStats.maxPriceCarName}</strong>
                      </div>
                      <div>{carStats.maxPrice.toLocaleString()} ₫/ngày</div>
                    </>
                  ) : (
                    <div>Không có</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cars.length === 0 ? (
        <div className="text-center text-muted mt-4">
          Bạn chưa có xe nào. Nhấn <strong>“Thêm xe mới”</strong> để bắt đầu.
        </div>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle text-center mt-4 custom-table"
        >
          <thead className="table-dark">
            <tr>
              <th>Tên xe</th>
              <th>Biển số</th>
              <th>Số chỗ</th>
              <th>Vị trí</th>
              <th>Năm sản xuất</th>
              <th>Loại nhiên liệu</th>
              <th>Giá thuê</th>
              <th>Trạng thái</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.carID}>
                <td>{car.carname}</td>
                <td>{car.license_plate}</td>
                <td>{car.seats}</td>
                <td>{car.pickup_location}</td>
                <td>{car.year_manufacture}</td>
                <td>{car.fuel_type}</td>
                <td>{car.price_per_date.toLocaleString()} đ/ngày</td>
                <td>
                  {car.car_status === "available"
                    ? "Sẵn sàng"
                    : car.car_status === "rented"
                    ? "Đang thuê"
                    : "Đang bảo trì"}
                </td>
                <td>
                  <img
                    src={`http://localhost:3000/uploads/${car.img_URL}`}
                    alt={car.carname}
                    width={80}
                  />
                </td>
                <td>
                  <Button
                    className="m-1"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedCar(car);
                      setShowEditCarModal(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(car.carID)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="text-center mt-3">
        <Button onClick={() => navigate("/car/addCar")}>Thêm xe mới</Button>
      </div>

      <EditCarModal
        show={showEditCarModal}
        handleClose={() => setShowEditCarModal(false)}
        carData={selectedCar}
        onSave={fetchCars}
      />
    </div>
  );
};

export default CarProfile;
