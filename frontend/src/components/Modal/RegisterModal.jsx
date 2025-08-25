import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RegisterModal = ({ show, handleClose, handleRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    date_of_birth: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    let newErrors = { ...errors };

    if (name === "username") {
      const usernameErrors = [];

      if (value.length < 6) {
        usernameErrors.push("Tên đăng nhập phải từ 6 ký tự trở lên.");
      }
      if (/\s/.test(value)) {
        usernameErrors.push("Không được chứa khoảng trắng.");
      }
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        usernameErrors.push(
          "Chỉ được chứa chữ cái và số, không chứa ký tự đặc biệt."
        );
      }

      if (usernameErrors.length > 0) {
        newErrors.username = usernameErrors;
      } else {
        delete newErrors.username;
      }
    }

    if (name === "fullname") {
      if (!/^[\p{L}0-9 ]+$/u.test(value)) {
        newErrors.fullname = "Họ và tên chỉ được chứa chữ, số và khoảng trắng.";
      } else {
        delete newErrors.fullname;
      }
    }

    if (name === "phone_number") {
      const phoneNumberErrors = [];

      if (!/^\d+$/.test(value)) {
        phoneNumberErrors.push("Chỉ được chứa chữ số.");
      }
      if (/\s/.test(value)) {
        phoneNumberErrors.push("Không được chứa khoảng trắng.");
      }
      if (value.length < 10 || value.length > 11) {
        phoneNumberErrors.push("Phải có độ dài từ 10 đến 11 chữ số.");
      }

      if (phoneNumberErrors.length > 0) {
        newErrors.phone_number = phoneNumberErrors;
      } else {
        delete newErrors.phone_number;
      }
    }

    if (name === "password") {
      const passwordErrors = [];

      if (value.length < 8 || value.length > 24) {
        passwordErrors.push("Mật khẩu phải từ 8 đến 24 ký tự.");
      }
      if (/\s/.test(value)) {
        passwordErrors.push("Không được chứa khoảng trắng.");
      }
      if (!/[A-Z]/.test(value)) {
        passwordErrors.push("Phải chứa ít nhất một chữ hoa.");
      }
      if (!/[a-z]/.test(value)) {
        passwordErrors.push("Phải chứa ít nhất một chữ thường.");
      }
      if (!/[0-9]/.test(value)) {
        passwordErrors.push("Phải chứa ít nhất một chữ số.");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        passwordErrors.push("Phải chứa ít nhất một ký tự đặc biệt.");
      }

      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors;
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  // SUMIT
  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Kiểm tra lại tất cả các trường
    const usernameErrors = [];

    if (!formData.username) {
      usernameErrors.push("Không được để trống.");
    } else {
      if (formData.username.length < 6) {
        usernameErrors.push("Tên đăng nhập phải từ 6 ký tự trở lên.");
      }
      if (/\s/.test(formData.username)) {
        usernameErrors.push("Không được chứa khoảng trắng.");
      }
      if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
        usernameErrors.push(
          "Chỉ được chứa chữ cái và số, không chứa ký tự đặc biệt."
        );
      }
    }

    if (usernameErrors.length > 0) {
      newErrors.username = usernameErrors;
    }

    const passwordErrors = [];
    const password = formData.password;

    if (!password) {
      passwordErrors.push("Mật khẩu không được để trống.");
    } else {
      if (password.length < 8 || password.length > 24) {
        passwordErrors.push("Mật khẩu phải từ 8 đến 24 ký tự.");
      }
      if (/\s/.test(password)) {
        passwordErrors.push("Không được chứa khoảng trắng.");
      }
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push("Phải chứa ít nhất một chữ hoa.");
      }
      if (!/[a-z]/.test(password)) {
        passwordErrors.push("Phải chứa ít nhất một chữ thường.");
      }
      if (!/[0-9]/.test(password)) {
        passwordErrors.push("Phải chứa ít nhất một chữ số.");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        passwordErrors.push("Phải chứa ít nhất một ký tự đặc biệt.");
      }
    }

    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    if (!formData.fullname || !/^[\p{L}0-9 ]+$/u.test(formData.fullname)) {
      newErrors.fullname = "Họ và tên chỉ được chứa chữ, số và khoảng trắng.";
    }

    if (!/^\d{10,11}$/.test(formData.phone_number)) {
      newErrors.phone_number =
        "Số điện thoại phải chứa 10 đến 11 chữ số, không có khoảng trắng hoặc ký tự đặc biệt.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Xử lý thành công
    const result = await handleRegister(formData);

    if (result.success) {
      setErrors({});
      setFormData({
        username: "",
        password: "",
        fullname: "",
        date_of_birth: "",
        phone_number: "",
      });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      username: "",
      password: "",
      fullname: "",
      date_of_birth: "",
      phone_number: "",
    });
    setErrors({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Đăng ký tài khoản</Modal.Title>
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
              {Array.isArray(errors.username) ? (
                <ul className="mb-0 ps-3">
                  {errors.username.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              ) : (
                errors.username
              )}
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
              isInvalid={!!errors.password?.length}
              required
            />
            <Form.Control.Feedback type="invalid">
              {Array.isArray(errors.password) ? (
                <ul className="mb-0 ps-3">
                  {errors.password.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              ) : (
                errors.password
              )}
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
              {Array.isArray(errors.phone_number) ? (
                <ul className="mb-0 ps-3">
                  {errors.phone_number.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              ) : (
                errors.phone_number
              )}
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
