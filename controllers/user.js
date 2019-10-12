var User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    constants = require('../utils/constants');

module.exports.register = function (req, res) {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function (err, user) {
        if (err) {
            return res.json({
                data: "",
                message: err.errmsg,
                status: constants.STATUS_ERROR
            });
        } else {
            newUser.hash_password = undefined;
            return res.json({
                data: newUser,
                message: constants.MESSAGE_SUCCESS,
                status: constants.STATUS_200
            })
        }
    });
};

module.exports.sign_in = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                message: err
            })
        }
        console.log(user);
        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({
                message: constants.MESSAGE_401
            });
        }
        return res.json({
            token: jwt.sign({
                _id: user._id,
                email: user.email,
                name: user.name,
                authorities: user.authorities
            }, process.env.API_PRIVATE_KEY),
            message: constants.MESSAGE_SUCCESS,
            status: constants.STATUS_200
        });
    });
};

module.exports.getUsers = async function (req, res) {
    var users = await User.find();
    return res.json({
        users: users
    });
}
