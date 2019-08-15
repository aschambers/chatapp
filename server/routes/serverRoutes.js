const serverController = require('../controllers/serverController');

module.exports = function(app) {
  app.post('/api/v1/serverCreate', serverController.serverCreate);
  app.post('/api/v1/serverFind', serverController.serverFind);
  app.post('/api/v1/serverDelete', serverController.serverDelete);
};