const db = require("../models/db");

exports.revenueByMonth = async (req, res) => {
    const userID = req.user.id;

    try {
        const [rows] = await db.execute(`
      SELECT 
        DATE_FORMAT(p.payment_date, '%Y-%m') AS month,
        SUM(IFNULL(p.amount, 0)) AS totalRevenue
      FROM Payments p
      JOIN Contracts ct ON p.contractID = ct.contractID
      JOIN Cars c ON ct.carID = c.carID
      WHERE p.payment_status = 'completed' AND c.userID = ?
      GROUP BY month
      ORDER BY month
    `, [userID]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi khi thống kê doanh thu" });
    }
};
