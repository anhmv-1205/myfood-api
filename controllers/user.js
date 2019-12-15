var User = require('../models/user'),
    Food = require('../models/food'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    constants = require('../utils/constants');

module.exports.register = function (req, res) {
    if (req.body.password.trim().length < 6) {
        return res.status(400).json({
            data: "",
            message: constants.MESSAGE_INVALID_PASSWORD,
            status: constants.STATUS_ERROR
        });
    }
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password.trim(), 10);
    newUser.save(function (err, user) {
        if (err) {
            console.log(err)
            return res.status(400).json({
                data: "",
                message: err.message,
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
                message: constants.MESSAGE_401,
                status: constants.STATUS_ERROR
            });
        }
        user.hash_password = undefined
        return res.json({
            token: jwt.sign({
                _id: user._id,
                role: user.role
            }, process.env.API_PRIVATE_KEY),
            data: user,
            message: constants.MESSAGE_SUCCESS,
            status: constants.STATUS_200
        });
    });
};

module.exports.getUsers = async function (req, res) {
    var page = parseInt(req.query.page) || 1;
    var positionStart = (page - 1) * constants.AMOUNT_ITEM_IN_PER_PAGE
    var result = await User.find().limit(constants.AMOUNT_ITEM_IN_PER_PAGE).skip(positionStart);
    result.forEach((e) => {
        e.hash_password = undefined;
    });
    return res.json({
        data: result,
        message: constants.MESSAGE_SUCCESS,
        status: constants.STATUS_200
    });
};

module.exports.getUsersWithCategoryId = async (req, res) => {
    var categoryId = req.params.categoryId

    try {
        var result = await User.find({
            categories: categoryId
        })

        if (!result)
            return res.status(204).json({
                message: constants.MESSAGE_204,
                status: constants.STATUS_204
            });

        result.forEach((e) => {
            e.hash_password = undefined
        })

        return res.status(200).json({
            data: result,
            message: constants.MESSAGE_SUCCESS,
            status: constants.STATUS_200
        })
    } catch (err) {
        return res.status(500).json({
            message: err,
            status: constants.STATUS_ERROR
        });
    }
}

module.exports.getTheNumberOfFoodWithUserId = async (req, res) => {
    var userIdParams = req.params.userId;
    try {
        var count = await Food.countDocuments({
            userId: userIdParams
        });
        return res.status(200).json({
            data: count,
            message: constants.MESSAGE_SUCCESS,
            status: constants.STATUS_200
        })

    } catch (err) {
        return res.status(500).json({
            message: err,
            status: constants.STATUS_ERROR
        })
    }
}

module.exports.getUserWithId = function (req, res) {
    var userId = req.params.userId
    User.findOne({
        _id: userId
    }, function (err, user) {
        if (err)
            return res.json({
                data: "",
                message: err.message,
                status: constants.STATUS_ERROR
            });
        if (!user) {
            return res.status(404).json({
                message: 'Not found',
                status: "fail"
            });
        }
        user.hash_password = undefined
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
                message: err.message,
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
                message: err.message,
                status: constants.STATUS_ERROR
            });
        return res.json({
            message: constants.MESSAGE_DELETE,
            status: constants.STATUS_200
        });
    });
};

module.exports.updateOwner = async (req, res) => {
    if (req.file)
        req.body.img_url = Constants.MY_FOOD_URL + Constants.PATH_IMG + req.file.filename;

    const filter = {
        _id: req.user._id
    }

    const update = req.body

    try {
        let user = await User.findOneAndUpdate(filter, update, {
            returnOriginal: false,
            useFindAndModify: false
        })
        if (!user) return res.status(400).json({
            message: Constants.MESSAGE_400,
            status: Constants.STATUS_400
        })
        return res.status(200).json({
            data: user,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        })
    } catch (err) {
        return res.status(500).json({
            message: err,
            status: constants.STATUS_ERROR
        });
    }
}
