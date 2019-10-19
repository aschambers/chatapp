const chatroomController = require('../controllers/chatroomController');

module.exports = function(app) {
  app.get('/api/v1/getChatrooms', chatroomController.getChatrooms);
  app.post('/api/v1/chatroomCreate', chatroomController.chatroomCreate);
  app.put('/api/v1/chatroomUpdate', chatroomController.chatroomUpdate);
  app.delete('/api/v1/chatroomDelete', chatroomController.chatroomDelete);
};