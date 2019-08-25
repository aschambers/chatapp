const categoryController = require('../controllers/categoryController');

module.exports = function(app) {
  app.post('/api/v1/categoryCreate', categoryController.categoryCreate);
  app.post('/api/v1/categoryFindAll', categoryController.categoryFindAll);
};