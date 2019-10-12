var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Kindly enter the name of the task'
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    hash_password: {
        type: String
    },
    phone: {
        type: String
    },
    birthday: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    location: [Number],
    authorities: [
        {
            authority: String
        }
    ]
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
};

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;
