
exports.getHomePage = (req, res) => {
    res.json("Welcome to Home Page");
}

exports.postHomePage = (req, res) => {
    const data = req.body;

    res.json({ message: "Received data: " + JSON.stringify(data) });
}