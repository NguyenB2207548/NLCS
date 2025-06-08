const db = require('../models/db');

exports.payContract = async (req, res) => {
    const userID = req.user.id;
    const contractID = req.params.id;
    const { payment_method } = req.body;
    const payment_status = 'completed';
    try {
        const [contract] = await db.execute('SELECT * FROM Contracts WHERE contractID = ? and userID = ?', [contractID, userID]);

        if (contract.length === 0) {
            return res.status(400).json({ message: "Not found contract or no renter" });
        }

        if (contract[0].contract_status !== 'completed') {
            return res.status(400).json({ message: "Contract is not confirm" });
        }

        const [existing] = await db.execute(
            'SELECT * FROM Payments WHERE contractID = ?', [contractID]);

        if (existing.length > 0) {
            return res.status(400).json({ message: "Contract already paid" });
        }

        const amount = contract[0].total_price;

        await db.execute(`INSERT INTO Payments(payment_method, total_price, payment_status, contractID)
            VALUES(?, ?, ?, ?)`, [payment_method, amount, payment_status, contractID]);

        res.status(200).json({ message: "Pay successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.getPaidContract = async (req, res) => {
    const userID = req.user.id;

    try {
        const [contracts] = await db.execute(`SELECT ct.* FROM Payments p JOIN Contracts ct ON p.contractID = ct.contractID 
                                    WHERE ct.userID = ? and p.payment_status = 'completed'`, [userID]);
        res.status(200).json(contracts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.getNotPaidContract = async (req, res) => {
    const userID = req.user.id;

    try {
        const [contracts] = await db.execute(`SELECT ct.* FROM Contracts ct LEFT JOIN Payments p ON ct.contractID = p.contractID
                                            WHERE ct.userID = ? AND p.contractID IS NULL`, [userID]);
        res.status(200).json(contracts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.deletePayment = async (req, res) => {
    const userID = req.user.id;
    const paymentID = req.params.id;

    try {
        const [rows] = await db.execute(`SELECT p.*, ct.userID AS renter_id, ct.contract_status FROM Payments p
                                        JOIN Contracts ct ON p.contractID = ct.contractID WHERE p.paymentID = ?`, [paymentID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const payment = rows[0];

        if (payment.renter_id !== userID) {
            return res.status(403).json({ message: "No Renter" });
        }

        if (payment.contract_status !== 'completed') {
            return res.status(400).json({ message: "Payment not completed" });
        }

        await db.execute('DELETE FROM Payments WHERE paymentID = ?', [paymentID]);

        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
