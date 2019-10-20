const categoryController = require('../controllers/categoryController');

module.exports = function(app) {
  app.get('/api/v1/categoryFindAll', categoryController.categoryFindAll);
  app.post('/api/v1/categoryCreate', categoryController.categoryCreate);
};