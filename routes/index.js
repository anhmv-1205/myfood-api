var controller = require('../controllers/index');

module.exports = (app) => {
    app.get('/', controller.index);

    app.get('/list_user', controller.getUsers);
};
