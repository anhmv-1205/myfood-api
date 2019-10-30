var mongoose = require('mongoose'),
    Constants = require('../utils/constants');

var OrderSchema = new mongoose.Schema({
    buyerId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    foodId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: Constants.REQUESTING
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    date_buy: {
        type: String,
        required: [true, 'Have to have date buy']
    },
    note: {
        type: String,
        default: ""
    }
});

/** We can reorder */

var Order = mongoose.model('Order', OrderSchema, 'orders');

module.exports = Order;
