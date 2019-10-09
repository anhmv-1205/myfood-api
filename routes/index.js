var controller = require('../controllers/index') 

module.exports = (app) => {
    app.get('/status', controller.getUsers);
}
