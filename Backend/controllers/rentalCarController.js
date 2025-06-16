const db = require('../models/db');

// Thêm hợp đồng
exports.createRentalCar = async (req, res) => {
    const userID = req.user.id;
    const carID = req.params.id;
    const { rental_start_date, rental_end_date } = req.body;

    const startDate = new Date(rental_start_date);
    const endDate = new Date(rental_end_date);
    const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (rentalDays <= 0) {
        return res.status(400).json({ message: "Ngày thuê không hợp lệ" });
    }

    try {
        const [cars] = await db.execute('SELECT * FROM Cars WHERE carID = ?', [carID]);
        if (cars.length === 0) {
            return res.status(404).json({ message: "Not found Car" });
        }
        const pricePerDay = cars[0].price_per_date;
        const totalPrice = rentalDays * pricePerDay;

        await db.execute('INSERT INTO Contracts(rental_start_date, rental_end_date, total_price, userID, carID) VALUES(?,?,?,?,?)',
            [rental_start_date, rental_end_date, totalPrice, userID, carID]
        )

        res.status(200).json({ message: "Đăng ký thuê xe thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}
// Lấy tất cả hợp đồng
exports.getContractAll = async (req, res) => {
    try {
        const [list_rental] = await db.execute('SELECT * FROM Contracts');
        res.status(200).json(list_rental);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.getContractOfUser = async (req, res) => {
    const userID = req.user.id;

    try {
        const [list_rental] = await db.execute('SELECT * FROM Contracts WHERE userID = ?', [userID]);
        res.status(200).json(list_rental);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.confirmContract = async (req, res) => {
    const userID = req.user.id;
    const contractID = req.params.id;
    const contract_status = 'completed';

    try {
        const [contracts] = await db.execute(`SELECT ct.*
                                        FROM Contracts ct
                                        JOIN Cars c ON ct.carID = c.carID
                                        WHERE c.userID = ? AND ct.contractID = ?`, [userID, contractID]);
        if (contracts.length === 0) {
            return res.status(400).json({ message: "Not found Contract or no owner" });
        }

        await db.execute('UPDATE Contracts SET contract_status = ? WHERE contractID = ?', [contract_status, contractID]);
        res.status(200).json({ message: "Confirm successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.getContractOfOwner = async (req, res) => {
    const ownerID = req.user.id;

    try {
        const [contracts] = await db.execute(`SELECT ct.*
                                        FROM Contracts ct
                                        JOIN Cars c ON ct.carID = c.carID
                                        WHERE c.userID = ?`, [ownerID]);
        res.status(200).json(contracts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}