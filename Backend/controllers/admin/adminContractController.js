const db = require("../../models/db");

exports.getAllContract = async (req, res) => {
  try {
    const [contracts] =
      await db.execute(`SELECT ct.*, u.fullname, c.carname, owner.fullname as owner
                                             FROM Contracts ct
                                             JOIN Users u ON ct.userID = u.userID
                                             JOIN Cars c ON ct.carID = c.carID
                                             JOIN Users owner ON c.userID = owner.userID
                                              `);
    if (contracts.length === 0) {
      return res.status(400).json({ message: "Danh sách trống" });
    }

    res.status(200).json(contracts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getContractOfUser = async (req, res) => {
  const id = req.params.id;

  try {
    const [contracts] = db.execute("SELECT * FROM Contracts WHERE userID = ?", [
      id,
    ]);
    if (contracts.length === 0) {
      return res.status(400).json({ message: "Danh sách trống" });
    }
    res.status(200).json(contracts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getContractsByMonth = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
          MONTH(ct.rental_start_date) AS month,
          COUNT(ct.contractID) AS contracts
      FROM Contracts ct
      GROUP BY MONTH(ct.rental_start_date)
      ORDER BY MONTH(ct.rental_start_date)
    `);

    // Map số tháng (1-12) sang tên tháng (Jan, Feb, Mar...)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const stats = rows.map((r) => ({
      month: monthNames[r.month - 1],
      contracts: r.contracts,
    }));

    if (stats.length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu hợp đồng" });
    }

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching contracts by month:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
