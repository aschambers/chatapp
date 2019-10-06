const serverController = require('../controllers/serverController');

module.exports = function(app) {
  app.post('/api/v1/serverCreate', serverController.serverCreate);
  app.post('/api/v1/serverFind', serverController.serverFind);
  app.post('/api/v1/findUserList', serverController.findUserList);
  app.post('/api/v1/findUserBans', serverController.findUserBans);
  app.post('/api/v1/unbanUser', serverController.unbanUser);
  app.post('/api/v1/serverDelete', serverController.serverDelete);
  app.put('/api/v1/updateUserRole', serverController.updateUserRole);
  app.post('/api/v1/kickServerUser', serverController.kickServerUser);
  app.post('/api/v1/banServerUser', serverController.banServerUser);
};