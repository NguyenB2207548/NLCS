const db = require("../models/db");

exports.getUser = async (req, res) => {
    try {
        const [list_user] = await db.execute('SELECT * FROM Users');
        res.status(200).json(list_user);

    } catch (err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE userID = ?', [id]);
        if (users.length === 0) {
            return res.status(400).json({message: "Not found user"});
        }

        if (users[0].is_active === 0) {
            return res.status(400).json({message: "User already delete"});
        }

        await db.execute('UPDATE Users SET is_active = false WHERE userID = ?', [id]);
        res.status(200).json({message: "Deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}

exports.restoreUser = async (req, res) => {
    const id = req.params.id;

    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE userID = ?', [id]);
        if (users.length === 0) {
            return res.status(400).json({message: "Not found user"});
        }

        await db.execute('UPDATE Users SET is_active = true WHERE userID = ?', [id]);
        res.status(200).json({message: "Restored successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}