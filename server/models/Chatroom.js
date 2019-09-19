const Sequelize = require('sequelize');
const sequelize = require('../config/connection');
const Message = require('./Message');

const Chatroom = sequelize.define('chatrooms', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
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
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      type: Sequelize.INTEGER,
      references: 'categories',
      referencesKey: 'id'
    }
  },
  serverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      type: Sequelize.INTEGER,
      references: 'categories',
      referencesKey: 'id'
    }
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Chatroom.hasMany(Message);
Message.belongsTo(Chatroom);

module.exports = Chatroom;