
exports.login = (req, res) => {
    const { userName, userPassword } = req.body;

    const exampleUser = {
        user_name : "nguyenpham",
        password: "abc123"
    }

    if (userName === exampleUser.user_name && userPassword === exampleUser.password) {
        res.json({ success: true, message: "Login successed" });
    }
    else {
        res.status(401).json({success: false, message: "Username or password flase!!!"});
    }
}