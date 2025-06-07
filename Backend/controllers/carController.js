const db = require("../models/db");

// READ
exports.getCar = async (req, res) => {
    try {
        const [list_car] = await db.execute('SELECT * FROM Cars');
        res.status(200).json(list_car);

    } catch (err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}

// READ DETAILS
exports.getDetailsCar = async (req, res) => {
    const carID = req.params.id;
    try {
        const [car] = await db.execute('SELECT *FROM Cars WHERE carID = ?', [carID]);

        if (car.length === 0) {
            return res.status(404).json({ message: 'not found' });
        }

        res.json(car[0]);
    }
    catch (err) {
        console.error('Error: ', err);
        res.status(500).json({ error: 'Server Error' });
    }
}

// CREATE
exports.addCar = async (req, res) => {
    const { carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, brandID } = req.body;
    const userID = req.user.id;

    try {
        await db.query('INSERT INTO Cars(carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, userID, brandID) VALUES(?,?,?,?,?,?,?,?,?)',
            [carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, userID, brandID]
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

    const {carname, license_plate, year_manufacture, seats, fuel_type, car_status, pickup_location, price_per_date, brandID} = req.body;

    try {
        const [existing] = await db.execute('SELECT * FROM Cars WHERE carID = ? and userID = ?', [carID, userID]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Find not car or no owner" });
        }

        await db.execute(`UPDATE Cars SET 
            carname=?, license_plate=?, year_manufacture=?, seats=?, fuel_type=?, car_status=?, pickup_location=?, price_per_date=?, brandID=?
            WHERE carID=? and userID=?`,
        [carname, license_plate, year_manufacture, seats, fuel_type, car_status, pickup_location, price_per_date, brandID, carID, userID]);

        res.status(200).json({message: "Updated successfully"});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Server Error"});
    }
}