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
            });
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
    var page = parseInt(req.query.page) || 1;
    var positionStart = (page - 1) * constants.AMOUNT_ITEM_IN_PER_PAGE
    var result = await User.find().limit(constants.AMOUNT_ITEM_IN_PER_PAGE).skip(positionStart);
    return res.json({
        data: result,
        message: constants.MESSAGE_SUCCESS,
        status: constants.STATUS_200
    });
};

module.exports.getUserWithId = function (req, res) {
    var userId = req.params.userId
    var user = User.findById(userId, function (err, user) {
        if (err)
            return res.json({
                data: "",
                message: err.errmsg,
                status: constants.STATUS_ERROR
            });
        if (!user) {
            return res.status(404).json({
                message: 'Not found',
                status: "fail"
            });
        }
        return res.json({
            data: user,
            message: constants.MESSAGE_SUCCESS,
            status: constants.STATUS_200
        });
    });
};

module.exports.updateUser = function (req, res) {
    User.findOneAndUpdate({
        _id: req.params.userId
    }, req.body, {
        new: true
    }, function (err, user) {
        if (err)
            return res.json({
                data: "",
                message: err.errmsg,
                status: constants.STATUS_ERROR
            })
        return res.json({
            data: user,
            message: constants.MESSAGE_SUCCESS,
            status: constants.STATUS_ERROR
        });
    });
};

module.exports.deleteUser = function (req, res) {
    User.remove({
        _id: req.params.userId
    }, function (err) {
        if (err)
            return res.json({
                data: "",
                message: err.errmsg,
                status: constants.STATUS_ERROR
            });
        return res.json({
            message: constants.MESSAGE_DELETE,
            status: constants.STATUS_200
        });
    });
};