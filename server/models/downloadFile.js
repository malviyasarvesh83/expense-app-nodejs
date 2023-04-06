const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const DownloadFile = sequelize.define('downloadfile', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    url: Sequelize.STRING,
})

module.exports = DownloadFile;