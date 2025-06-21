const db = require("../models/db");

exports.getAllUser = async (req, res) => {
    try {
        const [list_user] = await db.execute('SELECT * FROM Users');
        res.status(200).json(list_user);

    } catch (err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}

exports.getUser = async (req, res) => {
    const id = req.user.id;

    try {
        const [user] = await db.execute('SELECT * FROM Users WHERE userID = ?', [id]);

        if (user.length === 0) {
            return res.status(400).json({message: "Not found user"});
        }

        res.status(200).json(user[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}

exports.updateUser = async (req, res) => {
    const id = req.user.id;
    const { fullname, date_of_birth, phone_number } = req.body;

    const date = date_of_birth === '' ? null : date_of_birth;

    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE userID = ?', [id]);
        if (users.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        await db.execute(
            'UPDATE Users SET fullname = ?,date_of_birth = ?, phone_number = ? WHERE userID = ?',
            [fullname, date, phone_number, id]
        );

        res.status(200).json({ message: "Chỉnh sửa thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
