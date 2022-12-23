const { Sequelize } = require('sequelize');
require('dotenv').config({path: __dirname + '/../env'})

const db = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mariadb'
  }
);


module.exports = { db }
