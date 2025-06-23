const db = require('../../models/db');

exports.getAllCar = async (req, res) => {
    try {
        const [cars] = await db.execute('SELECT * FROM Cars');
        if (cars.length === 0) {
            return res.status(400).json({ message: "Danh sách trống" });
        }

        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
}

exports.getCarOfUser = async (req, res) => {
    const id = req.params.id;

    try {
        const [cars] = await db.execute('SELECT * FROM Cars WHERE userID = ?', [id]);
        if (cars.length === 0) {
            return res.status(400).json({message: "Danh sách trống"});
        }
        res.status(200).json(cars);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
}

exports.deleteCar = async (req, res) => {
    // const userID = req.user.id;
    const carID = req.params.id;
  
    try {
        const [existing] = await db.execute(
            'SELECT * FROM Cars WHERE carID = ?', [carID]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy xe" });
        }

        const [contracts] = await db.execute(
            'SELECT * FROM Contracts WHERE carID = ?',
            [carID]
        );

        const hasUncompleted = contracts.some(
            contract => contract.contract_status !== 'completed' && contract.contract_status !== 'cancelled'
        );

        if (hasUncompleted) {
            return res.status(400).json({ message: "Xe đang có hợp đồng chưa hoàn thành" });
        }
          
        await db.execute('DELETE FROM Cars WHERE carID = ?', [carID]);
        res.status(200).json({ message: "Xóa thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};