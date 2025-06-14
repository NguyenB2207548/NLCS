const db = require("../models/db");

// READ

exports.getCar = async (req, res) => {
    const { seats, brandID, car_status, username, pickup_location, carname } = req.query;

    try {
        let query = `
      SELECT Cars.* FROM Cars
      JOIN Users ON Cars.userID = Users.userID
    `;
        const params = [];
        const conditions = [];

        if (seats) {
            conditions.push('Cars.seats = ?');
            params.push(parseInt(seats));
        }

        if (brandID) {
            conditions.push('Cars.brandID = ?');
            params.push(parseInt(brandID));
        }

        if (car_status) {
            conditions.push('Cars.car_status = ?');
            params.push(car_status);
        }

        if (pickup_location) {
            conditions.push('Cars.pickup_location = ?');
            params.push(pickup_location);
        }

        if (carname) {
            conditions.push('Cars.carname = ?');
            params.push(carname);
        }

        if (username) {
            conditions.push('Users.username = ?');
            params.push(username);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [cars] = await db.execute(query, params);
        res.status(200).json(cars);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// READ DETAIL
exports.getDetailsCar = async (req, res) => {
    const carID = req.params.id;
    try {
        const [rows] = await db.execute(`
            SELECT C.*, B.brandname, U.fullname AS ownerName, U.phone_number
            FROM Cars C
            JOIN Brands B ON C.brandID = B.brandID
            JOIN Users U ON C.userID = U.userID
            WHERE C.carID = ?`,
            [carID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'not found' });
        }

        res.json(rows[0]);
    }
    catch (err) {
        console.error('Error: ', err);
        res.status(500).json({ error: 'Server Error' });
    }
};


// CREATE
exports.addCar = async (req, res) => {
    const { carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, brandID, img_URL } = req.body;
    const userID = req.user.id;

    try {
        await db.query('INSERT INTO Cars(carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, userID, brandID, img_URL) VALUES(?,?,?,?,?,?,?,?,?,?)',
            [carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, userID, brandID, img_URL]
        );

        res.status(200).json({ message: "Add Car Success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

// DELETE
exports.deleteCar = async (req, res) => {
    const userID = req.user.id;
    const carID = req.params.id;

    try {
        const [existing] = await db.execute('SELECT * FROM Cars WHERE carID = ? and userID = ?', [carID, userID]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Find not car or no owner" });
        }

        await db.query('DELETE FROM Cars WHERE carID = ?', [carID]);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

// UPDATE
exports.updateCar = async (req, res) => {
    const userID = req.user.id;
    const carID = req.params.id;

    const { carname, license_plate, year_manufacture, seats, fuel_type, car_status, pickup_location, price_per_date, brandID } = req.body;

    try {
        const [existing] = await db.execute('SELECT * FROM Cars WHERE carID = ? and userID = ?', [carID, userID]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Find not car or no owner" });
        }

        await db.execute(`UPDATE Cars SET 
            carname=?, license_plate=?, year_manufacture=?, seats=?, fuel_type=?, car_status=?, pickup_location=?, price_per_date=?, brandID=?
            WHERE carID=? and userID=?`,
            [carname, license_plate, year_manufacture, seats, fuel_type, car_status, pickup_location, price_per_date, brandID, carID, userID]);

        res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}
