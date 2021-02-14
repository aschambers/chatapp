const Sequelize = require('sequelize');
const keys = require('../config/keys');

const sequelize = new Sequelize(keys.database_name, keys.database_username, keys.database_password, {
  dialect: "postgres",
  host: keys.connection,
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
    aquire: 60000
  },
  dialectOptions: {
    socketPath: keys.connection,
    ssl: keys.ssl,
    sslfactory: keys.sslfactory
  }
});

module.exports = sequelize;
