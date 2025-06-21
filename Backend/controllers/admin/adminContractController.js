const db = require('../../models/db');

exports.getAllContract = async (req, res) => {
    try {
        const [contracts] = await db.execute('SELECT * FROM Contracts');
        if (contracts.length === 0) {
            return res.status(400).json({message: "Danh sách trống"});
        }

        res.status(200).json(contracts);
    } catch (err) {
        res.status(500).json({message: "Lỗi server"});
    }
}