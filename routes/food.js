var upload = require('../utils/upload'),
    authController = require('../controllers/auth'),
    foodController = require('../controllers/food');

module.exports = (app) => {
    app.get('/foods', authController.loginRequired, foodController.getFoodsOfUser);

    app.post('/foods/:categoryId', upload.single('file'), authController.loginRequired, foodController.createFood);

    app.route('/foods/:userId')
        .get(foodController.getFoodsByUserId);
        //.get(authController.loginRequired, foodController.getFoodsByUserId);
    
    app.route('/foods/:foodId')
        .put(authController.loginRequired, upload.single('file'), foodController.updateFoodById)
        .delete(authController.loginRequired, foodController.deleteFoodById);
};