import React, { useEffect, useState } from "react";
import { Card, Button, Form, Tab, Tabs, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import EditUserModal from '../../components/Modal/EditUserModal'
import EditCarModal from "../../components/Modal/EditCarModal";
import './Profile.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {

    const [revenueStats, setRevenueStats] = useState({
        totalRevenue: 12100000,
        monthly: [
            { month: '01/2025', total: 1200000 },
            { month: '02/2025', total: 1500000 },
            { month: '03/2025', total: 1800000 },
            { month: '04/2025', total: 2000000 },
            { month: '05/2025', total: 1500000 },
            { month: '06/2025', total: 3100000 },
        ]
    });


    const [formData, setFormData] = useState({});
    const [cars, setCars] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditCarModal, setShowEditCarModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [carStats, setCarStats] = useState({
        total: 0,
        available: 0,
        rented: 0,
        maxPriceCarName: '',
        maxPrice: 0
    });

    const [contractStats, setContractStats] = useState({
        total: 0,
        pending: 0,
        active: 0,
        cancelled: 0,
        completed: 0
    });

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
                if (Array.isArray(data)) {
                    setCars(data);
                } else {
                    setCars([]); // hoặc hiển thị thông báo không có xe
                }
            })

            .catch((err) => console.error('Lỗi khi gọi API:', err));
    };

    const fetchUser = () => {
        const token = localStorage.getItem('token');

        const decode = jwtDecode(token);
        const id = decode.id;

        fetch(`http://localhost:3000/user/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                const formattedData = {
                    ...data,
                    date_of_birth: data.date_of_birth?.split('T')[0] || '', // chỉ lấy yyyy-MM-dd
                };
                setFormData(formattedData);
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));

    };

    // STATS
    const fetchCarStats = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/car/getStatsOfUser`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCarStats({
                    total: data.total || 0,
                    available: data.available || 0,
                    rented: data.rented || 0,
                    maxPriceCarName: data.maxPriceCar?.carname || 'N/A',
                    maxPrice: data.maxPriceCar?.price_per_date || 0
                });
            })
            .catch(err => console.error('Lỗi khi lấy thống kê xe:', err));
    };

    const fetchContractStats = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/rental/getStatsOfOwner`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setContractStats({
                    total: data.total || 0,
                    pending: data.pending || 0,
                    active: data.active || 0,
                    cancelled: data.cancelled || 0,
                    completed: data.completed || 0
                });
            })
            .catch(err => console.error('Lỗi khi lấy thống kê hợp đồng:', err));
    };

    useEffect(() => {
        fetchCars();
        fetchContracts();
        fetchUser();
        fetchCarStats();
        fetchContractStats();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/user/update`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Chỉnh sửa thành công') {
                    alert('Cập nhật thành công');
                    setShowEditModal(false);
                } else {
                    alert('Cập nhật thất bại: ' + (data.message || 'Đã có lỗi xảy ra'));
                }
            })
            .catch(err => {
                console.error('Lỗi khi cập nhật:', err);
                alert('Lỗi khi cập nhật thông tin');
            });
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

    // CAR

    const handleDelete = (carID) => {
        if (!window.confirm("Bạn có chắc muốn xóa xe này?")) return;

        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/car/${carID}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.message !== 'Xóa thành công')
                    alert(data.message);
                else {
                    setCars(prev => prev.filter(item => item.carID !== carID));
                }
                // fetchCars();
            })
            .catch(err => {
                console.error('Lỗi khi xóa xe:', err);
                alert('Lỗi khi xóa xe');
            });
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
                                readOnly={!showEditModal}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number || ''}
                                onChange={handleChange}
                                readOnly={!showEditModal}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth || ''}
                                onChange={handleChange}
                                readOnly={!showEditModal}
                            />
                        </Form.Group>



                        <div className="text-center">
                            {!showEditModal ? (
                                <Button onClick={() => setShowEditModal(true)}>Chỉnh sửa</Button>
                            ) : (
                                <Button onClick={handleSave}>Lưu thay đổi</Button>
                            )}
                        </div>
                    </Form>
                </Tab>

                <Tab eventKey="cars" title="Xe của tôi">
                    <div className="mb-4">
                        <h5 className="fw-bold mb-3">Thống kê xe</h5>
                        <table className="table table-borderless table-sm w-auto">
                            <tbody>
                                <tr>
                                    <th className="text-primary text-nowrap">Tổng số xe:</th>
                                    <td>{carStats.total}</td>
                                </tr>
                                <tr>
                                    <th className="text-primary text-nowrap">Xe sẵn sàng:</th>
                                    <td>{carStats.available}</td>
                                </tr>
                                <tr>
                                    <th className="text-primary text-nowrap">Xe đang cho thuê:</th>
                                    <td>{carStats.rented}</td>
                                </tr>
                                <tr>
                                    <th className="text-primary text-nowrap">Xe có giá thuê cao nhất:</th>
                                    <td>{carStats.maxPriceCarName} ({carStats.maxPrice.toLocaleString()})</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <Table striped bordered hover responsive className="align-middle text-center">
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
                                    <td>{car.price_per_date.toLocaleString()}</td>
                                    <td>
                                        {car.car_status === 'available' ? 'Sẵn sàng' :
                                            car.car_status === 'rented' ? 'Đang thuê' :
                                                car.car_status}
                                    </td>
                                    <td>
                                        <Button className="m-1" variant="outline-primary" size="sm" onClick={() => {
                                            setSelectedCar(car);
                                            setShowEditCarModal(true);
                                        }}>Sửa</Button>

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(car.carID)}
                                        >
                                            Xóa
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="text-center mt-3">
                        <Button onClick={() => navigate('/car/addCar')}>Thêm xe mới</Button>
                    </div>

                </Tab>

                <Tab eventKey="contracts" title="Hợp đồng thuê xe">
                    <div className="mb-4">
                        <h5 className="fw-bold mb-3 ">Thống kê hợp đồng</h5>
                        <table className="table table-borderless table-sm w-auto">
                            <tbody>
                                <tr>
                                    <th className="text-primary text-nowrap">Tổng số hợp đồng:</th>
                                    <td>{contractStats.total}</td>
                                </tr>
                                <tr>
                                    <th className="text-primary text-nowrap">Đang chờ duyệt:</th>
                                    <td>{contractStats.pending}</td>
                                </tr>
                                <tr>
                                    <th className="text-primary text-nowrap">Đang hoạt động:</th>
                                    <td>{contractStats.active}</td>
                                </tr>
                                <tr>
                                    <th className="text-primary text-nowrap">Đã từ chối:</th>
                                    <td>{contractStats.cancelled}</td>
                                </tr>
                                <tr>
                                    <th className="text-primary text-nowrap">Đã hoàn thành:</th>
                                    <td>{contractStats.completed}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Table striped bordered hover className="mt-4">
                        <thead>
                            <tr>
                                <th>Người thuê</th>
                                <th>Liên hệ</th>
                                <th>Tên xe</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
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
                                    <td>{contract.contract_status}</td>

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
                                                    // <span className="text-success">Đã duyệt</span>
                                                    <span className="badge bg-success">Đã duyệt</span>
                                                )}
                                                {contract.contract_status === 'cancelled' && (
                                                    // <span className="text-danger">Đã từ chối</span>
                                                    <span className="badge bg-danger">Đã từ chối</span>
                                                )}
                                                {contract.contract_status === 'completed' && (
                                                    // <span className="text-secondary">Đã thanh toán</span>
                                                    <span className="badge bg-secondary">Đã thanh toán</span>
                                                )}
                                            </>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Tab>

                <Tab eventKey="revenue" title="Thống kê doanh thu">
                    <h6 className="fw-bold mt-4">Biểu đồ doanh thu</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueStats.monthly}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#4caf50" />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mb-4">
                        <h5 className="fw-bold mb-3">Tổng doanh thu</h5>
                        <p className="fs-5 text-success fw-semibold">{revenueStats.totalRevenue.toLocaleString()} ₫</p>
                    </div>

                    <h6 className="fw-bold mt-4">Doanh thu theo tháng</h6>
                    <Table striped bordered hover className="mt-2">
                        <thead>
                            <tr>
                                <th>Tháng</th>
                                <th>Tổng doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenueStats.monthly.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.month}</td>
                                    <td>{item.total.toLocaleString()} ₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>

            </Tabs>

            <EditUserModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                formData={formData}
                handleChange={handleChange}
                handleSave={handleSave}
            />

            <EditCarModal
                show={showEditCarModal}
                handleClose={() => setShowEditCarModal(false)}
                carData={selectedCar}
                onSave={fetchCars}
            />


        </Card>


    );
};

export default Profile;
