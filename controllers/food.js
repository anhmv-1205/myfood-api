var Food = require('../models/food'),
    Constants = require('../utils/constants'),
    User = require('../models/user');

module.exports.createFood = async (req, res) => {
    console.log(req.file);
    if (!req.file)
        return res.status(500).json({
            message: Constants.MESSAGE_500,
            status: Constants.STATUS_ERROR
        });
    req.body.img_url = Constants.MY_FOOD_URL + Constants.PATH_IMG + req.file.filename;
    req.body.userId = req.user._id;
    req.body.categoryId = req.params.categoryId

    const food = new Food(req.body);

    try {
        var user = User.findOne({
            _id: req.user._id
        })

        if (user.categories == undefined)
            user.categories = []
        if (!user.categories.includes(req.params.categoryId)) {
            user.categories.push(req.params.categoryId)
            await User.findOneAndUpdate({
                _id: req.user._id
            }, {
                categories: user.categories
            })
        }

        var newFood = await food.save();
        return res.status(201).json({
            data: newFood,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        })
    } catch (err) {
        if (err.name === 'MongoError' && err.code == 11000)
            return res.status(409).json({
                message: err.message,
                status: Constants.STATUS_ERROR
            });
        return res.status(500).json({
            message: Constants.MESSAGE_UNKNOWN_SEVER_ERROR + err.message,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.getFoodsByUserId = async (req, res) => {
    let page = parseInt(req.query.page) || 1
    let positionStart = (page - 1) * Constants.AMOUNT_ITEM_IN_PER_PAGE
    try {
        let foods = await Food.find({
            userId: req.params.userId
        }).limit(Constants.AMOUNT_ITEM_IN_PER_PAGE).skip(positionStart);

        let totalFoods = await Food.count({
            userId: req.params.userId
        })

        let totalPage = Math.ceil(totalFoods / Constants.AMOUNT_ITEM_IN_PER_PAGE)

        if (!foods)
            return res.status(204).json({
                message: Constants.MESSAGE_204,
                status: Constants.STATUS_204
            });

        res.status(200).json({
            data: {
                foods: foods,
                total_page: totalPage,
                current_page: page,
                total_food: totalFoods
            },
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        });
    } catch (err) {
        return res.status(500).json({
            message: err,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.getFoodsOfUser = async (req, res) => {
    var page = parseInt(req.query.page) || 1
    var positionStart = (page - 1) * Constants.AMOUNT_ITEM_IN_PER_PAGE
    try {
        var foods = await Food.find({
            userId: req.user._id
        }).limit(Constants.AMOUNT_ITEM_IN_PER_PAGE).skip(positionStart);

        if (!foods)
            return res.status(204).json({
                data: "",
                message: Constants.MESSAGE_204,
                status: Constants.STATUS_204
            });

        res.status(200).json({
            data: foods,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        });
    } catch (err) {
        return res.status(500).json({
            message: err,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.updateFoodById = async (req, res) => {
    if (req.file) req.body.img_url = Constants.MY_FOOD_URL + Constants.PATH_IMG + req.file.filename;

    try {
        let food = await Food.findOneAndUpdate({
                _id: req.params.foodId
            },
            req.body, {
                new: true
            });

        if (!food)
            return res.status(400).json({
                message: Constants.MESSAGE_NOT_FOUND,
                status: Constants.STATUS_ERROR
            });
        else
            return res.status(204).json({
                message: Constants.MESSAGE_UPDATED,
                status: Constants.STATUS_200
            });
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000)
            return res.status(409).json({
                message: err.message,
                status: Constants.STATUS_ERROR
            });
        return res.status(500).json({
            message: Constants.MESSAGE_UNKNOWN_SEVER_ERROR,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.deleteFoodById = async (req, res) => {
    try {
        let food = await Food.findOneAndRemove({
            _id: req.params.foodId
        });

        if (!food)
            return res.status(400).json({
                message: Constants.MESSAGE_NOT_FOUND,
                status: Constants.MESSAGE_NOT_FOUND
            });
        else
            return res.status(204).json({
                message: Constants.MESSAGE_DELETED,
                status: Constants.STATUS_200
            });
    } catch (ex) {
        return res.status(500).json({
            message: Constants.MESSAGE_UNKNOWN_SEVER_ERROR,
            status: Constants.STATUS_ERROR
        });
    }
};