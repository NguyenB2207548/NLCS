const db = require('../../models/db');

exports.getAllUser = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM Users');
        if (users.length === 0) {
            return res.status(400).json({ message: "Danh sách trống" });
        }

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }

}

exports.getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const [user] = await db.execute('SELECT * FROM Users WHERE userID = ?', [id]);
        if (user.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy user" });
        }

        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }

}

exports.deleteUser = async (req, res) => {
    if (req.user.id === parseInt(req.params.id)) {
        return res.status(403).json({ message: "Không thể tự vô hiệu hóa tài khoản của chính mình" });
    }

    const id = req.params.id;

    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE userID = ?', [id]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Không tìm thấy người dùng" });
        }

        const newStatus = users[0].is_active === 1 ? 0 : 1;
        const statusText = newStatus === 1 ? "Kích hoạt" : "Vô hiệu hóa";

        await db.execute('UPDATE Users SET is_active = ? WHERE userID = ?', [newStatus, id]);

        res.status(200).json({ message: `${statusText} thành công` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};


// exports.restoreUser = async (req, res) => {
//     const id = req.params.id;

//     try {
//         const [users] = await db.execute('SELECT * FROM Users WHERE userID = ?', [id]);
//         if (users.length === 0) {
//             return res.status(400).json({message: "Not found user"});
//         }

//         await db.execute('UPDATE Users SET is_active = true WHERE userID = ?', [id]);
//         res.status(200).json({message: "Restored successfully"});
//     } catch (err) {
//         console.error(err);
//         res.status(500).json("Server Error");
//     }
// }