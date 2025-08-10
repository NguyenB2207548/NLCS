import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const PaymentModal = ({ show, handleClose, contractID, contract, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentDate, setPaymentDate] = useState('');
    const [amount, setAmount] = useState("");
    // const [paidAmount, setPaidAmount] = useState(0);

    useEffect(() => {
        if (!show) {
            setPaymentMethod("cash");
            setError(null);
            setLoading(false);
            setAmount("");
        }
        const today = new Date().toISOString().split('T')[0];
        setPaymentDate(today);
    }, [show]);

    const handleConfirmPayment = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        setError(null);

        // STRIPE
        if (paymentMethod === 'stripe') {

            try {
                const res = await fetch('http://localhost:3000/pay/stripe/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ contractID: contractID })
                });

                const data = await res.json();

                if (res.ok && data.url) {
                    window.location.href = data.url;
                } else {
                    setError(data.message || "Lỗi khi tạo phiên thanh toán");
                }
            } catch (err) {
                console.error("Stripe payment error:", err);
                setError("Lỗi kết nối tới Stripe");
            } finally {
                setLoading(false);
            }
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/pay/${contractID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    payment_method: paymentMethod,
                    amount: amount
                }),
            });

            const data = await res.json();

            if (res.ok) {
                onPaymentSuccess();
                handleClose();
            } else {
                setError(data.message || "Thanh toán thất bại");
            }
        } catch (err) {
            console.error("Lỗi thanh toán:", err);
            setError("Lỗi kết nối đến server");
        } finally {
            setLoading(false);
        }
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
                        <p><strong>Người thuê:</strong> {contract.rent_fullname}</p>
                        <p><strong>Tên xe:</strong> {contract.carname}</p>
                        <p><strong>Chủ xe:</strong> {contract.fullname || "Chưa có"}</p>
                        <p><strong>Liên hệ chủ xe:</strong> {contract.phone_number}</p>
                        <p><strong>Tổng tiền:</strong> {Number(contract.total_price).toLocaleString()} VND</p>
                        <p><strong>Số tiền đã thanh toán:</strong> {Number(contract.amount ?? 0).toLocaleString()} VND</p>
                        <p><strong>Ngày thanh toán:</strong> {paymentDate}</p>
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
                            <option value="stripe">Thanh toán online (Stripe)</option>
                        </Form.Select>
                    </Form.Group>

                    {paymentMethod === 'cash' && (
                        <Form.Group className="mt-3">
                            <Form.Label>Số tiền thanh toán</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số tiền (VND)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min={0}
                            />
                        </Form.Group>
                    )}
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
