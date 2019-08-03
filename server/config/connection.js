const Sequelize = require('sequelize');

const sequelize = new Sequelize("REMOVED", "REMOVED", "REMOVED", {
  dialect: "postgres",
  host: "127.0.0.1",
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
    aquire: 60000
  },
  dialectOptions: {
    socketPath: "127.0.0.1",
  }
});

module.exports = sequelize;
