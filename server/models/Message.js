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
      type: Sequelize.INTEGER,
      references: 'users',
      referencesKey: 'id'
    }
  },
  chatroomId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      type: Sequelize.INTEGER,
      references: 'chatrooms',
      referencesKey: 'id'
    }
  }
});

module.exports = Message;