const FriendModel = require('../models/Friend');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} friend list
   */
  friendCreate: async(req, res) => {
    const { username, friendUsername, userId, friendId } = req.body;

    if (!username || !friendUsername || !userId || !friendId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    req.body.activeFriend = true;

    const friendFinder = await FriendModel.findOne({ where: {
      [Op.and]: [{ userId: userId }, { friendId: friendId }]
    }});

    if (!friendFinder) {
      const result = await FriendModel.create(req.body);
      if (!result) return res.status(422).json({"error":"Unable to create friend"});
    } else if (friendFinder) {
      const result = await FriendModel.save(req.body);
      if (!result) return res.status(422).json({"error":"Unable to add friend back"});
    }

    const userFinder = await FriendModel.findOne({ where: {
      [Op.and]: [{ userId: friendId }, { friendId: userId }]
    }});

    const user = req.body.friendId;
    const friend = req.body.userId;
    if (!userFinder) {
      req.body.userId = user;
      req.body.friendId = friend;
      req.body.username = req.body.friendUsername;
      const result = await FriendModel.create(req.body);
      if (!result) return res.status(422).json({"error":"Unable to create friend"});
    } else if (userFinder) {
      req.body.userId = user;
      req.body.friendId = friend;
      req.body.username = req.body.friendUsername;
      const result = await FriendModel.save(req.body);
      if (!result) return res.status(422).json({"error":"Unable to add friend back"});
    }

    req.body.userId = friend;
    req.body.friendId = user;

    const friendsList = await FriendModel.findAll({ where: { userId: userId }});
    return res.status(200).send(friendsList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} friend list
   */
  friendDelete: async(req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    req.body.activeFriend = false;

    const result = await FriendModel.save(req.body);
    if (!result) return res.status(422).json({"error":"Unable to update friend"});

    const friendsList = await FriendModel.findAll({ where: { userId: userId }});
    return res.status(200).send(friendsList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} friend list
   */
  findFriends: async(req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }

    const friendsList = await FriendModel.findAll({ where: { userId: userId }});
    return res.status(200).send(friendsList);
  }

}