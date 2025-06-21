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
        // 1. Kiểm tra xe có tồn tại không
        const [cars] = await db.execute('SELECT * FROM Cars WHERE carID = ?', [carID]);
        if (cars.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy xe" });
        }

        // 2. Kiểm tra xem xe đã được đặt trong thời gian này chưa
        const [overlapContracts] = await db.execute(`
            SELECT * FROM Contracts
            WHERE carID = ?
              AND contract_status IN ('pending', 'active')
              AND NOT (rental_end_date < ? OR rental_start_date > ?)
        `, [carID, rental_start_date, rental_end_date]);

        if (overlapContracts.length > 0) {
            return res.status(400).json({ message: "Xe đã được đặt trong khoảng thời gian này" });
        }

        // 3. Tính tổng tiền và tạo hợp đồng
        const pricePerDay = cars[0].price_per_date;
        const totalPrice = rentalDays * pricePerDay;

        await db.execute(
            `INSERT INTO Contracts (rental_start_date, rental_end_date, total_price, userID, carID)
             VALUES (?, ?, ?, ?, ?)`,
            [rental_start_date, rental_end_date, totalPrice, userID, carID]
        );

        res.status(200).json({ message: "Đăng ký thuê xe thành công" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi tạo hợp đồng thuê" });
    }
};

// Lấy tất cả hợp đồng
exports.getContractAll = async (req, res) => {
    try {
        const [list_rental] = await db.execute('SELECT * FROM Contracts');
        res.status(200).json(list_rental);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

// Hủy hợp đồng khi chưa được xác nhận
exports.cancelContract = async (req, res) => {
    const id = req.params.id;

    try {
        await db.execute('DELETE FROM Contracts WHERE contractID = ?', [id]);
        res.status(200).json({ message: "Hủy thành công" })
    } catch (err) {
        res.status(500).json({ mesage: "Server Error" })
    }
}


exports.getContractOfUser = async (req, res) => {
    const userID = req.user.id;

    try {
        const [list_rental] = await db.execute(`SELECT ct.*, c.carname, u.fullname, u.phone_number
                                                FROM Contracts ct
                                                JOIN Cars c ON ct.carID = c.carID
                                                JOIN Users u ON u.userID = c.userID
                                                WHERE ct.userID = ?`, [userID]);
        res.status(200).json(list_rental);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.confirmContract = async (req, res) => {
    const userID = req.user.id;
    const contractID = req.params.id;
    const contract_status = 'active';
    const car_status = 'rented';

    try {
        const [contracts] = await db.execute(`SELECT ct.*
                                        FROM Contracts ct
                                        JOIN Cars c ON ct.carID = c.carID
                                        WHERE c.userID = ? AND ct.contractID = ?`, [userID, contractID]);
        if (contracts.length === 0) {
            return res.status(400).json({ message: "Not found Contract or no owner" });
        }

        const carID = contracts[0].carID;

        await db.execute('UPDATE Contracts SET contract_status = ? WHERE contractID = ?', [contract_status, contractID]);

        await db.execute(
            'UPDATE Cars SET car_status = ? WHERE carID = ?',
            [car_status, carID]
        );

        res.status(200).json({ message: "Xác nhận thành công" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.rejectContract = async (req, res) => {
    const userID = req.user.id;
    const contractID = req.params.id;
    const contract_status = 'cancelled';

    try {
        const [contracts] = await db.execute(`
            SELECT ct.*
            FROM Contracts ct
            JOIN Cars c ON ct.carID = c.carID
            WHERE c.userID = ? AND ct.contractID = ?
        `, [userID, contractID]);

        if (contracts.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy hợp đồng hoặc bạn không có quyền" });
        }

        await db.execute(
            'UPDATE Contracts SET contract_status = ? WHERE contractID = ?',
            [contract_status, contractID]
        );

        res.status(200).json({ message: "Đã từ chối hợp đồng" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.getContractOfOwner = async (req, res) => {
    const ownerID = req.user.id;

    try {
        const [contracts] = await db.execute(`SELECT ct.*, u.fullname, u.phone_number, c.carname
                                        FROM Contracts ct
                                        JOIN Cars c ON ct.carID = c.carID
                                        JOIN Users u ON ct.userID = u.userID
                                        WHERE c.userID = ?`, [ownerID]);
        res.status(200).json(contracts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.softDeleteContract = async (req, res) => {
    const id = req.params.id;

    try {
        await db.execute("UPDATE Contracts SET is_deleted = TRUE WHERE contractID = ?", [id]);
        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        console.error("Lỗi khi xóa hợp đồng:", err);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};
