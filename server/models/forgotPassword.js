const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ForgotPassword = sequelize.define('forgotpasswordrequest', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE,
})

module.exports = ForgotPassword;