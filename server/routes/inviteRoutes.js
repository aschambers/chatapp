const inviteController = require('../controllers/inviteController');

module.exports = function(app) {
  app.post('/api/v1/inviteCreate', inviteController.inviteCreate);
  app.post('/api/v1/inviteEmailCreate', inviteController.inviteEmailCreate);
  app.post('/api/v1/inviteVerification', inviteController.inviteVerification);
};