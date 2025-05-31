const db = require('../models/db');

exports.getHomePage = async (req, res) => {
    // res.json("Welcome to Home Page");
        try {
            const [cars] = await db.query('SELECT * FROM car');
            res.json(cars);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }

}

exports.postHomePage = (req, res) => {
    const data = req.body;

    res.json({ message: "Received data: " + JSON.stringify(data) });
}