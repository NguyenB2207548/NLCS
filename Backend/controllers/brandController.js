const db = require('../models/db'); 

exports.getAllBrands = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Brands');
        res.json(rows); 
    } catch (error) {
        console.error('Lỗi lấy danh sách hãng xe:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách hãng xe' });
    }
};
