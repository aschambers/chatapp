const CategoryModel = require('../models/Category');

module.exports = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} category list
   */
  categoryCreate: async(req, res) => {
    const { name, serverId, order, visible } = req.body;
    if (!name && !serverId && !order && !visible) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await CategoryModel.create(req.body);
    if (!result) return res.status(422).send({"error":"Unknown error creating category"});
    const categories = await CategoryModel.findAll({ where: { serverId: serverId } });
    if(categories) {
      return res.status(200).send(categories);
    } else {
      return res.status(422).send({"error":"Unknown error creating category"});
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} category list
   */
  categoryFindAll: async(req, res) => {
    const { serverId } = req.body;
    if (!serverId) {
      return res.status(400).send({'error': 'Missing required fields'});
    }
    const result = await CategoryModel.findAll({ where: { serverId: serverId } });
    if(result) {
      return res.status(200).send(result);
    } else {
      return res.status(422).send({"error":"Unknown error finding categories"});
    }
  }

}