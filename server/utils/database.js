const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(`${dbName}`, `${username}`, `${password}`, {
  dialect: "mysql",
  host: `${host}`,
});

module.exports = sequelize;