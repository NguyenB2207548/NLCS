import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Card, Row, Col } from 'react-bootstrap';
import UserDetailModal from '../../components/Modal/UserDetailModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    ownerUsers: 0,
    renterUsers: 0
  });

  const handleView = (id) => {
    setSelectedUserId(id);
    setShowDetail(true);
  };

  const fetchStats = () => {
    fetch('http://localhost:3000/user/admin/getUserStats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Lỗi khi lấy thống kê người dùng:', err));
  };

  useEffect(() => {
    fetch('http://localhost:3000/admin/user/getAllUser', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));

    fetchStats();
  }, []);

  const handleToggleStatus = (id) => {
    const user = users.find(u => u.userID === id);
    const action = user.is_active ? 'vô hiệu hóa' : 'kích hoạt';
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) return;

    fetch(`http://localhost:3000/admin/user/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Không thể tự vô hiệu hóa tài khoản của chính mình') {
          alert(data.message);
        }

        if (data.message.includes('thành công')) {
          setUsers(prev =>
            prev.map(user =>
              user.userID === id ? { ...user, is_active: !user.is_active } : user
            )
          );
        }
      });
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Quản lý người dùng</h3>

      {/* THỐNG KÊ */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Tổng người dùng</h6>
              <h4 className="text-primary">{stats.totalUsers}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Số người có xe cho thuê</h6>
              <h4 className="text-success">{stats.ownerUsers}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Số người đã thuê xe</h6>
              <h4 className="text-warning">{stats.renterUsers}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BẢNG NGƯỜI DÙNG */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userID}>
              <td>{user.userID}</td>
              <td>{user.fullname}</td>
              <td>{new Date(user.date_of_birth).toLocaleDateString('vi-VN')}</td>
              <td>{user.phone_number}</td>
              <td>{user.admin ? 'Quản trị viên' : 'Người dùng'}</td>
              <td>{user.is_active ? 'Đang kích hoạt' : 'Vô hiệu hóa'}</td>
              <td>
                <Button variant="info" size="sm" className="me-1" onClick={() => handleView(user.userID)}>
                  Xem
                </Button>
                <Button
                  variant={user.is_active ? "warning" : "success"}
                  size="sm"
                  className="me-1"
                  onClick={() => handleToggleStatus(user.userID)}
                >
                  {user.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <UserDetailModal
        show={showDetail}
        handleClose={() => setShowDetail(false)}
        userID={selectedUserId}
      />
    </Container>
  );
};

export default Users;
