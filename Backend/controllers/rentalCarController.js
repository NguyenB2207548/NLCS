const db = require("../models/db");

// Thêm hợp đồng
exports.createRentalCar = async (req, res) => {
  const userID = req.user.id;
  const carID = req.params.id;
  const { rental_start_date, rental_end_date } = req.body;

  const startDate = new Date(rental_start_date);
  const endDate = new Date(rental_end_date);

  const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  if (rentalDays <= 0) {
    return res.status(400).json({ message: "Ngày thuê không hợp lệ" });
  }

  try {
    const [cars] = await db.execute("SELECT * FROM Cars WHERE carID = ?", [
      carID,
    ]);
    if (cars.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }

    if (cars[0].car_status === "maintenance") {
      return res
        .status(400)
        .json({ message: "Xe đang bảo trì, không thể thuê vào lúc này" });
    }

    const [overlapContracts] = await db.execute(
      `
            SELECT * FROM Contracts
            WHERE carID = ?
              AND contract_status IN ('active')
              AND NOT (rental_end_date < ? OR rental_start_date > ?)
        `,
      [carID, rental_start_date, rental_end_date]
    );

    if (overlapContracts.length > 0) {
      return res
        .status(400)
        .json({ message: "Xe đang được thuê trong khoảng thời gian này" });
    }

    const pricePerDay = cars[0].price_per_date;
    const totalPrice = rentalDays * pricePerDay;

    await db.execute(
      `INSERT INTO Contracts (rental_start_date, rental_end_date, total_price, userID, carID)
             VALUES (?, ?, ?, ?, ?)`,
      [rental_start_date, rental_end_date, totalPrice, userID, carID]
    );

    res.status(200).json({ message: "Đăng ký thuê xe thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi tạo hợp đồng thuê" });
  }
};

