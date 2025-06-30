const db = require('../models/db');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.payContract = async (req, res) => {

    const userID = req.user.id;
    const contractID = req.params.id;
    const { payment_method, amount } = req.body;
    let payment_status = 'pending';
    try {
        const [contract] = await db.execute('SELECT * FROM Contracts WHERE contractID = ? and userID = ?', [contractID, userID]);

        if (contract.length === 0) {
            return res.status(400).json({ message: "Not found contract or no renter" });
        }

        if (contract[0].contract_status !== 'active') {
            return res.status(400).json({ message: "Contract is not confirm" });
        }

        const total_price = contract[0].total_price;

        const [existing] = await db.execute('SELECT * FROM Payments WHERE contractID = ?', [contractID]);
        if (existing.length === 0) {
            if (amount >= total_price) {
                payment_status = 'completed';
            }
            await db.execute(`INSERT INTO Payments(payment_method, total_price, payment_status, amount, contractID)
                VALUES(?, ?, ?, ?, ?)`, [payment_method, total_price, payment_status, amount, contractID]);
        } else {
            const amount_total = parseFloat(amount) + parseFloat(existing[0].amount);
            if (amount_total >= total_price) {
                payment_status = 'completed';
            }
            await db.execute(`UPDATE Payments 
                SET amount = ?, payment_status = ?, payment_date = ? 
                WHERE contractID = ?`, [amount_total, payment_status, new Date(), contractID]);
        }

        if (payment_status === 'completed') {
            await db.execute(
                `UPDATE Contracts SET contract_status = 'completed' WHERE contractID = ?`,
                [contractID]
            );

            const carID = contract[0].carID;
            await db.execute(
                `UPDATE Cars SET car_status = 'available' WHERE carID = ?`,
                [carID]
            );
        }

        res.status(200).json({ message: "Pay successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi thanh toán" });
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

exports.createCheckout = async (req, res) => {
    const { contractID } = req.body;

    try {
        const [contracts] = await db.execute(`
            SELECT ct.total_price, c.carname 
            FROM Contracts ct
            JOIN Cars c ON ct.carID = c.carID
            WHERE ct.contractID = ?
        `, [contractID]);

        if (!contracts || contracts.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy hợp đồng" });
        }

        const contract = contracts[0];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Thuê xe: ${contract.carname}`,
                    },
                    unit_amount: Math.round(contract.total_price / 27000 * 100),
                },
                quantity: 1,
            }],
            metadata: {
                contractID: String(contractID),
            },
            success_url: `http://localhost:5000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5000/payment-cancel`,
        });

        // Trả về URL để client redirect đến Stripe
        res.json({ url: session.url });

    } catch (err) {
        console.error("Lỗi khi tạo phiên thanh toán Stripe:", err);
        res.status(500).json({ message: "Server Error khi tạo phiên thanh toán" });
    }
};


// Thanh toan online
exports.confirmStripe = async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: "Thanh toán chưa hoàn tất." });
        }
        const contractID = session.metadata.contractID;

        const [contractResult] = await db.execute(
            'SELECT * FROM Contracts WHERE contractID = ?',
            [contractID]
        );

        if (contractResult.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy hợp đồng." });
        }

        const contract = contractResult[0];
        const total_price = contract.total_price;

        const [existing] = await db.execute('SELECT * FROM Payments WHERE contractID = ?', [contractID]);

        if (existing.length === 0) {
            await db.execute(
                `INSERT INTO Payments(payment_method, total_price, payment_status, amount, contractID, payment_date)
                 VALUES(?, ?, ?, ?, ?, ?)`,
                ['stripe', total_price, 'completed', total_price, contractID, new Date()]
            );
        }
        await db.execute(
            `UPDATE Contracts SET contract_status = 'completed' WHERE contractID = ?`,
            [contractID]
        );

        await db.execute(
            `UPDATE Cars SET car_status = 'available' WHERE carID = ?`,
            [contract.carID]
        );

        res.status(200).json({ message: "Thanh toán Stripe thành công, hợp đồng đã được cập nhật." });
    } catch (err) {
        console.error("Lỗi thanh toán bằng Stripe:", err);
        res.status(500).json({ message: "Lỗi server khi xác nhận thanh toán Stripe." });
    }
};
