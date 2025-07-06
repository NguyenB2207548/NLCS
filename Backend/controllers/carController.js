const db = require("../models/db");

// READ

exports.getCar = async (req, res) => {
  const {
    seats,
    brandname,
    car_status,
    username,
    pickup_location,
    carname,
    sort,
  } = req.query;

  try {
    let query = `
      SELECT Cars.*
      FROM Cars
      JOIN Users ON Cars.userID = Users.userID
      JOIN Brands ON Cars.brandID = Brands.brandID
    `;
    const params = [];
    const conditions = [];

    if (seats) {
      conditions.push("Cars.seats = ?");
      params.push(parseInt(seats));
    }

    if (brandname) {
      conditions.push("Brands.brandname = ?");
      params.push(brandname);
    }

    if (car_status) {
      conditions.push("Cars.car_status = ?");
      params.push(car_status);
    }

    if (pickup_location) {
      conditions.push("Cars.pickup_location = ?");
      params.push(pickup_location);
    }

    if (carname) {
      conditions.push("Cars.carname = ?");
      params.push(carname);
    }

    if (username) {
      conditions.push("Users.username = ?");
      params.push(username);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    if (sort === "asc") {
      query += " ORDER BY Cars.price_per_date ASC";
    } else if (sort === "desc") {
      query += " ORDER BY Cars.price_per_date DESC";
    }

    const [cars] = await db.execute(query, params);
    res.status(200).json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// READ DETAIL
exports.getDetailsCar = async (req, res) => {
  const carID = req.params.id;

  try {
    const [carRows] = await db.execute(
      `
            SELECT C.*, B.brandname, U.fullname AS ownerName, U.phone_number
            FROM Cars C
            JOIN Brands B ON C.brandID = B.brandID
            JOIN Users U ON C.userID = U.userID
            WHERE C.carID = ?`,
      [carID]
    );

    if (carRows.length === 0) {
      return res.status(404).json({ message: "Xe không tồn tại" });
    }

    const car = carRows[0];

    const [imageRows] = await db.execute(
      `
            SELECT imgURL FROM Car_images WHERE carID = ?`,
      [carID]
    );

    car.images = imageRows;

    res.json(car);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// READ ALL CARS OF USER
exports.getAllCarOfUser = async (req, res) => {
  const userID = req.user.id;

  try {
    const [rows] = await db.execute(`SELECT * FROM Cars WHERE userID = ?`, [
      userID,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Danh sách trống" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// CREATE
exports.addCar = async (req, res) => {
  const {
    carname,
    license_plate,
    year_manufacture,
    seats,
    fuel_type,
    pickup_location,
    price_per_date,
    brandID,
  } = req.body;

  const userID = req.user.id;

  const mainImage = req.files?.main_image?.[0];
  const subImages = req.files?.sub_images || [];

  if (!mainImage) {
    return res.status(400).json({ message: "Ảnh chính là bắt buộc" });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO Cars (
                carname, license_plate, year_manufacture, seats,
                fuel_type, pickup_location, price_per_date,
                userID, brandID, img_URL
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        carname,
        license_plate,
        year_manufacture,
        seats,
        fuel_type,
        pickup_location,
        price_per_date,
        userID,
        brandID,
        mainImage.filename,
      ]
    );

    const carID = result.insertId;

    const insertImagePromises = subImages.map((img) =>
      conn.query("INSERT INTO Car_images (carID, imgURL) VALUES (?, ?)", [
        carID,
        img.filename,
      ])
    );
    await Promise.all(insertImagePromises);

    await conn.commit();

    res.status(200).json({ message: "Thêm xe mới thành công", carID });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Biển số xe đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server khi thêm xe" });
  } finally {
    conn.release();
  }
};

// DELETE
exports.deleteCar = async (req, res) => {
  const userID = req.user.id;
  const carID = req.params.id;

  try {
    const [existing] = await db.execute(
      "SELECT * FROM Cars WHERE carID = ? AND userID = ?",
      [carID, userID]
    );
    if (existing.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy xe hoặc bạn không phải chủ xe" });
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

// UPDATE
exports.updateCar = async (req, res) => {
  const userID = req.user.id;
  const carID = req.params.id;

  const {
    carname,
    license_plate,
    year_manufacture,
    seats,
    fuel_type,
    car_status,
    pickup_location,
    price_per_date,
    brandID,
  } = req.body;

  try {
    const [existing] = await db.execute(
      "SELECT * FROM Cars WHERE carID = ? and userID = ?",
      [carID, userID]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: "Find not car or no owner" });
    }

    if (car_status === "maintenance") {
      const [contracts] = await db.execute(
        `
                SELECT * FROM Contracts
                WHERE carID = ? AND contract_status IN ('pending', 'active')
            `,
        [carID]
      );

      if (contracts.length > 0) {
        return res.status(400).json({
          message:
            "Không thể chuyển xe sang trạng thái bảo trì do đang có hợp đồng chưa hoàn tất",
        });
      }
    }

    await db.execute(
      `UPDATE Cars SET 
            carname=?, license_plate=?, year_manufacture=?, seats=?, fuel_type=?, car_status=?, pickup_location=?, price_per_date=?, brandID=?
            WHERE carID=? and userID=?`,
      [
        carname,
        license_plate,
        year_manufacture,
        seats,
        fuel_type,
        car_status,
        pickup_location,
        price_per_date,
        brandID,
        carID,
        userID,
      ]
    );

    res.status(200).json({ message: "Chỉnh sửa thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// STATS
exports.getStatsOfUser = async (req, res) => {
  const id = req.user.id;
  try {
    const [[{ total }]] = await db.execute(
      "SELECT COUNT(*) AS total FROM Cars WHERE userID = ?",
      [id]
    );
    const [[{ available }]] = await db.execute(
      `SELECT COUNT(*) AS available FROM Cars WHERE userID = ? AND car_status = 'available'`,
      [id]
    );
    const [[{ rented }]] = await db.execute(
      `SELECT COUNT(*) AS rented FROM Cars WHERE userID = ? AND car_status = 'rented'`,
      [id]
    );
    const [maxRows] = await db.execute(
      `SELECT * FROM Cars WHERE userID = ? ORDER BY price_per_date DESC LIMIT 1`,
      [id]
    );

    res.status(200).json({
      total,
      available,
      rented,
      maxPriceCar: maxRows[0] || null,
    });
  } catch (err) {
    console.error("Lỗi khi thống kê xe:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAllCarStats = async (req, res) => {
  try {
    const [[{ total }]] = await db.execute(
      "SELECT COUNT(*) AS total FROM Cars"
    );
    const [[{ available }]] = await db.execute(
      `SELECT COUNT(*) AS available FROM Cars WHERE car_status = 'available'`
    );
    const [[{ rented }]] = await db.execute(
      `SELECT COUNT(*) AS rented FROM Cars WHERE car_status = 'rented'`
    );
    const [maxRows] = await db.execute(
      `SELECT * FROM Cars ORDER BY price_per_date DESC LIMIT 1`
    );

    res.status(200).json({
      total,
      available,
      rented,
      maxPriceCar: maxRows[0] || null,
    });
  } catch (err) {
    console.error("Lỗi khi thống kê toàn bộ xe:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getSimilarCars = async (req, res) => {
  const carID = req.params.id;

  try {
    const [current] = await db.execute(
      `SELECT pickup_location, seats FROM Cars WHERE carID = ?`,
      [carID]
    );
    const { pickup_location, seats } = current[0];

    const [similarCars] = await db.execute(
      `SELECT * FROM Cars 
                                                WHERE carID != ? AND (pickup_location = ? OR seats = ?)
                                                ORDER BY
                                                    (pickup_location = ? AND seats = ?) DESC,
                                                    (pickup_location = ?) DESC,
                                                    (seats = ?) DESC
                                                LIMIT 4`,
      [
        carID,
        pickup_location,
        seats,
        pickup_location,
        seats,
        pickup_location,
        seats,
      ]
    );
    res.status(200).json(similarCars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getCarRentedPeriods = async (req, res) => {
  const carID = req.params.id;

  try {
    const [contracts] = await db.execute(
      `
            SELECT rental_start_date, rental_end_date
            FROM Contracts
            WHERE carID = ? AND contract_status = 'active'
        `,
      [carID]
    );

    res.status(200).json(contracts);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách thời gian thuê xe:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
