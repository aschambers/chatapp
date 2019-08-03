const messageController = require('../controllers/messageController');

module.exports = function(app) {
  app.post('/api/v1/messageCreate', messageController.messageCreate);
  app.post('/api/v1/messageUpdate', messageController.messageUpdate);
  app.post('/api/v1/messageDelete', messageController.messageDelete);
  app.get('/api/v1/getMessages', messageController.getMessages);
};