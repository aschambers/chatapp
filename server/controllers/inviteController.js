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
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { expires, serverId } = req.body;

    req.body.token = crypto.randomBytes(12).toString('hex');
    req.body.code = 'invite-' + crypto.randomBytes(12).toString('hex');

    if (!expires || !serverId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    const result = await InviteModel.create(req.body);
    if (!result) return res.status(422).json({"error":"Unable to create invite"});

    res.status(200).send(`${result.code}`);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {string} success message
   */
  inviteEmailCreate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { expires, serverId, email } = req.body;

    req.body.token = crypto.randomBytes(12).toString('hex');
    req.body.code = 'invite-' + crypto.randomBytes(12).toString('hex');

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
      html: 'Please use this invite code to join the server ' + server.name + '.\n\n' + `${result.code}`
    };
    const sentEmail = await sgMail.send(msg);
    if (!sentEmail) return res.status(422).send({"error":"Unknown error creating user"});

    res.status(200).send({"success":"Invite created successfully"});
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} server object
   */
  inviteVerification: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { userId, code, email } = req.body;

    const validInvite = await InviteModel.findOne({ where: { code: code } });
    if (!validInvite) return res.status(422).send({"error":"Error verifying invite"});
    if (moment(validInvite.updatedAt).valueOf() > moment().add(validInvite.expires, 'hours').valueOf()) {
      return res.status(422).send({"error":"Error verifying invite date"});
    }

    const server = await ServerModel.findOne({ where: { id: validInvite.serverId }});
    if (!server) return res.status(422).send({'error': 'Failed to find server'});

    const user = await UserModel.findOne({ where: { email: email }});
    if (!user) return res.status(422).send({'error': 'Failed to find user'});

    if (!server.userBans) server.userBans = [];
    const index = server.userBans.findIndex(x => x.userId === userId);

    if (index > -1) {
      return res.status(422).send({"error":"Error adding server to user servers list"});
    }

    if (!user.serversList) user.serversList = [];
    let foundServerForUser = false;

    for (let i = 0; i < user.serversList.length; i++) {
      if (user.serversList[i].serverId === server.id) {
        foundServerForUser = true;
        break;
      }
    }

    if (foundServerForUser) return res.status(422).send({"error":"You have already joined the server"});

    user.serversList.push({
      serverId: server.id,
      name: server.name,
      imageUrl: server.imageUrl,
      region: server.region
    });

    const updateServerList = await user.update(
      { serversList: user.serversList },
      { where: { id: user.id }}
    );

    if (!updateServerList) return res.status(422).send({"error":"Error adding server to user servers list"});

    if (!server.userList) server.userList = [];
    let foundUser = false;

    for (let x = 0; x < server.userList.length; x++) {
      if (server.userList[x].id === user.id) {
        foundUser = true;
      }
    }

    if (!foundUser) {
      server.userList.push({
        userId: user.id,
        username: user.username,
        imageUrl: user.imageUrl,
        type: 'user',
        active: true
      });
    }

    const updateUserList = await server.update(
      { userList: server.userList },
      { where: { id: server.id }}
    );

    if (!updateUserList) return res.status(422).send({"error":"Error adding users to server list"});

    res.status(200).send(updateServerList.serversList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} invites
   */
  findInvites: async(req, res) => {
    const { serverId } = req.query;

    const invitesList = await InviteModel.findAll({ where: { serverId: serverId } });
    res.status(200).send(invitesList);
  }

}