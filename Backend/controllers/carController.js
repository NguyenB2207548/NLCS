const db = require("../models/db");

// READ
exports.getCar = async (req, res) => {
    try {
        const [list_car] = await db.execute('SELECT * FROM Cars');
        res.status(200).json(list_car);

    } catch(err) {
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
            return res.status(404).json({message: 'not found'});
        }

        res.json(car[0]);
    }
    catch(err) {
        console.error('Error: ', err);
        res.status(500).json({error: 'Server Error'});
    }
}

// CREATE
exports.addCar = async (req, res) => {
    const {carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, brandID} = req.body;
    const userID = req.user.id;

    try {
        await db.query('INSERT INTO Cars(carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, userID, brandID) VALUES(?,?,?,?,?,?,?,?,?)',
            [carname, license_plate, year_manufacture, seats, fuel_type, pickup_location, price_per_date, userID, brandID]
        );

        res.status(200).json({message: "Add Car Success"});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Server Error"});
    }
}

