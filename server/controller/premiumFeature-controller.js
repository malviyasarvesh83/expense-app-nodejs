const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');

exports.getUserLeaderBoard = async (req, res, next) => {
    try {
        const leaderboardofusers = await User.findAll({
            order: [['totalExpenses', 'DESC']],
        });
        
        res.status(200).json(leaderboardofusers);
    } catch (error) {
        res.status(500).json(error);
    }
}