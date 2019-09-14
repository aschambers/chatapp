const MessageModel = require('../models/Message');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} message object
   */
  messageCreate: async(req, res) => {
    const { username, message, type } = req.body;
    if (!username && !message && !type) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await MessageModel.create(req.body);
    if(result) {
      return res.status(200).send(result);
    } else {
      return res.status(422).send({"error":"Unknown error creating message"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} message list
   */
  messageChatroomCreate: async(req, res) => {
    const { username, message, userId, chatroomId } = req.body;
    if (!username && !message && !userId && !chatroomId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await MessageModel.create(req.body);
    if (!result) return res.status(422).send({"error":"Unknown error creating message"});

    const messages = await MessageModel.findAll({ where: { chatroomId: chatroomId }, order: [['updatedAt', 'DESC']] });
    if (messages) {
      res.status(200).send(messages);
    } else {
      return res.status(422).send({"error":"Unknown error creating message"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} message object
   */
  messageUpdate: async(req, res, next) => {
    const { id, message } = req.body;
    const findMessage = await MessageModel.findByPk(id);
    if(findMessage) {
      findMessage.message = message;
      let messageUpdate = await findMessage.save();
      if(messageUpdate) {
        res.status(200).send(messageUpdate);
      } else {
        res.status(422).send('message-update-error');
      }
    } else {
      res.status(422).send({'error':'error finding updated message'});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  messageDelete: async(req, res, next) => {
    const deleteMessage = await MessageModel.destroy({where: { id: req.body.userId }});
    if(deleteMessage) {
      const result = await MessageModel.findAll();
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error deleting message'});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  getChatroomMessages: async(req, res, next) => {
    const { chatroomId } = req.body;
    const result = await MessageModel.findAll({ where: { chatroomId: chatroomId }, order: [['updatedAt', 'DESC']] });
    if(result) {
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error fetching all messages'});
    };
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  getPrivateMessages: async(req, res, next) => {
    const { userId, friendId } = req.body;
    const result = await MessageModel.findAll({ where: {
      [Op.or]: [
        { [Op.and]: [{ userId: userId }, { friendId: friendId }, { chatroomId: null }] },
        { [Op.and]: [{ userId: friendId }, { friendId: userId }, { chatroomId: null }] }
      ]
    }, order: [['updatedAt', 'DESC']] });
    if(result) {
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error fetching all messages'});
    };
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  getPersonalMessages: async(req, res, next) => {
    const { userId, friendId } = req.body;
    const result = await MessageModel.findAll({ where: {
      [Op.and]: [
        { chatroomId: null },
        { [Op.and]: [{ userId: userId }, { friendId: userId }] }
      ]
    }, order: [['updatedAt', 'DESC']] });
    if(result) {
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error fetching all messages'});
    };
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} message list
   */
  messagePrivateCreate: async(req, res) => {
    const { username, message, userId, friendId } = req.body;
    if (!username && !message && !userId && !friendId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await MessageModel.create(req.body);
    if (!result) return res.status(422).send({"error":"Unknown error creating message"});

    const messages = await MessageModel.findAll({ where: {
      [Op.or]: [
        { [Op.and]: [{ userId: userId }, { friendId: friendId }, { chatroomId: null }] },
        { [Op.and]: [{ userId: friendId }, { friendId: userId }, { chatroomId: null }] }
      ]
    }, order: [['updatedAt', 'DESC']] });
    if (messages) {
      res.status(200).send(messages);
    } else {
      return res.status(422).send({"error":"Unknown error creating message"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} message list
   */
  messagePersonalCreate: async(req, res) => {
    const { username, message, userId, friendId } = req.body;
    if (!username && !message && !userId && !friendId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await MessageModel.create(req.body);
    if (!result) return res.status(422).send({"error":"Unknown error creating message"});

    const messages = await MessageModel.findAll({ where: {
      [Op.and]: [
        { chatroomId: null },
        { [Op.and]: [{ userId: userId }, { friendId: userId }] }
      ]
    }, order: [['updatedAt', 'DESC']] });
    if (messages) {
      res.status(200).send(messages);
    } else {
      return res.status(422).send({"error":"Unknown error creating message"});
    }
  }

}