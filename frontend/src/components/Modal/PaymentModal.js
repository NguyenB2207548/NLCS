import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const PaymentModal = ({ show, handleClose, contractID, contract, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!show) {
            setPaymentMethod("cash");
            setError(null);
            setLoading(false);
        }
    }, [show]);

    const handleConfirmPayment = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        fetch(`http://localhost:3000/pay/${contractID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                payment_method: paymentMethod,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "Pay successfully") {
                    onPaymentSuccess();
                    handleClose();
                } else {
                    setError(data.message || "Thanh toán thất bại");
                }
            })
            .catch((err) => {
                console.error("Lỗi thanh toán:", err);
                setError("Lỗi kết nối đến server");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* THÔNG TIN HỢP ĐỒNG */}
                {contract && (
                    <div className="mb-3">
                        <p><strong>Người thuê:</strong> {contract.fullname}</p>
                        <p><strong>Số điện thoại:</strong> {contract.phone_number}</p>
                        <p><strong>Tên xe:</strong> {contract.carname}</p>
                        <p><strong>Chủ xe:</strong> {contract.owner_fullname || "Chưa có"}</p>
                        <p><strong>Tổng tiền:</strong> {Number(contract.total_price).toLocaleString()} VND</p>
                    </div>
                )}

                <Form>
                    <Form.Group>
                        <Form.Label>Phương thức thanh toán</Form.Label>
                        <Form.Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cash">Tiền mặt</option>
                            <option value="bank_transfer">Chuyển khoản</option>
                            <option value="momo">MoMo</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleConfirmPayment} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Xác nhận"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentModal;
