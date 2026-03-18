const ServerModel = require('../models/Server');
const UserModel = require('../models/User');
const ChatroomModel = require('../models/Chatroom');
const keys = require('../config/keys');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: keys.cloudinary_name,
  api_key: keys.cloudinary_key,
  api_secret: keys.cloudinary_secret
});

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} server object
   */
  serverCreate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { name, userId, public, region } = req.body;
    req.body.active = true;

    if (!name || !userId || public == null || !region) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    // Step 1: Check to see if server already exists with this name
    const existingServer = await ServerModel.findOne({ where: { name: name }});
    if (existingServer) return res.status(400).send({'error':'Server exists'});

    // Step 2: Upload image to cloudinary and set imageUrl to uploaded image.
    if (req.files && req.files.imageUrl) {
      if (req.files.imageUrl && req.files.imageUrl.mimetype === 'image/jpeg' || req.files.imageUrl.mimetype === 'image/png' || req.files.imageUrl.mimetype === 'image/gif') {
        const encoded = req.files.imageUrl.data.toString('base64');
        const result = await cloudinary.uploader.upload('data:image/png;base64,' + encoded);
        if (!result) return res.status(422).send({'error':'Failed to upload image URL'});
        req.body.imageUrl = result.url.replace(/^http:\/\//i, 'https://');
      }
    }

    // Step 3: Create the server with required fields.
    const newServer = await ServerModel.create(req.body);
    if (!newServer) return res.status(422).send({'error':'Failed to create the server'});

    // Step 4: Find user who is creating the server by userId and use to add the new server to his list of servers he has created or joined.
    const updateUser = await UserModel.findOne({ where: { id: userId }});
    if (!updateUser) return res.status(422).send({'error':'Failed to find user who created the server'});

    // Step 5: Add this new server to list of servers for this user
    if (!updateUser.serversList) updateUser.serversList = [];
    updateUser.serversList.push({
      serverId: newServer.id,
      name: name,
      imageUrl: req.body.imageUrl,
      region: req.body.region,
      active: true
    });

    // Step 6: Update list of servers by userId
    updateUser.changed('serversList', true);
    const serversUpdate = await updateUser.save();

    // Step 7: Add user to new server list
    if (!newServer.userList) newServer.userList = [];
    newServer.userList.push({
      userId: userId,
      username: updateUser.username,
      imageUrl: updateUser.imageUrl,
      type: 'owner',
      active: true
    });

    // Step 8: Update list of users in server
    newServer.changed('userList', true);
    const userListUpdate = await newServer.save();

    if (!userListUpdate) return res.status(422).send({'error':'Failed to update user list on server'});

    if (!serversUpdate) return res.status(422).send({'error':'Failed to update server list'});

    // Step 9: Create general chatroom in server
    req.body.name = 'general';
    req.body.serverId = newServer.id;
    req.body.type = 'text';

    const result = await ChatroomModel.create(req.body);
    if (!result) return res.status(422).send({'error':'Unknown error creating chatroom'});

    res.status(200).send(serversUpdate.serversList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of servers
   */
  serverFind: async(req, res, next) => {
    const user = await UserModel.findByPk(req.query.id);

    if (!user) return res.status(422).send({'error':'Error deleting server'});

    res.status(200).send(user.serversList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of servers
   */
  findUserList: async(req, res, next) => {
    const server = await ServerModel.findByPk(req.query.serverId);

    if (!server || !server.userList) return res.status(422).send({'error':'Error finding server'});

    res.status(200).send(server.userList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of banned users
   */
  findUserBans: async(req, res, next) => {
    const server = await ServerModel.findByPk(req.query.serverId);

    if (!server) return res.status(422).send({'error':'Error finding server'});
    if (!server.userBans) server.userBans = [];

    res.status(200).send(server.userBans);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of banned users
   */
  unbanUser: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { userId, serverId } = req.body;

    const server = await ServerModel.findByPk(serverId);
    if (!server) return res.status(422).send({'error':'Error finding server'});
    if (!server.userBans) server.userBans = [];

    const length = server.userBans.length;

    const index = server.userBans.findIndex(x => x.userId === userId);
    if (index > -1) {
      server.userBans.splice(index, 1);
    }

    if (length === 1) {
      server.userBans = null;
    }

    const updateServerSuccess = await server.update(
      { userBans: server.userBans },
      { where: { id: serverId }}
    );
    if (!updateServerSuccess) return res.status(422).json({'error':'Error saving server bans'});

    if (server.userBans === null) server.userBans = [];

    res.status(200).send(server.userBans);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} server object
   */
  serverDelete: async(req, res, next) => {
    const { userId, serverId } = req.body;

    if (!userId || !serverId) return res.status(400).send({'error':'Missing required fields'});

    const deleteServer = await ServerModel.destroy({where: { id: serverId }});
    if (!deleteServer) return res.status(422).send({'error':'Error deleting server'});

    const user = await UserModel.findByPk(userId);
    if (!user) return res.status(422).send({'error':'User not found'});

    if (!user.serversList) user.serversList = [];

    for (let i = 0; i < user.serversList.length; i++) {
      if (user.serversList[i].serverId === serverId) {
        user.serversList.splice(i, 1);
        break;
      }
    }

    user.changed('serversList', true);
    const updateAccount = await user.save();
    if (!updateAccount) return res.status(422).send({'error':'Account update failed'});

    res.status(200).send(user.serversList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} server list
   */
  updateUserRole: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { active, imageUrl, type, userId, username, serverId } = req.body;

    if (!active || !type || !userId || !username || !serverId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    const updateServer = await ServerModel.findOne({ where: { id: req.body.serverId } });
    if (!updateServer) return res.status(422).json({'error':'Error finding server'});

    const index = updateServer.userList.findIndex(x => x.userId === userId);
    if (index < 0) return res.status(422).json({'error':'Error finding user on server'});

    updateServer.userList[index] = {
      type: type,
      active: active,
      userId: userId,
      imageUrl: imageUrl,
      username: username
    }

    updateServer.changed('userList', true);
    const result = await updateServer.save();
    if (!result) return res.status(422).send({'error':'Error finding server'});

    res.status(200).send(updateServer.userList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} server list
   */
  kickServerUser: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { serverId, type, userId } = req.body;

    if (!serverId || !type || !userId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    // user
    const updateUser = await UserModel.findByPk(userId);
    if (!updateUser) return res.status(422).json({'error':'Error finding user'});

    const userIndex = updateUser.serversList.findIndex(x => x.serverId === serverId);
    if (userIndex < 0) return res.status(422).json({'error':'Error finding server user'});

    updateUser.serversList.splice(userIndex, 1);

    updateUser.changed('serversList', true);
    const updateUserSuccess = await updateUser.save();
    if (!updateUserSuccess) return res.status(422).json({'error':'Error saving user'});

    // server
    const updateServer = await ServerModel.findByPk(serverId);
    if (!updateServer) return res.status(422).json({'error':'Error finding server'});

    const index = updateServer.userList.findIndex(x => x.userId === userId);
    if (index < 0) return res.status(422).json({'error':'Error finding user on server'});

    updateServer.userList.splice(index, 1);

    updateServer.changed('userList', true);
    const updateSuccess = await updateServer.save();

    if (!updateSuccess) return res.status(422).send({'error':'Error fetching all server users'});

    res.status(200).send(updateServer.userList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} server list
   */
  banServerUser: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { serverId, type, userId } = req.body;

    if (!serverId || !type || !userId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    // user
    const updateUser = await UserModel.findByPk(userId);
    if (!updateUser) return res.status(422).json({'error':'Error finding user'});

    const userIndex = updateUser.serversList.findIndex(x => x.serverId === serverId);
    if (userIndex < 0) return res.status(422).json({'error':'Error finding server user'});

    updateUser.serversList.splice(userIndex, 1);

    updateUser.changed('serversList', true);
    const updateUserSuccess = await updateUser.save();
    if (!updateUserSuccess) return res.status(422).json({'error':'Error saving user'});

    // server
    const updateServer = await ServerModel.findByPk(serverId);
    if (!updateServer) return res.status(422).json({'error':'Error finding server'});

    const index = updateServer.userList.findIndex(x => x.userId === userId);
    if (index < 0) return res.status(422).json({'error':'Error finding user on server'});

    updateServer.userList.splice(index, 1);

    // add user to server ban list
    if (!updateServer.userBans) updateServer.userBans = [];

    updateServer.userBans.push({
      userId: userId,
      username: updateUser.username,
      imageUrl: updateUser.imageUrl,
      type: updateUser.type
    });

    updateServer.changed('userList', true);
    updateServer.changed('userBans', true);
    const updateSuccess = await updateServer.save();

    if (!updateSuccess) return res.status(422).send({'error':'Error fetching all server users'});

    res.status(200).send(updateServer.userList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of servers
   */
  serverToggle: async(req, res, next) => {
    const { userId, serverId, active } = req.body;

    const updateUser = await UserModel.findByPk(userId);

    if (!updateUser) return res.status(422).send({'error':'Error finding user by id'});

    const serverIndex = updateUser.serversList.findIndex(x => x.serverId === serverId);
    if (serverIndex < 0) return res.status(422).json({'error':'Error finding server user by server id'});

    updateUser.serversList[serverIndex].active = active;
    
    updateUser.changed('serversList', true);
    const newServerList = await updateUser.save();

    if (!newServerList) return res.status(422).json({'error':'Error updating user server list'});

    res.status(200).send(updateUser.serversList);
  }

}