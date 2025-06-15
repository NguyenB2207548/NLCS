import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const LoginModal = ({ show, handleClose, handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submitHandler = () => {
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    handleLogin(username, password);
    setUsername('');
    setPassword('');
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fs-4">Đăng nhập</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label className="fw-semibold">Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-between px-4 pb-4 border-0">
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={submitHandler}>
          Đăng nhập
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
