const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

module.exports = async(req, res, next) => {
  try {
    if (!req.headers.authorization) return next();

    console.log(req.method);
    console.log(req.ip.split(":").pop());
    console.log(req.headers['user-agent']);

    const type = req.headers.authorization.split(" ")[0];
    const token = req.headers.authorization.split(" ")[1];

    if (type !== 'bearer') {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }

    // verify and return decoded value
    await jwt.verify(token, keys.secret);
    req.authorizedRequest = true;
    //successfully authenticated user
    next();
  } catch (error) {
    console.log('auth error: ' + error);
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}