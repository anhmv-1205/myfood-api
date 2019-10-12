var userController = require('../controllers/user'),
    authController = require('../controllers/auth');

module.exports = (app) => {
    app.post('/register', userController.register);

    app.post('/sign_in', userController.sign_in);

    app.get('/users', authController.loginRequired, userController.getUsers)
}
