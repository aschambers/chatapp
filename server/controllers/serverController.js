const ServerModel = require('../models/Server');
const UserModel = require('../models/User');
const keys = require('../config/keys');
const cloudinary = require('cloudinary');

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
    try {
      const { name, userId, public, region } = req.body;
      if (!name || !userId || !public || !region) {
        return res.status(400).send({'error': 'Missing required fields'});
      }

      // Step 1: Check to see if server already exists with this name
      const existingServer = await ServerModel.findOne({ where: { name: name }});
      if (existingServer) return res.status(400).send({'error': 'Server exists'});

      // Step 2: Upload image to cloudinary and set imageUrl to uploaded image.
      if (req.files && req.files.imageUrl[0] && req.files.imageUrl[0].mimetype === 'image/jpeg' || req.files.imageUrl[0].mimetype === 'image/png' || req.files.imageUrl[0].mimetype === 'image/gif') {
        const encoded = req.files.imageUrl[0].data.toString('base64');
        const result = await cloudinary.uploader.upload("data:image/png;base64," + encoded);
        if (!result) return res.status(422).send({'error': 'Failed to upload image URL'});
        req.body.imageUrl = result.url.replace(/^http:\/\//i, 'https://');
      }

      // Step 3: Create the server with required fields.
      const newServer = await ServerModel.create(req.body);
      if (!newServer) return res.status(422).send({'error': 'Failed to create the server'});

      // Step 4: Find user who is creating the server by userId and use to add the new server to his list of servers he has created or joined.
      const updateUser = await UserModel.findOne({ where: { id: userId }});
      if (!updateUser) return res.status(422).send({'error': 'Failed to find user who created the server'});

      // Step 5: Add this new server to list of servers for this user
      if (!updateUser.serversList) updateUser.serversList = [];
      updateUser.serversList.push({
        name: name,
        imageUrl: req.body.imageUrl
      });

      // Step 6: Update list of servers by userId
      const serversUpdate = await updateUser.update(
        { serversList: updateUser.serversList },
        { where:  { id: userId }}
      );

      if (!serversUpdate) return res.status(422).send({'error': 'Failed to update server list'});
      res.status(200).send(serversUpdate.serversList);
    } catch(err) {
      res.status(422).send('error-creating-server');
    }
  },

  /**
   * @param {object} req
   * @param {object} res
   * @returns {array} list of servers
   */
  serverFind: async(req, res, next) => {
    const user = await UserModel.findByPk(req.body.id);
    if (!user) return res.status(422).send({'error':'error deleting server'});
    res.status(200).send(user.serversList);
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