const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

module.exports = async(req, res, next) => {
  try {
    const type = req.headers.authorization.split(" ")[0];
    if (type !== 'bearer') {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    // verify and return decoded value
    const decoded = await jwt.verify(token, keys.secret);
    req.decoded = decoded;
    //successfully authenticated user
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}