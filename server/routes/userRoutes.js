const userController = require('../controllers/userController');

module.exports = function(app) {
  app.post('/api/v1/userSignup', userController.userSignup);
  app.post('/api/v1/userLogin', userController.userLogin);
  app.post('/api/v1/userLogout', userController.userLogout);
  app.get('/api/v1/getUsers', userController.getUsers);
  app.post('/api/v1/getSingleUser', userController.getSingleUser);
  app.put('/api/v1/userUpdate', userController.userUpdate);
  app.post('/api/v1/deleteUser', userController.deleteUser);
  app.put('/api/v1/uploadProfileImage', userController.uploadProfileImage);
};