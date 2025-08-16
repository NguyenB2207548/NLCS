import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "./Header.css";
import LoginModal from "../Modal/LoginModal";
import AccountModal from "../Modal/AccoutModal";
import RegisterModal from "../Modal/RegisterModal";
import NotificationsModal from "../Modal/NotificationModal";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
import logo from "../../assets/Screenshot 2025-08-14 075937.png";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showAccount, setShowAccount] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [fullname, setFullname] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Toast state
  const [alertMessage, setAlertMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const user = JSON.parse(localStorage.getItem("user"));
      setFullname(user?.fullname || "");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("register", userId);
    });

    socket.on("notification", (message) => {
      console.log("📢 Nhận thông báo:", message);
      setAlertMessage(message);
      setShowToast(true);
    });

    return () => {
      socket.off("connect");
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/notification/unread", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setHasUnread(data.unread > 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnread();
  }, [isLoggedIn]);

  const handleLogin = (username, password) => {
    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setIsLoggedIn(true);
          setShowLogin(false);
          setLoginError("");
          setFullname(data.user.fullname);

          if (data.user.admin === 1) {
            navigate("/admin");
          } else {
            navigate("/", { state: { reset: true } });
          }
        } else {
          setLoginError(data.message || "Đăng nhập thất bại");
        }
      })
      .catch((err) => {
        console.error("Lỗi đăng nhập:", err);
        setLoginError("Đã có lỗi xảy ra khi đăng nhập");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowAccount(false);

    navigate("/", { state: { reset: true } });
  };

  const handleRegister = async (formData) => {
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công!");
        setShowRegister(false);
        setShowLogin(true);
        return { success: true };
      } else {
        alert(data.message);

        if (data.message === "Tên đăng nhập đã tồn tại") {
          return {
            success: false,
            errors: {
              username: ["Tên đăng nhập đã tồn tại"],
            },
          };
        }

        if (
          data.message === "Số điện thoại đã được đăng ký cho tài khoản khác"
        ) {
          return {
            success: false,
            errors: {
              phone_number: [
                "Số điện thoại đã được đăng ký cho tài khoản khác",
              ],
            },
          };
        }

        return {
          success: false,
          errors: {
            username: ["Đã có lỗi xảy ra. Vui lòng thử lại."],
          },
        };
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return {
        success: false,
        errors: {
          username: ["Đã có lỗi kết nối. Vui lòng thử lại."],
        },
      };
    }
  };

  const handleAddCarClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn cần đăng nhập để đăng xe.");
      setShowLogin(true);
    } else {
      navigate("/car/addCar");
    }
  };

  return (
    <Navbar expand="lg" className="nav-header shadow-sm py-3">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          state={{ reset: true }}
          className="fw-bold logo-text d-flex align-items-center"
        >
          <img
            src={logo}
            alt="Thuê Xe Tự Lái"
            style={{ height: "40px", objectFit: "contain" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          {/* Menu trái */}
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/" state={{ reset: true }}>
              TRANG CHỦ
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              THUÊ XE
            </Nav.Link>
            <Nav.Link onClick={handleAddCarClick}>ĐĂNG XE</Nav.Link>
          </Nav>

          {/* Menu phải */}
          <Nav className="align-items-center">
            {isLoggedIn ? (
              <>
                <Nav.Link
                  onClick={() => setShowNotiModal(true)}
                  className="position-relative me-3"
                >
                  <FaBell size={20} className="icon-bell" />
                  {hasUnread && (
                    <span
                      className="position-absolute top-1 translate-middle bg-danger border border-white rounded-circle"
                      style={{ width: "8px", height: "8px", zIndex: 1 }}
                    ></span>
                  )}
                </Nav.Link>

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="d-flex align-items-center border-0 bg-transparent dropdown-toggle-user"
                  >
                    <i className="bi bi-person-circle me-2 fullname"></i>
                    <span className="fullname">{fullname}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      Xem hồ sơ
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/rental/history">
                      Xem lịch sử thuê
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-danger"
                    >
                      Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link
                  onClick={() => {
                    setShowLogin(true);
                    setLoginError("");
                  }}
                >
                  Đăng nhập
                </Nav.Link>
                <Nav.Link onClick={() => setShowRegister(true)}>
                  Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        {/* Toast Notification */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            bg={
              alertMessage === "Hợp đồng đã bị từ chối" ? "danger" : "success"
            }
            onClose={() => {
              setShowToast(false);
              setAlertMessage("");
            }}
            show={showToast}
            delay={7000}
            autohide
          >
            <Toast.Header closeButton>
              <strong className="me-auto">
                {alertMessage === "Hợp đồng đã bị từ chối"
                  ? "❌ Thông báo"
                  : "✅ Thông báo"}
              </strong>
              <small>Vừa xong</small>
            </Toast.Header>
            <Toast.Body className="text-white">{alertMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Modals */}
        <LoginModal
          show={showLogin}
          handleClose={() => {
            setShowLogin(false);
            setLoginError("");
          }}
          handleLogin={handleLogin}
          loginError={loginError}
        />
        <AccountModal
          show={showAccount}
          handleClose={() => setShowAccount(false)}
          handleLogout={handleLogout}
        />
        <RegisterModal
          show={showRegister}
          handleClose={() => setShowRegister(false)}
          handleRegister={handleRegister}
        />
        <NotificationsModal
          show={showNotiModal}
          handleClose={() => setShowNotiModal(false)}
          setHasUnread={setHasUnread}
        />
      </Container>
    </Navbar>
  );
};

export default Header;
