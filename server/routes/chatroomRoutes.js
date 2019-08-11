const chatroomController = require('../controllers/chatroomController');

module.exports = function(app) {
  app.post('/api/v1/chatroomCreate', chatroomController.chatroomCreate);
  app.post('/api/v1/chatroomDelete', chatroomController.chatroomDelete);
  app.post('/api/v1/getChatrooms', chatroomController.getChatrooms);
};