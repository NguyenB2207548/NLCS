import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Button } from "react-bootstrap";

const RentalHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy lịch sử thuê:", err);
                setLoading(false);
            });
    }, []);

    return (
        <Card className="p-4 shadow-sm w-75 mx-auto mt-4">
            <h3 className="mb-4 text-center">Lịch sử thuê xe</h3>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover>
                    <thead>
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
                        {history.map((item) => (
                            <tr key={item.contractID}>
                                <td>{item.carname}</td>
                                <td>{item.fullname}</td>
                                <td>{item.phone_number}</td>
                                <td>{new Date(item.rental_start_date).toLocaleDateString()}</td>
                                <td>{new Date(item.rental_end_date).toLocaleDateString()}</td>
                                <td>{item.total_price.toLocaleString()}</td>
                                <td>
                                    {item.contract_status === 'pending' && <span className="text-warning">Chờ duyệt</span>}
                                    {item.contract_status === 'active' && <span className="text-success">Đã được duyệt</span>}
                                    {item.contract_status === 'cancelled' && <span className="text-danger">Đã bị từ chối</span>}
                                    {item.contract_status === 'completed' && <span className="text-secondary">Đã hoàn thành</span>}
                                </td>

                                <td>
                                    {item.contract_status === 'pending' && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            // onClick={() => handleCancel(contract.contractID)}
                                        >
                                            Hủy đơn
                                        </Button>
                                    )}

                                    {item.contract_status === 'active' && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            // onClick={() => handlePayment(contract.contractID)}
                                        >
                                            Thanh toán
                                        </Button>
                                    )}

                                    {(item.contract_status === 'completed' ||
                                        item.contract_status === 'cancelled') && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                // onClick={() => handleDelete(contract.contractID)}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Card>
    );
};

export default RentalHistory;
