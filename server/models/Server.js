const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const Servers = sequelize.define('servers', {
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
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Servers;