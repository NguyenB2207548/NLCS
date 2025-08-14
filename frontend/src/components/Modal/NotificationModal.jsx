import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, ListGroup, Spinner, Badge } from "react-bootstrap";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const NotificationsModal = ({ show, handleClose, setHasUnread }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/notification", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = useCallback(async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:3000/notification/markRead", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setHasUnread(false);
  }, [setHasUnread]);

  // Kết nối Socket.IO và lắng nghe thông báo
  //   useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     // Lấy userId từ token (nếu token là JWT)
  //     const payload = JSON.parse(atob(token.split(".")[1]));
  //     const userId = payload.id;

  //     socket.emit("register", userId); // Đăng ký user để server biết gửi thông báo

  //     socket.on("notification", (message) => {
  //       // Cập nhật danh sách thông báo ngay lập tức
  //       setNotifications((prev) => [
  //         { id: Date.now(), message, is_read: false, created_at: new Date() },
  //         ...prev,
  //       ]);
  //       setHasUnread(true);
  //     });

  //     return () => {
  //       socket.off("notification");
  //     };
  //   }, [setHasUnread]);

  useEffect(() => {
    if (show) {
      fetchNotifications();
      markAllAsRead();
    }
  }, [show, markAllAsRead]);

  return (
    <Modal show={show} onHide={handleClose} centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Thông báo của bạn</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" />
          </div>
        ) : notifications.length === 0 ? (
          <p>Không có thông báo nào.</p>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((n) => (
              <ListGroup.Item
                key={n.id}
                className="d-flex justify-content-between align-items-start"
              >
                <div>
                  <div className={n.is_read ? "text-muted" : "fw-bold"}>
                    {n.message}
                  </div>
                  <small className="text-muted">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
                {!n.is_read && <Badge bg="primary">Mới</Badge>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationsModal;
