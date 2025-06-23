import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const UserDetailModal = ({ show, handleClose, userID }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!show || !userID) return;
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/admin/user/detail/${userID}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi lấy thông tin người dùng');
        
        return res.json();
      })
      .then(data => {
        setUser(data)
      })
      .catch(err => {
        console.error(err);
        setUser(null); 
      });
  }, [show, userID]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <>
            <p><strong>Họ tên:</strong> {user.fullname}</p>
            <p><strong>Ngày sinh:</strong> {new Date(user.date_of_birth).toLocaleDateString('vi-VN')}</p>
            <p><strong>Số điện thoại:</strong> {user.phone_number}</p>
            <p><strong>Vai trò:</strong> {user.admin ? 'Quản trị viên' : 'Người dùng'}</p>
            <p><strong>Trạng thái:</strong> {user.is_active ? 'Đang kích hoạt' : 'Vô hiệu hóa'}</p>
          </>
        ) : (
          <p className="text-danger">Không tìm thấy người dùng hoặc có lỗi khi tải dữ liệu.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