// Lấy tất cả hợp đồng
exports.getContractAll = async (req, res) => {
  try {
    const [list_rental] = await db.execute("SELECT * FROM Contracts");
    res.status(200).json(list_rental);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Hủy hợp đồng khi chưa được xác nhận
exports.cancelContract = async (req, res) => {
  const id = req.params.id;

  try {
    await db.execute("DELETE FROM Contracts WHERE contractID = ?", [id]);
    res.status(200).json({ message: "Hủy thành công" });
  } catch (err) {
    res.status(500).json({ mesage: "Server Error" });
  }
};

exports.getContractOfUser = async (req, res) => {
  const userID = req.user.id;

  try {
    const [list_rental] = await db.execute(
      `SELECT ct.*, c.carname, u.fullname, u.phone_number, rent.fullname AS rent_fullname, 
                                                IFNULL(SUM(p.amount), 0) AS amount
                                                FROM Contracts ct 
                                                JOIN Cars c ON ct.carID = c.carID
                                                JOIN Users u ON u.userID = c.userID
                                                JOIN Users rent ON rent.userID = ct.userID
                                                LEFT JOIN Payments p ON p.contractID = ct.contractID
                                                WHERE ct.userID = ?
                                                GROUP BY ct.contractID`,
      [userID]
    );
    res.status(200).json(list_rental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.confirmContract = async (req, res) => {
  const userID = req.user.id;
  const contractID = req.params.id;
  const contract_status = "active";
  const car_status = "rented";

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [contracts] = await conn.execute(
      `
            SELECT ct.*, c.userID AS ownerID, c.carname
            FROM Contracts ct
            JOIN Cars c ON ct.carID = c.carID
            WHERE ct.contractID = ? AND c.userID = ?
        `,
      [contractID, userID]
    );

    if (contracts.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        message: "Không tìm thấy hợp đồng hoặc bạn không phải chủ xe",
      });
    }

    const contract = contracts[0];
    if (contract.contract_status === "active") {
      await conn.rollback();
      return res
        .status(400)
        .json({ message: "Hợp đồng đã được duyệt trước đó" });
    }

    const carID = contract.carID;
    const renterID = contract.userID;

    await conn.execute(
      "UPDATE Contracts SET contract_status = ? WHERE contractID = ?",
      [contract_status, contractID]
    );

    await conn.execute("UPDATE Cars SET car_status = ? WHERE carID = ?", [
      car_status,
      carID,
    ]);

    // Từ chối các hợp đồng trùng lịch
    await conn.execute(
      `
            UPDATE Contracts
            SET contract_status = 'cancelled'
            WHERE carID = ?
              AND contractID != ?
              AND contract_status = 'pending'
              AND NOT (rental_end_date < ? OR rental_start_date > ?)
        `,
      [carID, contractID, contract.rental_start_date, contract.rental_end_date]
    );

    // Gửi thông báo cho người thuê
    function formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const message = `Hợp đồng thuê xe "${contract.carname}" (từ ${formatDate(
      contract.rental_start_date
    )} đến ${formatDate(contract.rental_end_date)}) đã được chủ xe duyệt.`;

    req.sendNotification(renterID, message);

    await conn.execute(
      "INSERT INTO Notifications (userID, message) VALUES (?, ?)",
      [renterID, message]
    );

    await conn.commit();
    res.status(200).json({ message: "Duyệt hợp đồng thành công" });
  } catch (err) {
    console.error("Lỗi khi duyệt hợp đồng:", err);
    await conn.rollback();
    res.status(500).json({ message: "Lỗi server khi duyệt hợp đồng" });
  } finally {
    conn.release();
  }
};

exports.rejectContract = async (req, res) => {
  const userID = req.user.id;
  const contractID = req.params.id;
  const contract_status = "cancelled";

  try {
    const [contracts] = await db.execute(
      `
            SELECT ct.*
            FROM Contracts ct
            JOIN Cars c ON ct.carID = c.carID
            WHERE c.userID = ? AND ct.contractID = ?
        `,
      [userID, contractID]
    );

    if (contracts.length === 0) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy hợp đồng hoặc bạn không có quyền" });
    }

    await db.execute(
      "UPDATE Contracts SET contract_status = ? WHERE contractID = ?",
      [contract_status, contractID]
    );

    res.status(200).json({ message: "Đã từ chối hợp đồng" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getContractOfOwner = async (req, res) => {
  const ownerID = req.user.id;

  try {
    const [contracts] = await db.execute(
      `SELECT ct.*, u.fullname, u.phone_number, c.carname
                                        FROM Contracts ct
                                        JOIN Cars c ON ct.carID = c.carID
                                        JOIN Users u ON ct.userID = u.userID
                                        WHERE c.userID = ?
                                        ORDER BY ct.rental_start_date DESC`,
      [ownerID]
    );
    res.status(200).json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.softDeleteContract = async (req, res) => {
  const id = req.params.id;

  try {
    await db.execute(
      "UPDATE Contracts SET is_deleted = TRUE WHERE contractID = ?",
      [id]
    );
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa hợp đồng:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// STATS
exports.getStatsOfOwner = async (req, res) => {
  try {
    const ownerID = req.user.id;

    const [contracts] = await db.execute(
      `SELECT contract_status FROM Contracts 
             JOIN Cars ON Contracts.carID = cars.carID 
             WHERE cars.userID = ?`,
      [ownerID]
    );

    const stats = {
      total: contracts.length,
      pending: 0,
      active: 0,
      cancelled: 0,
      completed: 0,
    };

    contracts.forEach((contract) => {
      const status = contract.contract_status;
      if (stats[status] !== undefined) {
        stats[status]++;
      }
    });

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Lỗi khi thống kê hợp đồng:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAllContractStats = async (req, res) => {
  try {
    const [contracts] = await db.execute(`
            SELECT contract_status FROM Contracts
        `);

    const stats = {
      total: contracts.length,
      pending: 0,
      active: 0,
      cancelled: 0,
      completed: 0,
    };

    contracts.forEach((contract) => {
      const status = contract.contract_status;
      if (stats[status] !== undefined) {
        stats[status]++;
      }
    });

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Lỗi khi thống kê hợp đồng:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
