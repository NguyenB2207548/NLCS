import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const ContractProfile = () => {
    const [contracts, setContracts] = useState([]);
    const [contractStats, setContractStats] = useState({});

    const fetchContracts = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/rental/getContractOwner`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setContracts(data))
            .catch((err) => console.error('Lỗi khi gọi API:', err));
    };

    const fetchStats = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/rental/getStatsOfOwner', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setContractStats(data))
            .catch(err => console.error('Lỗi thống kê hợp đồng:', err));
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
                fetchStats();
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

    useEffect(() => {
        fetchContracts();
        fetchStats();
    }, []);

    return (
        <div className="p-4">
            {contractStats && (
                <div className="mb-4">
                    <h5 className="fw-bold mb-3">Thống kê hợp đồng</h5>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h6 className="text-muted">Tổng số hợp đồng</h6>
                                    <h4>{contractStats.total || 0}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h6 className="text-muted">Đang chờ duyệt</h6>
                                    <h4 className="text-warning">{contractStats.pending || 0}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h6 className="text-muted">Đang hoạt động</h6>
                                    <h4 className="text-success">{contractStats.active || 0}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h6 className="text-muted">Đã hoàn thành</h6>
                                    <h4 className="text-primary">{contractStats.completed || 0}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h6 className="text-muted">Đã từ chối</h6>
                                    <h4 className="text-danger">{contractStats.cancelled || 0}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {contracts.length === 0 ? (
                <div className="text-center text-muted mt-4">
                    Bạn chưa có hợp đồng cho thuê xe nào.
                </div>
            ) : (
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
                                <td>
                                    {contract.contract_status === 'pending' && (
                                        <span className="badge bg-warning text-dark">Chờ duyệt</span>
                                    )}
                                    {contract.contract_status === 'active' && (
                                        <span className="badge bg-success">Đã duyệt</span>
                                    )}
                                    {contract.contract_status === 'cancelled' && (
                                        <span className="badge bg-danger">Đã từ chối</span>
                                    )}
                                    {contract.contract_status === 'completed' && (
                                        <span className="badge bg-secondary">Đã thanh toán</span>
                                    )}
                                </td>
                                <td>
                                    {contract.contract_status === 'pending' && (
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
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ContractProfile;
