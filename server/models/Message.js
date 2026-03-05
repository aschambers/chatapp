const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const Message = sequelize.define('messages', {
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
    allowNull: true
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
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  chatroomId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'chatrooms',
      key: 'id'
    }
  },
  friendId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'friends',
      key: 'id'
    }
  }
});

module.exports = Message;