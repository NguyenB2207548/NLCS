const db = require("../../models/db");

exports.getAllCar = async (req, res) => {
  try {
    const [cars] = await db.execute("SELECT * FROM Cars");
    if (cars.length === 0) {
      return res.status(400).json({ message: "Danh sách trống" });
    }

    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getCarOfUser = async (req, res) => {
  const id = req.params.id;

  try {
    const [cars] = await db.execute("SELECT * FROM Cars WHERE userID = ?", [
      id,
    ]);
    if (cars.length === 0) {
      return res.status(400).json({ message: "Danh sách trống" });
    }
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.deleteCar = async (req, res) => {
  // const userID = req.user.id;
  const carID = req.params.id;

  try {
    const [existing] = await db.execute("SELECT * FROM Cars WHERE carID = ?", [
      carID,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy xe" });
    }

    const [contracts] = await db.execute(
      "SELECT * FROM Contracts WHERE carID = ?",
      [carID]
    );

    const hasUncompleted = contracts.some(
      (contract) =>
        contract.contract_status !== "completed" &&
        contract.contract_status !== "cancelled"
    );

    if (hasUncompleted) {
      return res
        .status(400)
        .json({ message: "Xe đang có hợp đồng chưa hoàn thành" });
    }

    await db.execute("DELETE FROM Cars WHERE carID = ?", [carID]);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getCurrentRentedCars = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
                SELECT
            ct.contractID,
            ct.rental_start_date,
            ct.rental_end_date,
            ct.contract_status,
            ct.total_price,
            c.carID,
            c.carname,
            c.license_plate,
            c.seats,
            c.fuel_type,
            c.pickup_location,
            u.userID       AS renterID,
            u.fullname     AS renter_name,
            owner.userID   AS ownerID,
            owner.fullname AS owner_name,
            -- số ngày còn lại đến khi trả (>=0)
            GREATEST(DATEDIFF(ct.rental_end_date, CURDATE()), 0) AS days_left
            FROM Contracts ct
            JOIN Cars   c     ON ct.carID = c.carID
            JOIN Users  u     ON ct.userID = u.userID        -- người thuê
            JOIN Users  owner ON c.userID  = owner.userID     -- chủ xe
            WHERE ct.contract_status = 'active'
            ORDER BY c.carname ASC, ct.rental_start_date ASC;

      `
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: "Danh sách trống" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("getCurrentRentedCars error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
