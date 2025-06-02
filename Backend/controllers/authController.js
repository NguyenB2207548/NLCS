const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    console.log(username);

    try {
        const [rows] = await db.execute('SELECT *FROM Users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({message: 'wrong user name'});
        }

        const user = rows[0];

        const token = jwt.sign(
            {id: user.userID, username: user.username},
            'your_jwt_secret',
            {expiresIn: '1d'}
        )

        res.json({
            message: 'Login success',
            token,
            user: {
                id: user.userID,
                username: user.username,
            }
        })
    }
    catch (err) {
        console.error('Error Login', err);
        res.status(500).json({message: 'Server Error'});
    }

}