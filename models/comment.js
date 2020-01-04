const mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    rating: {
        type: Number,
        default: 0
    },
    comment: {
        type: String
    },
    foodId: {
        type: String
    },
    buyerId: {
        type: String
    },
    sellerId: {
        type: String
    },
    orderId: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

var Comment = mongoose.model('Comment', CommentSchema, 'comments');

module.exports = Comment;
