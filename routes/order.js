var orderController = require('../controllers/order'),
    authController = require('../controllers/auth')

module.exports = (app) => {
    app.route('/order')
        .post(authController.loginRequired, orderController.createOrder)
        .get(authController.loginRequired, orderController.getOrders)

    app.route('/order/:orderId')
        .get(authController.loginRequired, orderController.getOrderByUserId)
        .put(authController.loginRequired, orderController.updateOrderStatus)

    app.put('/order/:orderId/approve', authController.loginRequired, orderController.approveOrder);

    app.put('/order/:orderId/reject', authController.loginRequired, orderController.rejectOrder);

    app.put('/order/:orderId/cancelOrder', authController.loginRequired, orderController.cancelOrder);

    app.put('/order/:orderId/doneOrder', authController.loginRequired, orderController.doneOrder);
};
