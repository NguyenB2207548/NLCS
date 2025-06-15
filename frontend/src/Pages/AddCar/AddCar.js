import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddCar = () => {
    const [formData, setFormData] = useState({
        carname: '',
        license_plate: '',
        seats: '',
        fuel_type: '',
        pickup_location: '',
        price_per_date: '',
        brandID: '',
        img_URL: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/car', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization nếu có token
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            alert(result.message || "Thêm xe thành công");
        } catch (error) {
            console.error('Error:', error);
            alert('Lỗi khi gửi dữ liệu');
        }
    };

    return (
        <Container className="my-4 p-4 bg-light rounded-4 shadow-sm">
            <h2 className="mb-4 text-center fw-bold">Đăng Xe Cho Thuê</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Tên xe</Form.Label>
                        <Form.Control type="text" name="carname" onChange={handleChange} required />
                    </Col>
                    <Col>
                        <Form.Label>Biển số</Form.Label>
                        <Form.Control type="text" name="license_plate" onChange={handleChange} required />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Label>Số ghế</Form.Label>
                        <Form.Select name="seats" onChange={handleChange} required>
                            <option value="">Chọn số ghế</option>
                            <option value="4">4 chỗ</option>
                            <option value="5">5 chỗ</option>
                            <option value="7">7 chỗ</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Label>Loại nhiên liệu</Form.Label>
                        <Form.Select name="fuel_type" onChange={handleChange} required>
                            <option value="">Chọn nhiên liệu</option>
                            <option value="Xăng">Xăng</option>
                            <option value="Dầu">Dầu</option>
                            <option value="Điện">Điện</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Label>Vị trí</Form.Label>
                        <Form.Control type="text" name="pickup_location" onChange={handleChange} required />
                    </Col>
                    <Col>
                        <Form.Label>Giá thuê/ngày (VNĐ)</Form.Label>
                        <Form.Control type="number" name="price_per_date" onChange={handleChange} required />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Label>Hãng xe (Brand ID)</Form.Label>
                        <Form.Control type="number" name="brandID" onChange={handleChange} required />
                    </Col>
                    <Col>
                        <Form.Label>Link hình ảnh</Form.Label>
                        <Form.Control type="text" name="img_URL" onChange={handleChange} required />
                    </Col>
                </Row>

                <Button type="submit" className="mt-3 w-100 button-timkiem">
                    Đăng xe
                </Button>
            </Form>
        </Container>
    );
};

export default AddCar;
