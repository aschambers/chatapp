const Sequelize = require('sequelize');
const sequelize = require('../config/connection');
const Chatroom = require('./Chatroom');

const Category = sequelize.define('categories', {
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
  serverId: {
    type: Sequelize.INTEGER,
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
  order: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  visible: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Category.hasMany(Chatroom, { onDelete: 'cascade' });
Chatroom.belongsTo(Category);

module.exports = Category;