const keys = require('../config/keys');
const { jwtVerify } = require('jose');

module.exports = async(req, res, next) => {
  try {
    if (!req.headers.authorization) return next();

    const type = req.headers.authorization.split(" ")[0];
    const token = req.headers.authorization.split(" ")[1];

    if (type !== 'bearer') {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }

    const secret = new TextEncoder().encode(keys.secret);
    await jwtVerify(token, secret);
    req.authorizedRequest = true;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}