const InviteModel = require('../models/Invite');
const ServerModel = require('../models/Server');
const UserModel = require('../models/User');
const keys = require('../config/keys');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const moment = require('moment');
sgMail.setApiKey(keys.sendgrid_key);

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {string} success message
   */
  inviteCreate: async(req, res) => {
    const { expires, serverId } = req.body;
    req.body.token = crypto.randomBytes(12).toString('hex');
    req.body.code = crypto.randomBytes(32).toString('hex');

    if (!expires || !serverId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    const result = await InviteModel.create(req.body);
    if (!result) return res.status(422).json({"error":"Unable to create invite"});

    const inviteLink = `${keys.email_link}/Invite?token=${result.token}`
    return res.status(200).send(inviteLink);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {string} success message
   */
  inviteEmailCreate: async(req, res) => {
    const { expires, serverId, email } = req.body;
    req.body.token = crypto.randomBytes(12).toString('hex');
    req.body.code = crypto.randomBytes(32).toString('hex');

    if (!expires || !serverId || !email) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    const result = await InviteModel.create(req.body);
    if (!result) return res.status(422).json({"error":"Unable to create invite"});

    const server = await ServerModel.findOne({ where: { id: serverId }});
    if (!server) return res.status(422).send({'error': 'Failed to find server'});

    const msg = {
      to: req.body.email,
      from: 'invite@chatter.com',
      subject: 'Invitation to join server',
      html: 'Please use this link to join the server the server ' + server.name + '.\n\n' + `${keys.email_link}/Invite?token=${result.token}&email=${email}`
    };
    const sentEmail = await sgMail.send(msg);

    if (sentEmail) {
      return res.status(200).send({"success":"Invite created successfully"});
    } else {
      return res.status(422).send({"error":"Unknown error creating user"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} server object
   */
  inviteVerification: async(req, res) => {
    const { token, email } = req.body;

    const validInvite = await InviteModel.findOne({ where: { token: token, expires: createdAt } });
    if (!validInvite) return res.status(422).send({"error":"Error verifying invite"});

    if (moment(validInvite.updatedAt).valueOf() <= moment().add(validInvite.expires, 'hours').valueOf()) {
      return res.status(422).send({"error":"Error verifying invite"});
    }

    const server = await ServerModel.findOne({ where: { id: validInvite.serverId }});
    if (!server) return res.status(422).send({'error': 'Failed to find server'});

    const user = await UserModel.findOne({ where: { email: email }});
    if (!user) return res.status(422).send({'error': 'Failed to find user'});

    if (!server.userList) server.userList = [];
    server.userList.push({
      userId: user.id,
      username: user.username,
      type: 'user'
    });

    const updateUserList = await server.update(
      { userList: server.userList },
      { where:  { id: server.id }}
    );

    if (!updateUserList) return res.status(200).send({"error":"Error adding users to server list"});

    res.status(200).send(server);
  }

}