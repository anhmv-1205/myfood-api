var Order = require('../models/order'),
    User = require('../models/user'),
    Constants = require('../utils/constants'),
    Food = require('../models/food');

module.exports.createOrder = async (req, res) => {
    req.body.buyerId = req.user._id;

    try {
        var oldOrder = await Order.findOne({
            foodId: req.body.foodId,
            buyerId: req.body.buyerId
        })

        if (oldOrder) {
            if (oldOrder.status === Constants.REQUESTING || oldOrder.status === Constants.APPROVED)
                return res.status(200).json({
                    message: Constants.MESSAGE_ERROR_DUPLICATE,
                    status: Constants.STATUS_400
                })
        }

        let food = await Food.findOne({
            _id: req.body.foodId
        });

        let farmer = await User.findOne({
            _id: req.body.sellerId
        })

        req.body.food = food
        req.body.farmer = farmer
        let order = new Order(req.body);
        let newOrder = await order.save();
        return res.status(201).json({
            data: newOrder,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        });
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
};

module.exports.getOrders = async (req, res) => {
    let page = parseInt(req.query.page) || 1
    let positionStart = (page - 1) * Constants.AMOUNT_ITEM_IN_PER_PAGE
    try {
        let orders = await Order.find({
            $or: [{
                buyerId: req.user._id
            }, {
                sellerId: req.user._id
            }]
        }).sort({
            _id: -1
        }).limit(Constants.AMOUNT_ITEM_IN_PER_PAGE).skip(positionStart);

        let totalOrders = await Order.countDocuments({
            $or: [{
                buyerId: req.user._id
            }, {
                sellerId: req.user._id
            }]
        })

        let totalPage = Math.ceil(totalOrders / Constants.AMOUNT_ITEM_IN_PER_PAGE)

        let currentPage = (page > totalPage) ? totalPage : page

        if (!orders)
            return res.status(204).json({
                message: Constants.MESSAGE_204,
                status: Constants.STATUS_204
            });

        // if (req.user.role == Constants.ROLE_FARMER) {
        //     // remove order with status == cancel
        //     orders.filter((item) => {
        //         return item.status != Constants.CANCELED
        //     })
        // }

        res.status(200).json({
            data: {
                orders: orders,
                total_page: totalPage,
                current_page: currentPage,
                total_item: totalOrders
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
}

module.exports.getOrderByUserId = async (req, res) => {
    const orderId = req.params.orderId
    const userId = req.user._id
    try {
        let order = await Order.findOne({
            $and: [{
                    _id: orderId
                },
                {
                    $or: [{
                        buyerId: userId
                    }, {
                        sellerId: userId
                    }]
                }
            ]
        })

        if (!order)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STATUS_ERROR
            })

        return res.status(200).json({
            data: order,
            message: Constants.MESSAGE_SUCCESS,
            status: Constants.STATUS_200
        })

    } catch (err) {
        return res.status(500).json({
            message: err,
            status: Constants.STATUS_ERROR
        })
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    const orderId = req.params.orderId
    const toStatus = req.query.toStatus
    const userId = req.user._id
    const role = req.user.role
    const filter = {
        $and: [{
            _id: orderId
        }, {
            $or: [{
                sellerId: userId
            }, {
                buyerId: userId
            }]
        }]
    }

    const update = {
        $set: {
            status: toStatus
        }
    }

    try {
        let order = await Order.findOne(filter)

        if (!order) return res.status(400).json({
            message: Constants.MESSAGE_400,
            status: Constants.STATUS_400
        })

        let message = Constants.MESSAGE_400
        let isUpdate = false

        switch (toStatus) {
            case Constants.APPROVED:
            case Constants.REJECTED:
                if ((order.status == Constants.REQUESTING) && (role == Constants.ROLE_FARMER)) {
                    isUpdate = true
                } else {
                    message = order.status + " can not approve/reject or unauthorized"
                }
                break
            case Constants.CANCELED:
                if ((order.status == Constants.REQUESTING) && (role == Constants.ROLE_BUYER)) {
                    isUpdate = true
                } else {
                    message = order.status + " can not cancel or unauthorized"
                }
                break
            case Constants.DONE:
                if ((order.status == Constants.APPROVED) && (role == Constants.ROLE_FARMER)) {
                    isUpdate = true
                } else {
                    message = order.status + " can not done or unauthorized"
                }
                break
            default:
                isUpdate = false
        }

        if (isUpdate) {
            try {
                let updatedOrder = await Order.findOneAndUpdate(filter, update, {
                    returnOriginal: false,
                    useFindAndModify: false
                })

                console.log(updatedOrder)

                if (!updatedOrder) return res.status(400).json({
                    message: Constants.MESSAGE_400,
                    status: Constants.STATUS_400
                })

                return res.status(200).json({
                    data: updatedOrder,
                    message: Constants.MESSAGE_SUCCESS,
                    status: Constants.STATUS_200
                })
            } catch (err) {
                console.log(err)
                return res.status(500).json({
                    message: err,
                    status: Constants.STATUS_ERROR
                });
            }
        }

        return res.status(200).json({
            message: message,
            status: Constants.STATUS_400
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err,
            status: Constants.STATUS_ERROR
        });
    }
}

module.exports.approveOrder = async (req, res) => {
    const orderId = req.params.orderId
    const sellerId = req.user._id

    try {
        var order = await Order.findOne({
            $and: [{
                _id: orderId
            }, {
                sellerId: sellerId
            }]
        });

        if (!order)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STATUS_ERROR
            });

        if (order.status === Constants.REQUESTING)
            order.status = Constants.APPROVED
        else
            return res.status(400).json({
                message: 'Can not approve',
                status: Constants.STATUS_400
            });

        let orderUpdated = await Order.findOneAndUpdate({
            _id: order._id
        }, order, {
            new: true
        })

        if (!orderUpdated)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STATUS_ERROR
            });

        return res.status(200).json({
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
            message: err,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.rejectOrder = async (req, res) => {
    const orderId = req.params.orderId
    const sellerId = req.user._id

    try {
        var order = await Order.findOne({
            $and: [{
                _id: orderId
            }, {
                sellerId: sellerId
            }]
        });

        if (!order)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STA
            });

        if (order.status === Constants.REQUESTING)
            order.status = Constants.REJECTED
        else
            return res.status(400).json({
                message: '',
                status: Constants.STATUS_400
            });

        let orderUpdated = await Order.findOneAndUpdate({
            _id: order._id
        }, order)

        if (!orderUpdated)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STATUS_ERROR
            });
        else
            return res.status(200).json({
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
            message: err,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.cancelOrder = async (req, res) => {
    const orderId = req.params.orderId
    const buyerId = req.user._id

    try {
        var order = await Order.findOne({
            $and: [{
                _id: orderId
            }, {
                buyerId: buyerId
            }]
        });

        if (!order)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STA
            });

        if (order.status === Constants.REQUESTING)
            order.status = Constants.CANCELED
        else
            return res.status(400).json({
                message: '',
                status: Constants.STATUS_400
            });

        let orderUpdated = await Order.findOneAndUpdate({
            _id: order._id
        }, order)

        if (!orderUpdated)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STATUS_ERROR
            });
        else
            return res.status(200).json({
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
            message: err,
            status: Constants.STATUS_ERROR
        });
    }
};

