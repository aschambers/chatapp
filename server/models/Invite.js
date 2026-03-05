const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const Invite = sequelize.define('invites', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expires: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
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
  serverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'servers',
      key: 'id'
    }
  }
});

module.exports = Invite;