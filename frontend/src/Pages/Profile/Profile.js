import React, { useEffect, useState } from "react";
import { Card, Button, Form, Tab, Tabs, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [cars, setCars] = useState([]);
    const [contracts, setContracts] = useState([]);

    const navigate = useNavigate();


    const fetchContracts = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/rental/getContractOwner`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setContracts(data);
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));
    };

    const fetchCars = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/car/getAllCarOfUser`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setCars(data);
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));
    };


    useEffect(() => {
        // Giả lập fetch API
        const mockUser = {
            fullname: "Chi Nguyen",
            phone_number: "0987654321",
            email: "chi@example.com"
        };
        setUser(mockUser);
        setFormData(mockUser);

        fetchCars();
        fetchContracts();

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        alert("Cập nhật thành công!");
        setEditing(false);
        setUser(formData);
    };

    const handleApprove = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/rental/confirm/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchContracts();
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));

    }

    const handleReject = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/rental/reject/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchContracts();
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));

    }

    return (
        <Card className="p-4 shadow-sm w-75 mx-auto mt-4">
            <h3 className="mb-4 text-center">Hồ sơ người dùng</h3>

            <Tabs defaultActiveKey="info" className="mb-3">
                <Tab eventKey="info" title="Thông tin cá nhân">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullname"
                                value={formData.fullname || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                readOnly={!editing}
                            />
                        </Form.Group>

                        <div className="text-center">
                            {!editing ? (
                                <Button onClick={() => setEditing(true)}>Chỉnh sửa</Button>
                            ) : (
                                <Button onClick={handleSave}>Lưu thay đổi</Button>
                            )}
                        </div>
                    </Form>
                </Tab>

                <Tab eventKey="cars" title="Xe của tôi">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tên xe</th>
                                <th>Biển số</th>
                                <th>Số chỗ</th>
                                <th>Vị trí</th>
                                <th>Năm sản xuất</th>
                                <th>Loại nhiên liệu</th>
                                <th>Giá thuê</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.carID}>
                                    <td>{car.carname}</td>
                                    <td>{car.license_plate}</td>
                                    <td>{car.seats}</td>
                                    <td>{car.pickup_location}</td>
                                    <td>{car.year_manufacture}</td>
                                    <td>{car.fuel_type}</td>
                                    <td>{car.price_per_date}</td>
                                    <td>{car.car_status}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm">Sửa</Button>{' '}
                                        <Button variant="outline-danger" size="sm">Xóa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="text-center">
                        <Button onClick={() => navigate('/car/addCar')}>Thêm xe mới</Button>
                    </div>

                </Tab>

                <Tab eventKey="contracts" title="Hợp đồng thuê xe">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Người thuê</th>
                                <th>Liên hệ</th>
                                <th>Tên xe</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Tổng tiền</th>
                                {/* <th>Trạng thái</th> */}
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map(contract => (
                                <tr key={contract.contractID}>
                                    <td>{contract.fullname}</td>
                                    <td>{contract.phone_number}</td>
                                    <td>{contract.carname}</td>
                                    <td>{new Date(contract.rental_start_date).toLocaleDateString()}</td>
                                    <td>{new Date(contract.rental_end_date).toLocaleDateString()}</td>
                                    <td>{contract.total_price.toLocaleString()}</td>
                                    {/* <td>{contract.contract_status}</td> */}

                                    <td>
                                        {contract.contract_status === 'pending' ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleApprove(contract.contractID)}
                                                >
                                                    Duyệt
                                                </Button>{' '}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleReject(contract.contractID)}
                                                >
                                                    Từ chối
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {contract.contract_status === 'active' && (
                                                    <span className="text-success">Đã duyệt</span>
                                                )}
                                                {contract.contract_status === 'cancelled' && (
                                                    <span className="text-danger">Đã từ chối</span>
                                                )}
                                                {contract.contract_status === 'completed' && (
                                                    <span className="text-secondary">Đã hoàn thành</span>
                                                )}
                                            </>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Tab>
            </Tabs>
        </Card>
    );
};

export default Profile;
