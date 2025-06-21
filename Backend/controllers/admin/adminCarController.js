const db = require('../../models/db');

exports.getAllCar = async (req, res) => {
    try {
        const [cars] = await db.execute('SELECT * FROM Cars');
        if (cars.length === 0) {
            return res.status(400).json({message: "Danh sách trống"});
        }

        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json({message: "Lỗi server"});
    }
}