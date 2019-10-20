const MessageModel = require('../models/Message');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} message list
   */
  messageChatroomCreate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { username, message, userId, chatroomId } = req.body;

    if (!username && !message && !userId && !chatroomId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    const result = await MessageModel.create(req.body);
    if (!result) return res.status(422).send({'error':'Unknown error creating message'});

    const messages = await MessageModel.findAll({ where: { chatroomId: chatroomId }, order: [['createdAt', 'DESC']] });
    if (!messages) return res.status(422).send({'error':'Unknown error creating message'});

    res.status(200).send(messages);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  messageChatroomDelete: async(req, res, next) => {
    const { chatroomId, messageId } = req.body;

    const deleteMessage = await MessageModel.destroy({where: { id: messageId }});
    if (!deleteMessage) return res.status(422).send({'error':'Error deleting message'});

    const result = await MessageModel.findAll({ where: { chatroomId: chatroomId }, order: [['createdAt', 'DESC']] });

    if (!result) return res.status(422).send({'error':'Error finding messages'});

    res.status(200).send(result);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  messageChatroomEdit: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { chatroomId, messageId, message } = req.body;

    const findMessage = await MessageModel.findByPk(messageId);
    if (!findMessage) return res.status(422).send({'error':'Error finding message'});

    const editMessage = await findMessage.update(
      { message: message },
      { where: { id: messageId }}
    );
    if (!editMessage) return res.status(422).send({'error':'Error editing message'});

    const result = await MessageModel.findAll({ where: { chatroomId: chatroomId }, order: [['createdAt', 'DESC']] });
    if (!result) return res.status(422).send({'error':'Error retrieving messages'});

    res.status(200).send(result);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  getChatroomMessages: async(req, res, next) => {
    const { chatroomId } = req.query;

    const result = await MessageModel.findAll({ where: { chatroomId: chatroomId }, order: [['createdAt', 'DESC']] });
    if (!result) return res.status(422).send({'error':'Error fetching all messages'});

    res.status(200).send(result);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  getPrivateMessages: async(req, res, next) => {
    const { userId, friendId } = req.query;

    const result = await MessageModel.findAll({ where: {
      [Op.or]: [
        { [Op.and]: [{ userId: userId }, { friendId: friendId }, { chatroomId: null }] },
        { [Op.and]: [{ userId: friendId }, { friendId: userId }, { chatroomId: null }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!result) return res.status(422).send({'error':'Error fetching all messages'});

    res.status(200).send(result);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  getPersonalMessages: async(req, res, next) => {
    const { userId } = req.query;

    const result = await MessageModel.findAll({ where: {
      [Op.and]: [
        { chatroomId: null },
        { [Op.and]: [{ userId: userId }, { friendId: userId }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!result) return res.status(422).send({'error':'Error fetching all messages'});

    res.status(200).send(result);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} message list
   */
  messagePrivateCreate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { username, message, userId, friendId } = req.body;
    if (!username && !message && !userId && !friendId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    const result = await MessageModel.create(req.body);
    if (!result) return res.status(422).send({'error':'Unknown error creating message'});

    const messages = await MessageModel.findAll({ where: {
      [Op.or]: [
        { [Op.and]: [{ userId: userId }, { friendId: friendId }, { chatroomId: null }] },
        { [Op.and]: [{ userId: friendId }, { friendId: userId }, { chatroomId: null }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!messages) return res.status(422).send({'error':'Unknown error creating message'});

    res.status(200).send(messages);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  messagePrivateDelete: async(req, res, next) => {
    const { userId, friendId, messageId } = req.body;

    const deleteMessage = await MessageModel.destroy({ where: { id: messageId }});
    if (!deleteMessage) return res.status(422).send({'error':'Unknown error deleting message'});

    const messages = await MessageModel.findAll({ where: {
      [Op.or]: [
        { [Op.and]: [{ userId: userId }, { friendId: friendId }, { chatroomId: null }] },
        { [Op.and]: [{ userId: friendId }, { friendId: userId }, { chatroomId: null }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!messages) return res.status(422).send({'error':'Unknown error creating message'});

    res.status(200).send(messages);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  messagePrivateEdit: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { userId, friendId, messageId, message } = req.body;

    const findMessage = await MessageModel.findByPk(messageId);
    if (!findMessage) return res.status(422).send({'error':'Unknown error editing message'});

    const editMessage = await findMessage.update(
      { message: message },
      { where: { id: messageId }}
    );
    if (!editMessage) return res.status(422).send({'error':'Error editing message'});

    const messages = await MessageModel.findAll({ where: {
      [Op.or]: [
        { [Op.and]: [{ userId: userId }, { friendId: friendId }, { chatroomId: null }] },
        { [Op.and]: [{ userId: friendId }, { friendId: userId }, { chatroomId: null }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!messages) return res.status(422).send({'error':'Unknown error creating message'});

    res.status(200).send(messages);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} message list
   */
  messagePersonalCreate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { username, message, userId, friendId } = req.body;
    if (!username && !message && !userId && !friendId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    const result = await MessageModel.create(req.body);
    if (!result) return res.status(422).send({'error':'Unknown error creating message'});

    const messages = await MessageModel.findAll({ where: {
      [Op.and]: [
        { chatroomId: null },
        { [Op.and]: [{ userId: userId }, { friendId: userId }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!messages) return res.status(422).send({'error':'Unknown error creating message'});

    res.status(200).send(messages);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  messagePersonalDelete: async(req, res, next) => {
    const { userId, messageId } = req.body;

    const deleteMessage = await MessageModel.destroy({where: { id: messageId }});
    if (!deleteMessage) return res.status(422).send({'error':'Unknown error deleting message'});

    const messages = await MessageModel.findAll({ where: {
      [Op.and]: [
        { chatroomId: null },
        { [Op.and]: [{ userId: userId }, { friendId: userId }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!messages) return res.status(422).send({'error':'Error deleting message'});

    res.status(200).send(messages);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of messages
   */
  messagePersonalEdit: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { userId, messageId, message } = req.body;

    const findMessage = await MessageModel.findByPk(messageId);
    if (!findMessage) return res.status(422).send({'error':'Unknown error editing message'});

    const editMessage = await findMessage.update(
      { message: message },
      { where: { id: messageId }}
    );
    if (!editMessage) return res.status(422).send({'error':'Error editing message'});

    const messages = await MessageModel.findAll({ where: {
      [Op.and]: [
        { chatroomId: null },
        { [Op.and]: [{ userId: userId }, { friendId: userId }] }
      ]
    }, order: [['createdAt', 'DESC']] });
    if (!messages) return res.status(422).send({'error':'Error editing message'});

    res.status(200).send(messages);
  }

}