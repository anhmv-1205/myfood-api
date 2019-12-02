var userController = require('../controllers/user'),
    authController = require('../controllers/auth');

module.exports = (app) => {
    app.post('/register', userController.register);

    app.post('/sign_in', userController.sign_in);

    app.get('/users', authController.loginRequired, userController.getUsers);

    app.get('/users/:categoryId', userController.getUsersWithCategoryId)

    app.get('/users/:userId/numbers_of_foods', userController.getTheNumberOfFoodWithUserId)

    app.route('/users/:userId')
        .get(authController.loginRequired, userController.getUserWithId)
        .put(authController.loginRequired, userController.updateUser)
        .delete(authController.loginRequired, userController.deleteUser);
};