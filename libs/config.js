require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connect mongoDB successfully!");
});
