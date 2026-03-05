const userController = require('../controllers/userController');

// Token bucket: 40 capacity, refill 5 tokens every 5s, per IP
const BUCKET_CAPACITY = 40;
const REFILL_AMOUNT = 5;
const REFILL_INTERVAL_MS = 5000;
const buckets = new Map();

setInterval(() => {
  for (const bucket of buckets.values()) {
    bucket.tokens = Math.min(BUCKET_CAPACITY, bucket.tokens + REFILL_AMOUNT);
  }
}, REFILL_INTERVAL_MS);

const createAccountLimiter = (req, res, next) => {
  const ip = req.ip;
  if (!buckets.has(ip)) buckets.set(ip, { tokens: BUCKET_CAPACITY });
  const bucket = buckets.get(ip);
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return next();
  }
  return res.status(429).json({ message: 'Too many requests, please slow down.' });
};

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