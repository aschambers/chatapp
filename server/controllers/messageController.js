const MessageModel = require('../models/Message');

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
  getMessages: async(req, res, next) => {
    const result = await MessageModel.findAll();
    if(result) {
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error fetching all messages'});
    };
  }

}