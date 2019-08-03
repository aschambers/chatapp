const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const Messages = sequelize.define('messages', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false
  },
  sentTo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  server: {
    type: Sequelize.STRING,
    allowNull: true
  },
  chatroom: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = Messages;