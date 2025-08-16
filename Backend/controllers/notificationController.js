const db = require("../models/db");

exports.getNotifications = async (req, res) => {
  const id = req.user.id;

  try {
    const [notifications] = await db.execute(
      `SELECT * FROM Notifications WHERE userID = ? ORDER BY created_at DESC`,
      [id]
    );
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  const userID = req.user.id;
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS unread FROM Notifications WHERE userID = ? AND is_read = 0",
      [userID]
    );
    res.json({ unread: rows[0].unread });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.markRead = async (req, res) => {
  const userID = req.user.id;

  try {
    await db.execute(
      `
      UPDATE Notifications
      SET is_read = TRUE
      WHERE userID = ?
    `,
      [userID]
    );

    res
      .status(200)
      .json({ message: "Đã đánh dấu tất cả thông báo là đã đọc." });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông báo:", error);
    res.status(500).json({ message: "Lỗi server khi đánh dấu thông báo." });
  }
};

exports.deleteNotification = async (req, res) => {
  const id = req.params.id;
  try {
    await db.execute(`DELETE FROM Notifications WHERE id = ?`, [id]);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
