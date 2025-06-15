import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


const RegisterModal = ({ show, handleClose, handleRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    date_of_birth: '',
    phone_number: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username || formData.username.length < 6 || /\s/.test(formData.username)) {
      newErrors.username = "Tên đăng nhập phải từ 6 kí tự trở lên, không chứa khoảng trắng.";
    }

    if (!formData.password || formData.password.length < 8 || /\s/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự và không chứa khoảng trắng.";
    }

    if (!formData.fullname || !/^[\p{L}0-9 ]+$/u.test(formData.fullname)) {
      newErrors.fullname = "Họ và tên chỉ được chứa chữ, số và khoảng trắng.";
    }

    if (!formData.phone_number || !/^\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại chỉ được chứa số.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleRegister(formData);
    setFormData({
      username: '',
      password: '',
      fullname: '',
      date_of_birth: '',
      phone_number: '',
    });
  };

  const handleCloseModal = () => {
    setFormData({
      username: '',
      password: '',
      fullname: '',
      date_of_birth: '',
      phone_number: '',
    });
    setErrors({});
    handleClose();
  };


  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đăng ký tài khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>


          <Form.Group className="mb-3" controlId="registerFullname">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập họ và tên"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              isInvalid={!!errors.fullname}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerDOB">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPhone">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập số điện thoại"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              isInvalid={!!errors.phone_number}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone_number}
            </Form.Control.Feedback>
          </Form.Group>


          <div className="d-grid">
            <Button variant="primary" type="submit">
              Đăng ký
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
