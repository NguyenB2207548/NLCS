import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditCarModal = ({ show, handleClose, carData, onSave }) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (carData) {
            setForm({
                carname: carData.carname || '',
                license_plate: carData.license_plate || '',
                year_manufacture: carData.year_manufacture || '',
                seats: carData.seats || '',
                fuel_type: carData.fuel_type || '',
                pickup_location: carData.pickup_location || '',
                price_per_date: carData.price_per_date || '',
                car_status: carData.car_status || 'available',
                brandID: carData.brandID || '',
            });
        }
    }, [carData]);

    if (!carData) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/car/${carData.carID}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.message === "Chỉnh sửa thành công") {
                    onSave(); // reload car list
                    handleClose();
                }
            })
            .catch(err => {
                console.error('Lỗi khi cập nhật xe:', err);
                alert('Lỗi khi cập nhật');
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa thông tin xe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Tên xe</Form.Label>
                        <Form.Control name="carname" value={form.carname || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Biển số</Form.Label>
                        <Form.Control name="license_plate" value={form.license_plate || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Năm sản xuất</Form.Label>
                        <Form.Control name="year_manufacture" type="number" value={form.year_manufacture || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Số chỗ</Form.Label>
                        <Form.Control name="seats" type="number" value={form.seats || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Loại nhiên liệu</Form.Label>
                        <Form.Control name="fuel_type" value={form.fuel_type || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Vị trí</Form.Label>
                        <Form.Control name="pickup_location" value={form.pickup_location || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Giá thuê mỗi ngày</Form.Label>
                        <Form.Control name="price_per_date" type="number" value={form.price_per_date || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Select name="car_status" value={form.car_status || ''} onChange={handleChange}>
                            <option value="available">Sẵn sàng</option>
                            <option value="rented">Đang thuê</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>ID hãng xe</Form.Label>
                        <Form.Control name="brandID" value={form.brandID || ''} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu thay đổi</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCarModal;
