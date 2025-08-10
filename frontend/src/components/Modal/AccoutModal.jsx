import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AccountModal = ({ show, handleClose, handleLogout }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tài khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Chào mừng bạn!</p>
        <Button variant="danger" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AccountModal;
