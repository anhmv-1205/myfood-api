var User = require('../models/user'),
    Constants = require('../utils/constants'),
    jwt = require('jsonwebtoken');

module.exports.loginRequired = function (req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({
        message: 'Access denied. No token provided.'
    });

    try {
        const decoded = jwt.verify(token, process.env.API_PRIVATE_KEY);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch(ex) {
        return res.status(401).json({
            message: Constants.MESSAGE_UNAUTHORIZED,
            status: Constants.STATUS_ERROR
        });
    }
};