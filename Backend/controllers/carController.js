const db = require("../models/db");

exports.getCar = async (req, res) => {
    try {
        const [list_car] = await db.execute('SELECT * FROM Cars');
        res.status(200).json(list_car);

    } catch(err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}

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