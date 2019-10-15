var upload = require('../utils/upload'),
    authController = require('../controllers/auth'),
    categoryController = require('../controllers/category');

module.exports = (app) => {
    app.route('/categories')
        .get(authController.loginRequired, categoryController.getCategories)
        .post(authController.loginRequired, upload.single('file'), categoryController.createCategory);
        
    app.route('/categories/:categoryId')
        .delete(authController.loginRequired, categoryController.deleteCategory)
        .put(authController.loginRequired, upload.single('file'), categoryController.updateCategory);
};