const serverController = require('../controllers/serverController');

module.exports = function(app) {
  app.get('/api/v1/serverFind', serverController.serverFind);
  app.get('/api/v1/findUserList', serverController.findUserList);
  app.get('/api/v1/findUserBans', serverController.findUserBans);
  app.post('/api/v1/serverCreate', serverController.serverCreate);
  app.post('/api/v1/unbanUser', serverController.unbanUser);
  app.post('/api/v1/kickServerUser', serverController.kickServerUser);
  app.post('/api/v1/banServerUser', serverController.banServerUser);
  app.put('/api/v1/updateUserRole', serverController.updateUserRole);
  app.put('/api/v1/serverToggle', serverController.serverToggle);
  app.delete('/api/v1/serverDelete', serverController.serverDelete);
};