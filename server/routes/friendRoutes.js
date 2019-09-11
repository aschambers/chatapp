const friendController = require('../controllers/friendController');

module.exports = function(app) {
  app.post('/api/v1/friendCreate', friendController.friendCreate);
  app.post('/api/v1/friendDelete', friendController.friendDelete);
  app.post('/api/v1/findFriends', friendController.findFriends);
};