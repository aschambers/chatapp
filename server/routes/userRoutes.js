const userController = require('../controllers/userController');

module.exports = function(app) {
  app.get('/api/v1/getUsers', userController.getUsers);
  app.get('/api/v1/getSingleUser', userController.getSingleUser);
  app.post('/api/v1/userSignup', userController.userSignup);
  app.post('/api/v1/userLogin', userController.userLogin);
  app.post('/api/v1/userLogout', userController.userLogout);
  app.post('/api/v1/sendEmail', userController.sendEmail);
  app.post('/api/v1/forgotPassword', userController.forgotPassword);
  app.post('/api/v1/resetPassword', userController.resetPassword);
  app.put('/api/v1/userVerification', userController.userVerification);
  app.put('/api/v1/userUpdate', userController.userUpdate);
  app.put('/api/v1/uploadProfileImage', userController.uploadProfileImage);
  app.delete('/api/v1/deleteUser', userController.deleteUser);
};