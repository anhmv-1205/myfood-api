var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    img_url: {
        type: String
    }
});

var Category = mongoose.model('Category', CategorySchema, 'categories');

module.exports = Category;
