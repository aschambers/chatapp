const FriendModel = require('../models/Friend');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} friend list
   */
  friendCreate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { username, friendUsername, userId, friendId } = req.body;

    if (!username || !friendUsername || !userId || !friendId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    req.body.groupId = crypto.randomBytes(32).toString('hex');
    req.body.activeFriend = true;

    const friendFinder = await FriendModel.findOne({ where: {
      [Op.and]: [{ userId: userId }, { friendId: friendId }]
    }});

    if (!friendFinder) {
      const result = await FriendModel.create(req.body);
      if (!result) return res.status(422).json({'error':'Unable to create friend'});
    } else if (friendFinder) {
      const result = await FriendModel.update(
        { activeFriend: req.body.activeFriend }, { where: { id: userId } }
      );
      if (!result) return res.status(422).json({'error':'Unable to add friend back'});
    }

    const userFinder = await FriendModel.findOne({ where: {
      [Op.and]: [{ userId: friendId }, { friendId: userId }]
    } });

    const user = req.body.friendId;
    const friend = req.body.userId;

    req.body.userId = user;
    req.body.friendId = friend;
    req.body.username = req.body.friendUsername;

    if (!userFinder) {
      const result = await FriendModel.create(req.body);
      if (!result) return res.status(422).json({'error':'Unable to create friend'});
    } else if (userFinder) {
      const result = await FriendModel.update(
        { activeFriend: req.body.activeFriend }, { where: { id: userId } }
      );
      if (!result) return res.status(422).json({'error':'Unable to add friend back'});
    }

    req.body.userId = friend;
    req.body.friendId = user;

    const friendsList = await FriendModel.findAll({ where: { userId: userId } });
    res.status(200).send(friendsList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} friend list
   */
  friendDelete: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    const currentFriend = await FriendModel.findOne({ where: { [Op.and]: [{ userId: userId }, { friendId: friendId }] }});
    if (!currentFriend) return res.status(422).json({'error':'Unable to update current friend'});

    const updateFriend = await currentFriend.update(
      { activeFriend: false },
      { where: { [Op.and]: [{ userId: userId }, { friendId: friendId }] }}
    );
    if (!updateFriend) return res.status(422).json({'error':'Unable to update friends list'});

    const friendsList = await FriendModel.findAll({ where: { userId: userId }});
    res.status(200).send(friendsList);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} friend list
   */
  findFriends: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { userId } = req.body;

    if (!userId) return res.status(400).send({'error':'Missing required fields'});

    const friendsList = await FriendModel.findAll({ where: { userId: userId }});
    res.status(200).send(friendsList);
  }

}