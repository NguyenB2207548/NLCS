import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const LoginModal = ({ show, handleClose, handleLogin, loginError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (show) {
      setUsername('');
      setPassword('');
      setLocalError('');
    }
  }, [show]);

  const submitHandler = () => {
    if (!username || !password) {
      setLocalError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLocalError('');
    handleLogin(username, password);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0 pb-1">
        <Modal.Title className="w-100 text-center fs-4">Đăng nhập</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4">
        {(localError || loginError) && (
          <Alert variant="danger" className="rounded-3 py-1 text-center">
            {localError || loginError}
          </Alert>
        )}

        <Form>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label className="fw-semibold">Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
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
        <Button
          variant="primary"
          onClick={submitHandler}
          style={{ minWidth: '100px' }}
        >
          Đăng nhập
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
