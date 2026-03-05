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
      model: 'categories',
      key: 'id'
    }
  },
  serverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'servers',
      key: 'id'
    }
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Chatroom.hasMany(Message, { onDelete: 'cascade' });
Message.belongsTo(Chatroom);

module.exports = Chatroom;