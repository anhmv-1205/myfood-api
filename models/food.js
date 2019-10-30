var mongoose = require('mongoose');

var FoodSchema = new mongoose.Schema({
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
    }
});

var Food = mongoose.model('Food', FoodSchema, 'foods');

module.exports = Food;