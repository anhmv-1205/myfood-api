var authController = require('../controllers/auth'),
    commentController = require('../controllers/comments')

module.exports = (app) => {
    app.route('/comment')
        .post(authController.loginRequired, commentController.createComment)
        //.get(authController.loginRequired, commentController.getComments);
    
    app.get('/comment/:farmerId', authController.loginRequired, commentController.getCommentsByFarmerId)
}
