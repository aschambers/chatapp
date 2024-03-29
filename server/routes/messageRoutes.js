const messageController = require('../controllers/messageController');

module.exports = function(app) {
  app.get('/api/v1/getChatroomMessages', messageController.getChatroomMessages);
  app.get('/api/v1/getPrivateMessages', messageController.getPrivateMessages);
  app.get('/api/v1/getPersonalMessages', messageController.getPersonalMessages);
  app.post('/api/v1/messageChatroomCreate', messageController.messageChatroomCreate);
  app.post('/api/v1/messagePrivateCreate', messageController.messagePrivateCreate);
  app.post('/api/v1/messagePrivateEdit', messageController.messagePrivateEdit);
  app.post('/api/v1/messagePersonalCreate', messageController.messagePersonalCreate);
  app.put('/api/v1/messageChatroomEdit', messageController.messageChatroomEdit);
  app.put('/api/v1/messagePersonalEdit', messageController.messagePersonalEdit);
  app.delete('/api/v1/messagePersonalDelete', messageController.messagePersonalDelete);
  app.delete('/api/v1/messagePrivateDelete', messageController.messagePrivateDelete);
  app.delete('/api/v1/messageChatroomDelete', messageController.messageChatroomDelete);
};