const friendController = require('../controllers/friendController');

module.exports = function(app) {
  app.get('/api/v1/findFriends', friendController.findFriends);
  app.post('/api/v1/friendCreate', friendController.friendCreate);
  app.delete('/api/v1/friendDelete', friendController.friendDelete);
};