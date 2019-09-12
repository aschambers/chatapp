const messageController = require('../controllers/messageController');

module.exports = function(app) {
  app.post('/api/v1/messageChatroomCreate', messageController.messageChatroomCreate);
  app.post('/api/v1/messageCreate', messageController.messageCreate);
  app.post('/api/v1/messageUpdate', messageController.messageUpdate);
  app.post('/api/v1/messageDelete', messageController.messageDelete);
  app.post('/api/v1/getChatroomMessages', messageController.getChatroomMessages);
  app.post('/api/v1/getPrivateMessages', messageController.getPrivateMessages);
  app.post('/api/v1/messagePrivateCreate', messageController.messagePrivateCreate);
  app.post('/api/v1/getPersonalMessages', messageController.getPersonalMessages);
  app.post('/api/v1/messagePersonalCreate', messageController.messagePersonalCreate);
};