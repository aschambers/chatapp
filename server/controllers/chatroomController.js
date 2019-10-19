const ChatroomModel = require('../models/Chatroom');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} chatroom object
   */
  chatroomCreate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { name, serverId } = req.body;

    if (!name && !serverId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    const existingChatroom = await ChatroomModel.findOne({ where: { [Op.and]: [{ serverId: serverId }, { name: name }] } });
    if (existingChatroom) return res.status(422).send({'error':'Chatroom exists'});

    const result = await ChatroomModel.create(req.body);
    if (!result) return res.status(422).send({'error':'Unknown error creating chatroom'});

    const allChatrooms = await ChatroomModel.findAll({ where: { serverId: serverId } });
    res.status(200).send(allChatrooms);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of chatrooms
   */
  getChatrooms: async(req, res, next) => {
    const { serverId } = req.query;

    const result = await ChatroomModel.findAll({ where: { serverId: serverId } });
    res.status(200).send(result);
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} chatroom object
   */
  chatroomDelete: async(req, res, next) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const deleteChatroom = await ChatroomModel.destroy({where: { id: req.body.chatroomId }});

    if (!deleteChatroom) return res.status(422).send({'error':'error deleting chatroom'});

    res.status(200).send({'success':'success deleting chatroom'});
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} chatroom list
   */
  chatroomUpdate: async(req, res) => {
    if (!req.authorizedRequest) return res.status(401).json({ message: 'Auth failed' });

    const { chatroomId, categoryId } = req.body;

    if (!chatroomId) {
      return res.status(400).send({'error':'Missing required fields'});
    }

    const updateChatroom = await ChatroomModel.findOne({ where: { id: chatroomId }});
    if (!updateChatroom) return res.status(422).send({'error':'Chatroom not found'});

    const chatroomUpdate = await updateChatroom.update(
      { categoryId: categoryId },
      { where:  { id: chatroomId }}
    );

    if (!chatroomUpdate) return res.status(422).send({'error':'Unknown error updating chatroom'});

    res.status(200).send(chatroomUpdate);
  }

}