import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, ListGroup, Spinner, Badge } from "react-bootstrap";
import { FaBell, FaTrash } from "react-icons/fa";
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

  // Xóa thông báo
  const deleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/notification/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Xóa trên UI
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa thông báo:", err);
    }
  };

  useEffect(() => {
    if (show) {
      fetchNotifications();
      markAllAsRead();
    }
  }, [show, markAllAsRead]);

  return (
    <Modal show={show} onHide={handleClose} centered scrollable size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="d-flex align-items-center">
          <FaBell className="me-2 text-warning" />
          Thông báo của bạn
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f9fafb" }}>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-muted my-4">Không có thông báo nào.</p>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((n) => (
              <ListGroup.Item
                key={n.id}
                className={`mb-2 rounded shadow-sm border-0 p-3 d-flex justify-content-between align-items-center ${
                  n.is_read ? "bg-white" : "bg-light"
                }`}
                style={{ transition: "background 0.2s ease" }}
              >
                <div>
                  <div className={n.is_read ? "text-muted" : "fw-semibold"}>
                    {n.message}
                  </div>
                  <small className="text-secondary fst-italic">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {!n.is_read && (
                    <Badge bg="danger" pill>
                      Mới
                    </Badge>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteNotification(n.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="outline-secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationsModal;
