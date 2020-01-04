var Comment = require('../models/comment'),
    User = require('../models/user'),
    Constants = require('../utils/constants');

module.exports.createComment = async (req, res) => {
    try {
        let check = await Comment.findOne({
            orderId: req.body.orderId
        })

        if (check) {
            return res.status(200).json({
                message: "Bạn đã đánh giá đơn hàng này rồi!",
                status: Constants.MESSAGE_ERROR_DUPLICATE
            })
        }

        const comment = new Comment(req.body)
        const newComment = await comment.save()
        if (!newComment)
            return res.status(400).json({
                message: Constants.MESSAGE_400,
                status: Constants.STATUS_400
            })
        return res.status(201).json({
            data: newComment,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        })
    } catch (err) {
        if (err.name == 'MongoError' && err.code == 11000)
            return res.status(409).json({
                message: err.message,
                status: Constants.STATUS_ERROR
            });
        return res.status(500).json({
            message: Constants.MESSAGE_UNKNOWN_SEVER_ERROR,
            status: Constants.STATUS_ERROR
        });
    }
}

module.exports.getCommentsByFarmerId = async (req, res) => {
    const farmerId = req.params.farmerId
    try {
        let comments = await Comment.find({
            sellerId: farmerId
        }).lean()

        if (!comments)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STATUS_ERROR
            })

        for (var i = 0; i < comments.length; i++) {
            let buyer = await User.findOne({
                _id: comments[i].buyerId
            })
            buyer.hash_password = undefined
            if (buyer) {
                comments[i].buyer = buyer
            }
            console.log(comments[i])
        }

        return res.status(200).json({
            data: comments,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        })
    } catch (err) {
        if (err.name == 'MongoError' && err.code == 11000)
            return res.status(409).json({
                message: err.message,
                status: Constants.STATUS_ERROR
            });
        return res.status(500).json({
            message: Constants.MESSAGE_UNKNOWN_SEVER_ERROR,
            status: Constants.STATUS_ERROR
        });
    }
}