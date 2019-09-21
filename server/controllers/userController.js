const UserModel = require('../models/User');
const ServerModel = require('../models/Server');
const MessageModel = require('../models/Message');
const FriendModel = require('../models/Friend');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const moment = require('moment');
sgMail.setApiKey(keys.sendgrid_key);
const Op = Sequelize.Op;

cloudinary.config({
  cloud_name: keys.cloudinary_name,
  api_key: keys.cloudinary_key,
  api_secret: keys.cloudinary_secret
});

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  userSignup: async(req, res) => {
    const { username, password, email } = req.body;
    const token = crypto.randomBytes(64).toString('hex');
    if (!username && !password && !email) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    req.body.token = token;
    // check if username or email already exist
    const user = await UserModel.findOne({ where: {
      [Op.or]: [{username: username}, {email: email}]
    }});
    if (!user) {
      req.body.isVerified = false;
      const result = await UserModel.create(req.body);
      if (result) {
        const msg = {
          to: req.body.email,
          from: 'verification@chatter.com',
          subject: 'Verify your account',
          html: 'Please click this link to verify your account. <br>' + `${keys.email_link}/Verification?token=${token}&email=${email}`
        };
        const sentEmail = await sgMail.send(msg);

        if (sentEmail) {
          return res.status(200).send(result);
        } else {
          return res.status(422).send({"error":"Unknown error creating user"});
        }
      } else {
        return res.status(422).send({"error":"Unknown error creating user"});
      }
    } else {
      return res.status(422).json({"error":"User exists"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  userVerification: async(req, res) => {
    const { email, token } = req.body;

    const validUser = await UserModel.findOne({ where: {
      [Op.and]: [{ email: email }, { isVerified: true }]
    }});

    if (validUser) return res.status(200).send({"success":"Account has already been verified"});

    const user = await UserModel.findOne({ where: {
      [Op.and]: [{ email: email }, { token: token }]
    }});

    if (!user) return res.status(422).send({"error":"Error verifying account"});

    if (moment(user.updatedAt).valueOf() >= moment().add(2, 'hours').valueOf()) {
      return res.status(422).send({"error":"Error verifying account"});
    }

    const verifyAccount = await user.update(
      { isVerified: true },
      { where: { id: user.id }}
    );

    if (verifyAccount) {
      res.status(200).send({"success":"Success verifying account"});
    } else {
      res.status(422).send({"error":"Error verifying account"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  userLogin: async(req, res, next) => {
    const { email, password } = req.body;
    const loginUser = await UserModel.findOne({ where: { email: email } });

    if (!loginUser) return res.status(422).send({"error":"user-not-found"});
    if (!loginUser.isVerified) return res.status(400).send({"error": "Account not verified"});
    if (loginUser) {
      loginUser.active = true;

      const servers = await ServerModel.findAll();
      if (servers && servers.length) {
        for (let i = 0; i < servers.length; i++) {
          if (servers[i].userList && servers[i].userList.length) {
            for (let j = 0; j < servers[i].userList.length; j++) {
              if (+servers[i].userList[j].userId === +loginUser.id) {
                servers[i].userList[j].active = true;

                const serversUpdate = await servers[i].update(
                  { userList: servers[i].userList },
                  { where: { id: servers[i].id }}
                );

                if (!serversUpdate) {
                  res.status(422).send({"error":"error-updating-userlist"});
                }
              }
            }
          }
        }
      }

      let saveLoginUser = await loginUser.save();
      if(saveLoginUser) {
        const authentication = bcrypt.compareSync(password, loginUser.password);
        if(authentication) {
          const token = jwt.sign({ loginUser }, keys.secret);
          res.status(200).send(token);
        } else {
          res.status(422).send({"error":"invalid-password"});
        }
      } else {
        res.status(422).send({"error":"user-not-found"});
      }
    } else {
      res.status(422).send({"error":"user-not-found"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  userLogout: async(req, res, next) => {
    const logoutUser = await UserModel.findByPk(req.body.id);
    if(logoutUser) {
      logoutUser.active = false;

      const servers = await ServerModel.findAll();
      if (servers && servers.length) {
        for (let i = 0; i < servers.length; i++) {
          if (servers[i].userList && servers[i].userList.length) {
            for (let j = 0; j < servers[i].userList.length; j++) {
              if (+servers[i].userList[j].userId === +logoutUser.id) {
                servers[i].userList[j].active = false;

                const serversUpdate = await servers[i].update(
                  { userList: servers[i].userList },
                  { where: { id: servers[i].id }}
                );

                if (!serversUpdate) {
                  res.status(422).send({"error":"error-updating-userlist"});
                }
              }
            }
          }
        }
      }

      let saveLogoutUser = await logoutUser.save();
      if(saveLogoutUser) {
        res.status(200).send(saveLogoutUser);
      } else {
        res.status(422).send({"error":"user-logout-failed"});
      }
    } else {
      res.status(422).send({"error":"user-not-found"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of users
   */
  getUsers: async(req, res, next) => {
    const result = await UserModel.findAll();
    if(result) {
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error fetching all users'});
    };
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  getSingleUser: async(req, res, next) => {
    const userId = req.body.userId;
    // findbypk = findbyid, but findbyid is deprecated
    const result = await UserModel.findByPk(userId);
    if(result) {
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error fetching that user'});
    };
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  userUpdate: async(req, res, next) => {
    const { id, username, email, imageUrl, serverId } = req.body;

    const myEmail = await UserModel.findAll({ where: { id: id, email: email }});
    if (myEmail && myEmail.length === 0) {
      const anotherEmail = await UserModel.findAll({ where: { email: email }});
      if (anotherEmail && anotherEmail.length > 0) {
        return res.status(422).send('email-exists');
      }
    }

    const myUsername = await UserModel.findAll({ where: { id: id, username: username }});
    if (myUsername.length === 0) {
      const anotherUsername = await UserModel.findAll({ where: { username: username }});
      if (anotherUsername.length > 0) {
        return res.status(422).send('username-exists');
      }
    }

    const user = await UserModel.findByPk(id);
    const originalUsername = user.username;

    if (imageUrl && req.files && req.files.mainFile) {
      if (req.files.mainFile[0].mimetype === 'image/jpeg' || req.files.mainFile[0].mimetype === 'image/png' || req.files.mainFile[0].mimetype === 'image/gif') {
        const encoded = req.files.mainFile[0].data.toString('base64');
        await cloudinary.uploader.upload("data:image/png;base64," + encoded, async(result, err) => {
          const newImage = result && result.url ? result.url.replace(/^http:\/\//i, 'https://') : null;

          const updateServer = await ServerModel.findAll();

          for (let i = 0; i < updateServer.length; i++) {
            if (updateServer[i].userList && updateServer[i].userList.length) {
              for (let j = 0; j < updateServer[i].userList.length; j++) {
                if (+updateServer[i].userList[j].userId === +id) {
                  newImage ? updateServer[i].userList[j].imageUrl = newImage : update[i].userList[j].imageUrl = update[i].userList[j].imageUrl;
                  updateServer[i].userList[j].username = username;

                  await updateServer[i].update(
                    { userList: updateServer[i].userList },
                    { where: { id: updateServer[i].id }}
                  );
                }
              }
            }
          }

          const messageUpdate = await MessageModel.findAll({ where: { userId: id }});

          for (let m = 0; m < messageUpdate.length; m++) {
            await messageUpdate[m].update(
              { username: username },
              { where: { id: messageUpdate[m].id }}
            );
          }

          const friendUpdate = await FriendModel.findAll({ where: { username: user.username }});

          for (let a = 0; a < friendUpdate.length; a++) {
            newImage ? friendUpdate[a].imageUrl = newImage : friendUpdate[a].imageUrl = friendUpdate[a].imageUrl;
            await friendUpdate[a].update(
              { username: username, imageUrl: friendUpdate[a].imageUrl  },
              { where: { username: originalUsername }}
            );
          }

          const updateAccount = newImage ? await user.update(
            { email: email, username: username, imageUrl: newImage },
            { where:  { id: user.id }}
          ) : await user.update(
            { email: email, username: username },
            { where: { id: user.id }}
          );

          if (updateAccount) {
            return res.status(200).send(updateAccount);
          } else {
            return res.status(422).send('user-update-error');
          }
        });
      } else {
        return res.status(422).send('user-update-error');
      }
    } else {
      const updateServer = await ServerModel.findAll();

      for (let i = 0; i < updateServer.length; i++) {
        if (updateServer[i].userList && updateServer[i].userList.length) {
          for (let j = 0; j < updateServer[i].userList.length; j++) {
            if (+updateServer[i].userList[j].userId === +id) {
              updateServer[i].userList[j].username = username;

              await updateServer[i].update(
                { userList: updateServer[i].userList },
                { where: { id: updateServer[i].id }}
              );
            }
          }
        }
      }

      const messageUpdate = await MessageModel.findAll({ where: { userId: id }});

      for (let m = 0; m < messageUpdate.length; m++) {
        await messageUpdate[m].update(
          { username: username },
          { where: { id: messageUpdate[m].id }}
        );
      }

      const friendUpdate = await FriendModel.findAll({ where: { username: user.username }});

      for (let a = 0; a < friendUpdate.length; a++) {
        await friendUpdate[a].update(
          { username: username },
          { where: { username: originalUsername }}
        );
      }

      const updateAccount = await user.update(
        { email: email, username: username },
        { where:  { id: user.id }}
      );

      if (updateAccount) {
        return res.status(200).send(updateAccount);
      } else {
        return res.status(422).send('user-update-error');
      }
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of users
   */
  deleteUser: async(req, res, next) => {
    const deleteUser = await UserModel.destroy({where: { id: req.body.userId }});
    if(deleteUser) {
      const result = await UserModel.findAll();
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error deleting user'});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  uploadProfileImage: async(req, res, next) => {
    const { id } = req.body;
    const user = await UserModel.findByPk(id);
    if(user) {
      if (req.files.myFile[0].mimetype === 'image/jpeg' || req.files.myFile[0].mimetype === 'image/png' || req.files.myFile[0].mimetype === 'image/gif') {
        const encoded = req.files.myFile[0].data.toString('base64');
        cloudinary.uploader.upload("data:image/png;base64," + encoded, async(result, err) => {
          if (!result) {
            res.status(422).send('uploading-file-failed');
          } else {
            user.imageUrl = result.url.replace(/^http:\/\//i, 'https://');
            let userUpdate = await user.save({ fields: ['imageUrl'] });
            if(userUpdate) {
              res.status(200).send(userUpdate);
            } else {
              res.status(422).send('user-image-not-saved');
            }
          }
        });
      } else {
        res.status(422).send('error-reading-file');
      }
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  sendEmail: async(req, res) => {
    const { email } = req.body;
    const token = crypto.randomBytes(64).toString('hex');
    if (!email) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    req.body.token = token;
    // check if username or email already exist
    const user = await UserModel.findOne({ where: { email: email } });
    if (user) {
      const updateAccount = await user.update(
        { token: token },
        { where:  { id: user.id }}
      );

      if (updateAccount) {
        const msg = {
          to: req.body.email,
          from: 'verification@chatter.com',
          subject: 'Verify your account',
          html: 'Please click this link to verify your account. <br>' + `${keys.email_link}/Verification?token=${token}&email=${email}`
        };
        const sentEmail = await sgMail.send(msg);

        if (sentEmail) {
          return res.status(200).send(user);
        } else {
          return res.status(422).send({"error":"Unknown error sending email"});
        }
      } else {
        return res.status(422).send({"error":"Error updating account"});
      }
    } else {
      return res.status(422).send({"error":"User does not exist"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {string} success
   */
  forgotPassword: async(req, res) => {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');

    if (!email) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    const user = await UserModel.findOne({ where: { email: email } });
    if (!user) return res.status(422).send({"error":"Error resetting password"});

    const updateUser = await user.update(
      { resetPasswordToken: token },
      { where: { id: user.id }}
    );

    if (!updateUser) return res.status(422).send('token not saved');

    const msg = {
      to: req.body.email,
      from: 'resetpassword@chatter.com',
      subject: 'Reset Password',
      html: 'Please click this link to reset your password. <br>' + `${keys.email_link}/ResetPassword?token=${token}&email=${email}`
    };
    const sentEmail = await sgMail.send(msg);

    if (!sentEmail) return res.status(422).send({"error":"Error resetting password"});

    return res.status(200).send({"success":"Success sending email"});
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {string} success
   */
  resetPassword: async(req, res) => {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    const user = await UserModel.findOne({ where: { resetPasswordToken: token } });

    if (!user) return res.status(422).send({"error":"Error resetting password"});

    if (moment(user.updatedAt).valueOf() >= moment().add(2, 'hours').valueOf()) {
      return res.status(422).send({"error":"Error resetting password"});
    }

    user.password = password;
    let userUpdate = await user.save({ fields: ['password'] });
    if(userUpdate) {
      res.status(200).send(userUpdate);
    } else {
      res.status(422).send('user-image-not-saved');
    }
  }

}