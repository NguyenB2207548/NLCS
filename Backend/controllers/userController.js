const db = require("../models/db");

exports.getUser = async (req, res) => {
    try {
        const [list_user] = await db.execute('SELECT * FROM Users');
        res.status(200).json(list_user);

    } catch(err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}