import React, { useEffect, useState } from "react";
import { Card, Button, Form, Tab, Tabs, Table } from "react-bootstrap";

const Profile = () => {
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [cars, setCars] = useState([]);
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        // Giả lập fetch API
        const mockUser = {
            fullname: "Chi Nguyen",
            phone_number: "0987654321",
            email: "chi@example.com"
        };
        setUser(mockUser);
        setFormData(mockUser);

        // Giả lập danh sách xe
        setCars([
            { id: 1, name: "Toyota Vios", license: "51A-12345", seat: 5, location: "Hồ Chí Minh", status: "Hoạt động" },
            { id: 2, name: "Kia Morning", license: "30G-67890", seat: 4, location: "Hà Nội", status: "Đang bảo trì" }
        ]);

        // Giả lập hợp đồng
        setContracts([
            { id: 1, renter: "Nguyen Van A", car: "Toyota Vios", from: "2025-06-01", to: "2025-06-03", total: "2.000.000đ", status: "Đã xác nhận" },
            { id: 2, renter: "Tran Thi B", car: "Kia Morning", from: "2025-06-10", to: "2025-06-12", total: "1.800.000đ", status: "Chờ xác nhận" }
        ]);
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
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.id}>
                                    <td>{car.name}</td>
                                    <td>{car.license}</td>
                                    <td>{car.seat}</td>
                                    <td>{car.location}</td>
                                    <td>{car.status}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm">Sửa</Button>{' '}
                                        <Button variant="outline-danger" size="sm">Xóa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="text-center">
                        <Button>Thêm xe mới</Button>
                    </div>
                </Tab>

                <Tab eventKey="contracts" title="Hợp đồng thuê xe">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Người thuê</th>
                                <th>Tên xe</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map(contract => (
                                <tr key={contract.id}>
                                    <td>{contract.renter}</td>
                                    <td>{contract.car}</td>
                                    <td>{contract.from}</td>
                                    <td>{contract.to}</td>
                                    <td>{contract.total}</td>
                                    <td>{contract.status}</td>
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
