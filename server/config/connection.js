const Sequelize = require('sequelize');

const sequelize = new Sequelize("chatappdb", "devuser", "rubiks42", {
  dialect: "postgres",
  host: "chatappdb1.crmkekcbvhcf.us-west-1.rds.amazonaws.com",
  // host: "127.0.0.1",
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
    aquire: 60000
  },
  dialectOptions: {
    socketPath: "chatappdb1.crmkekcbvhcf.us-west-1.rds.amazonaws.com",
    // socketPath: "127.0.0.1"
  }
});

module.exports = sequelize;
