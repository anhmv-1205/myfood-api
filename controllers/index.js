var User = require('../models/user');

module.exports.index = (req, res) => {
    res.json({author: "dong bin"});
};

module.exports.getUsers = async function(req, res) {
    var users = await User.find();
    res.json({
        users: users
    });
};
