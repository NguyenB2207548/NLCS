import React, { useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import PaymentModal from "../../components/Modal/PaymentModal";

const RentalHistory = () => {
  const [history, setHistory] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchRentalHistory = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/rental/getOfUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setDataLoaded(true);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy lịch sử thuê:", err);
        setDataLoaded(true);
      });
  };

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/rental/deleteContract/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.message === "Xóa thành công")
          setHistory((prev) => prev.filter((item) => item.contractID !== id));
      })
      .catch((err) => {
        console.error("Lỗi khi xóa:", err);
        alert("Lỗi khi xóa hợp đồng");
      });
  };

  const openPaymentModal = (contract) => {
    setSelectedContract(contract);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedContract(null);
  };

  const handlePaymentSuccess = () => {
    fetchRentalHistory(); // reload sau khi thanh toán thành công
  };

  const cancelContract = (contractID) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/rental/cancelContract/${contractID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.message === "Hủy thành công")
          setHistory((prev) =>
            prev.filter((item) => item.contractID !== contractID)
          );
      })
      .catch(() => alert("Lỗi server"));
  };

  return (
    <Card className="p-4 shadow-sm w-75 mx-auto mt-4">
      <h3 className="mb-4 text-center">Lịch sử thuê xe</h3>
      <Table striped bordered hover>
        <thead className="table-dark border-light">
          <tr>
            <th>Tên xe</th>
            <th>Chủ xe</th>
            <th>Liên hệ</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {!dataLoaded ? (
            <tr>
              <td colSpan="8" className="text-center">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : history.filter((item) => item.is_deleted === 0).length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                Không có hợp đồng nào
              </td>
            </tr>
          ) : (
            history
              .filter((item) => item.is_deleted === 0)
              .map((item) => (
                <tr key={item.contractID}>
                  <td>{item.carname}</td>
                  <td>{item.fullname}</td>
                  <td>{item.phone_number}</td>
                  <td>
                    {new Date(item.rental_start_date).toLocaleDateString()}
                  </td>
                  <td>{new Date(item.rental_end_date).toLocaleDateString()}</td>
                  <td>{item.total_price.toLocaleString()}</td>
                  <td>
                    {item.contract_status === "pending" && (
                      <span className="text-warning">Chờ duyệt</span>
                    )}
                    {item.contract_status === "active" && (
                      <span className="text-success">Đã được duyệt</span>
                    )}
                    {item.contract_status === "cancelled" && (
                      <span className="text-danger">Đã bị từ chối</span>
                    )}
                    {item.contract_status === "completed" && (
                      <span className="text-secondary">Đã thanh toán</span>
                    )}
                  </td>
                  <td>
                    {item.contract_status === "pending" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancelContract(item.contractID)}
                      >
                        Hủy đơn
                      </Button>
                    )}

                    {item.contract_status === "active" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openPaymentModal(item)}
                        >
                          {Number(item.amount || 0) > 0
                            ? "Thanh toán thêm"
                            : "Thanh toán"}
                        </Button>
                      </>
                    )}

                    {(item.contract_status === "completed" ||
                      item.contract_status === "cancelled") && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item.contractID)}
                      >
                        Xóa
                      </Button>
                    )}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </Table>

      <PaymentModal
        show={showPaymentModal}
        handleClose={closePaymentModal}
        contractID={selectedContract?.contractID}
        contract={selectedContract}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Card>
  );
};

export default RentalHistory;
