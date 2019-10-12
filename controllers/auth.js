var User = require('../models/user'),
    Constants = require('../utils/constants');

module.exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({
            message: Constants.MESSAGE_UNAUTHORIZED,
            status: Constants.STATUS_ERROR
        });
    }
};