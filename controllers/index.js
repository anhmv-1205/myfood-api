var User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

module.exports.index = function(req, res) {
    res.json({author: "dong bin"});
};

module.exports.getUsers = async function(req, res) {
    var users = await User.find();
    res.json({
        users: users
    });
};
