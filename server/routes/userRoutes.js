const userController = require('../controllers/userController');
const rateLimit = require("express-rate-limit");
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
});

module.exports = function(app) {
  app.get('/api/v1/getUsers', userController.getUsers);
  app.get('/api/v1/getSingleUser', userController.getSingleUser);
  app.post('/api/v1/userSignup', createAccountLimiter, userController.userSignup);
  app.post('/api/v1/userLogin', userController.userLogin);
  app.post('/api/v1/userLogout', userController.userLogout);
  app.post('/api/v1/sendEmail', createAccountLimiter, userController.sendEmail);
  app.post('/api/v1/forgotPassword', createAccountLimiter, userController.forgotPassword);
  app.post('/api/v1/resetPassword', userController.resetPassword);
  app.put('/api/v1/userVerification', createAccountLimiter, userController.userVerification);
  app.put('/api/v1/userUpdate', userController.userUpdate);
  app.put('/api/v1/uploadProfileImage', userController.uploadProfileImage);
  app.delete('/api/v1/deleteUser', userController.deleteUser);
};