import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';


const CreateRental = () => {
    const { id: carID } = useParams();
    const [carInfo, setCarInfo] = useState(null);
    const [rental_start_date, setStartDate] = useState('');
    const [rental_end_date, setEndDate] = useState('');
    const [renterName, setRenterName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarInfo = async () => {
            try {
                const res = await fetch(`http://localhost:3000/car/detail/${carID}`);
                const result = await res.json();
                if (res.ok) {
                    setCarInfo(result);
                } else {
                    alert(result.message || "Không tìm thấy thông tin xe");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin xe:", error);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRenterName(decoded.fullname || "Người dùng");
            } catch (err) {
                console.error("Không thể decode token:", err);
            }
        }

        fetchCarInfo();
    }, [carID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Bạn cần đăng nhập để thuê xe");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/rental/${carID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rental_start_date, rental_end_date })
            });

            const result = await res.json();
            if (res.ok) {
                alert(result.message || "Thuê xe thành công");
                navigate("/");
            } else {
                alert(result.message || "Lỗi khi thuê xe");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu thuê xe:", error);
            alert("Lỗi máy chủ");
        }
    };

    return (
        <Container className="mt-5 p-4 bg-light rounded-4 shadow">
            <h2 className="text-center fw-bold mb-4">Đăng ký thuê xe</h2>
            {carInfo ? (
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Người thuê</Form.Label>
                            <Form.Control value={renterName} disabled />
                        </Col>
                        <Col>
                            <Form.Label>Tên xe</Form.Label>
                            <Form.Control value={carInfo.carname} disabled />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Biển số</Form.Label>
                            <Form.Control value={carInfo.license_plate} disabled />
                        </Col>
                        <Col>
                            <Form.Label>Số chỗ</Form.Label>
                            <Form.Control value={carInfo.seats} disabled />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Chủ xe</Form.Label>
                            <Form.Control value={carInfo.ownerName || 'Không rõ'} disabled />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Ngày bắt đầu thuê</Form.Label>
                            <Form.Control
                                type="date"
                                value={rental_start_date}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Ngày kết thúc thuê</Form.Label>
                            <Form.Control
                                type="date"
                                value={rental_end_date}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </Col>
                    </Row>
                    <Button type="submit" className="w-100 btn-primary">Xác nhận thuê xe</Button>
                </Form>
            ) : (
                <p>Đang tải thông tin xe...</p>
            )}
        </Container>
    );
};

export default CreateRental;
