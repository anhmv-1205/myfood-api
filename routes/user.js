var userController = require('../controllers/user'),
    upload = require('../utils/upload'),
    authController = require('../controllers/auth');

module.exports = (app) => {
    app.post('/register', userController.register);

    app.post('/sign_in', userController.sign_in);

    app.route('/users')
        .get(authController.loginRequired, userController.getUsers)
        .put(upload.single('file'), authController.loginRequired, userController.updateOwner);

    app.get('/users_by_category_id/:categoryId', userController.getUsersWithCategoryId)

    app.get('/users/:userId/numbers_of_foods', userController.getTheNumberOfFoodWithUserId)

    app.route('/users/:userId')
        .get(authController.loginRequired, userController.getUserWithId)
        .put(authController.loginRequired, userController.updateUser)
        .delete(authController.loginRequired, userController.deleteUser);

    app.get('/users/information/:userId', authController.loginRequired, userController.getUserInformationRelatedFood)
};