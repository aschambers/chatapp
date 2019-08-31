const Sequelize = require('sequelize');
const sequelize = require('../config/connection');
const Category = require('./Category');
const Chatroom = require('./Chatroom');
const Invite = require('./Invite');

const Server = sequelize.define('servers', {
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
  public: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  region: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true
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
  userList: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    defaultValue: [],
    allowNull: true
  }
});

Server.hasMany(Category);
Server.hasMany(Chatroom);
Server.hasMany(Invite);
Category.belongsTo(Server);
Chatroom.belongsTo(Server);
Invite.belongsTo(Server);

module.exports = Server;