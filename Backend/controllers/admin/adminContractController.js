const db = require('../../models/db');

exports.getAllContract = async (req, res) => {
    try {
        const [contracts] = await db.execute(`SELECT ct.*, u.fullname, c.carname, owner.fullname as owner
                                             FROM Contracts ct
                                             JOIN Users u ON ct.userID = u.userID
                                             JOIN Cars c ON ct.carID = c.carID
                                             JOIN Users owner ON c.userID = owner.userID
                                              `);
        if (contracts.length === 0) {
            return res.status(400).json({ message: "Danh sách trống" });
        }

        res.status(200).json(contracts);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
}

exports.getContractOfUser = async (req, res) => {
    const id = req.params.id;

    try {
        const [contracts] = db.execute('SELECT * FROM Contracts WHERE userID = ?', [id]);
        if (contracts.length === 0) {
            return res.status(400).json({message: "Danh sách trống"});
        }
        res.status(200).json(contracts);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
}