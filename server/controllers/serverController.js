const ServerModel = require('../models/Server');

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} server object
   */
  serverCreate: async(req, res) => {
    const { name, createdBy } = req.body;
    if (!name && !createdBy) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await ServerModel.create(req.body);
    if(result) {
      return res.status(200).send(result);
    } else {
      return res.status(422).send({"error":"Unknown error creating server"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} server object
   */
  serverDelete: async(req, res, next) => {
    const deleteServer = await ServerModel.destroy({where: { id: req.body.serverId }});
    if(deleteServer) {
      res.status(200).send({'success':'success deleting server'});
    } else {
      res.status(422).send({'error':'error deleting server'});
    }
  }

}