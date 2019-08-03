const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // verify and return decoded value
    const decoded = jwt.verify(token, keys.secret);
    req.userData = decoded;
    //successfully authenticated user
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}