module.exports.doneOrder = async (req, res) => {
    const orderId = req.params.orderId
    const sellerId = req.user._id

    try {
        var order = await Order.findOne({
            $and: [{
                _id: orderId
            }, {
                buyerId: sellerId
            }]
        });

        if (!order)
            return res.status(404).json({
                message: Constants.MESSAGE_404,
                status: Constants.STA
            });

        var now = new Date()
        var dateBuy = new Date(order.date_buy)

        if (now.getFullYear() >= dateBuy.getFullYear()) {
            if (now.getMonth() >= dateBuy.getMonth()) {
                if (now.getDate() >= dateBuy.getDate()) {
                    if (order.status === Constants.APPROVED)
                        order.status = Constants.DONE
                    else
                        return res.status(400).json({
                            message: 'Can not done!',
                            status: Constants.STATUS_400
                        });

                    let orderUpdated = await Order.findOneAndUpdate({
                        _id: order._id
                    }, order)

                    if (!orderUpdated)
                        return res.status(404).json({
                            message: Constants.MESSAGE_404,
                            status: Constants.STATUS_ERROR
                        });

                    var food = await Food.find({
                        _id: orderUpdated.foodId
                    });

                    food.amount_buy++

                    await Food.findOneAndUpdate({
                        _id: food._id
                    }, food)

                    return res.status(200).json({
                        message: Constants.MESSAGE_UPDATED,
                        status: Constants.STATUS_200
                    });
                }
            }
        }

        return res.status(400).json({
            message: 'It has not the day to buy yet',
            status: Constants.STATUS_400
        })
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000)
            return res.status(409).json({
                message: err.message,
                status: Constants.STATUS_ERROR
            });

        return res.status(500).json({
            message: err,
            status: Constants.STATUS_ERROR
        });
    }
};