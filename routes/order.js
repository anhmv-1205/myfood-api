var orderController = require('../controllers/order'),
    authController = require('../controllers/auth')

module.exports = (app) => {
    app.route('/order')
        .post(authController.loginRequired, orderController.createOrder)
        .get(authController.loginRequired, orderController.getOrders)

    app.route('/order/:orderId')
        .get(authController.loginRequired, orderController.getOrderByUserId)
        .put(authController.loginRequired, orderController.updateOrderStatus)
};
