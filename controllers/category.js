var Category = require('../models/category'),
    Constants = require('../utils/constants');

module.exports.createCategory = function (req, res) {
    console.log(req.file);
    if (!req.file) {
        return res.status(500).json({
            message: 'error',
            status: Constants.STATUS_ERROR
        })
    }
    req.body.img_url = Constants.MY_FOOD_URL + 'images/' + req.file.filename;

    var category = new Category(req.body);

    category.save(function (err, category) {
        if (err)
            return res.json({
                data: "",
                message: err.errmsg,
                status: Constants.STATUS_ERROR
            });
        else
            return res.json({
                data: category,
                message: Constants.MESSAGE_SUCCESS,
                status: Constants.STATUS_200
            });
    });
};

module.exports.getCategories = async function (req, res) {

    if (req.file) {
        req.body.img_url = Constants.MY_FOOD_URL + 'images/' + req.file.filename;
    }

    try {
        var categories = await Category.find();
        return res.status(200).json({
            data: categories,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        });
    } catch (ex) {
        return res.status(500).json({
            message: ex,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.deleteCategory = async (req, res) => {
    try {
        let category = await Category.findOneAndRemove({
            _id: req.params.categoryId
        });

        if (!category)
            return res.status(400).json({
                message: Constants.MESSAGE_NOT_FOUND,
                status: Constants.MESSAGE_NOT_FOUND
            });
        else
            return res.status(204).json({
                message: Constants.MESSAGE_DELETE,
                status: Constants.STATUS_200
            });
    } catch (ex) {
        return res.status(500).json({
            message: Constants.MESSAGE_UNKNOWN_SEVER_ERROR,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findOneAndUpdate({
                _id: req.params.categoryId
            },
            req.body, {
                new: true
            }
        );

        if (!category)
            return res.status(404).json({
                message: Constants.MESSAGE_NOT_FOUND,
                status: Constants.STATUS_ERROR
            });
        else
            return res.status(200).json({
                data: Category,
                message: Constants.MESSAGE_SUCCESS,
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