const messageController = require('../controllers/messageController');

module.exports = function(app) {
  app.post('/api/v1/messageChatroomCreate', messageController.messageChatroomCreate);
  app.post('/api/v1/messageChatroomDelete', messageController.messageChatroomDelete);
  app.put('/api/v1/messageChatroomEdit', messageController.messageChatroomEdit);
  app.post('/api/v1/getChatroomMessages', messageController.getChatroomMessages);
  app.post('/api/v1/getPrivateMessages', messageController.getPrivateMessages);
  app.post('/api/v1/messagePrivateCreate', messageController.messagePrivateCreate);
  app.post('/api/v1/messagePrivateDelete', messageController.messagePrivateDelete);
  app.put('/api/v1/messagePrivateEdit', messageController.messagePrivateEdit);
  app.post('/api/v1/getPersonalMessages', messageController.getPersonalMessages);
  app.post('/api/v1/messagePersonalCreate', messageController.messagePersonalCreate);
  app.post('/api/v1/messagePersonalDelete', messageController.messagePersonalDelete);
  app.put('/api/v1/messagePersonalEdit', messageController.messagePersonalEdit);
};