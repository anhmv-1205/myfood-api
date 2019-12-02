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
    food: {
        _id: {
            type: String
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        cost: {
            type: Number,
            default: 0
        },
        unit: {
            type: String,
            default: 'kg'
        },
        amount_buy: {
            type: Number,
            default: 0
        },
        img_url: {
            type: String
        },
        state: {
            type: Boolean,
            default: true
        },
        userId: {
            type: String,
            required: true
        },
        categoryId: {
            type: String,
            required: true
        },
        date_created: {
            type: Date,
            default: Date.now
        }
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
    shift: {
        type: String,
        default: Constants.AM
    },
    note: {
        type: String,
        default: ""
    }
});

/** We can reorder */

var Order = mongoose.model('Order', OrderSchema, 'orders');

module.exports = Order;