import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";

const StatCar = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/admin/car/statCurrentRentedCars"
        );
        if (!res.ok) throw new Error("Failed to fetch contracts");
        const data = await res.json();
        setContracts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-3" />;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <div className="container mt-4">
      <h3>📅 Lịch xe đang được thuê</h3>
      {contracts.length === 0 ? (
        <Alert variant="info" className="mt-3">
          Hiện chưa có hợp đồng nào đang được thuê.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>STT</th>
              <th>Xe</th>
              <th>Biển số</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Người thuê</th>
              <th>Chủ xe</th>
              <th>Tổng tiền</th>
              <th>Số ngày còn lại</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((ct, index) => (
              <tr key={ct.contractID}>
                <td>{index + 1}</td>
                <td>{ct.carname}</td>
                <td>{ct.license_plate}</td>
                <td>{new Date(ct.rental_start_date).toLocaleDateString()}</td>
                <td>{new Date(ct.rental_end_date).toLocaleDateString()}</td>
                <td>{ct.renter_name}</td>
                <td>{ct.owner_name}</td>
                <td>{ct.total_price.toLocaleString()} đ</td>
                <td>
                  {ct.days_left > 0 ? (
                    <span className="text-success">{ct.days_left} ngày</span>
                  ) : (
                    <span className="text-danger">Hết hạn</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StatCar;
