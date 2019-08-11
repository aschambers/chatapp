const ChatroomModel = require('../models/Chatroom');

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} chatroom object
   */
  chatroomCreate: async(req, res) => {
    const { name, server, createdBy } = req.body;
    if (!name && !server && !createdBy) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await ChatroomModel.create(req.body);
    if(result) {
      return res.status(200).send(result);
    } else {
      return res.status(422).send({"error":"Unknown error creating chatroom"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} chatroom object
   */
  chatroomDelete: async(req, res, next) => {
    const deleteChatroom = await ChatroomModel.destroy({where: { id: req.body.chatroomId }});
    if(deleteChatroom) {
      res.status(200).send({'success':'success deleting chatroom'});
    } else {
      res.status(422).send({'error':'error deleting chatroom'});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of chatrooms
   */
  getChatrooms: async(req, res, next) => {
    const result = await ChatroomModel.findAll({ where: { server: server } });
    if(result) {
      res.status(200).send(result);
    } else {
      res.status(422).send({'error':'error fetching all chatrooms'});
    };
  }

}