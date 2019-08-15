const Sequelize = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcryptjs');
const Server = require('./Server');

const User = sequelize.define('user', {
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
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  os: {
    type: Sequelize.STRING,
    allowNull: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true
  },
  resetPasswordToken: {
    type: Sequelize.STRING,
    allowNull: true
  },
  pushNotificationToken: {
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
  privateMessages: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    defaultValue: [],
    allowNull: true
  },
  personalMessages: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    defaultValue: [],
    allowNull: true
  },
  chatroomsList: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    defaultValue: [],
    allowNull: true
  },
  serversList: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    defaultValue: [],
    allowNull: true
  }
},
{
  // use this hook to hash the users password with salt, where the number is the number
  // of salt rounds
  hooks: {
    beforeSave: (user, options) => {
      {
        if(options.fields.includes('password')) {
          user.password = bcrypt.hashSync(user.password, 10);
        }
      }
    }
  }
});

User.hasMany(Server);
Server.belongsTo(User);

module.exports = User;