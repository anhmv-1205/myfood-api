var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    validator = require('validator'),
    Constants = require('../utils/constants');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Kindly enter the name']
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
        }
    },
    hash_password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    birthday: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    location: [Number],
    role: {
        type: Number,
        default: Constants.ROLE_FARMER
    },
    categories: [String]
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;