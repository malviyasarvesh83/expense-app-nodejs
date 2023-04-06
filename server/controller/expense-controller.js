const Expense = require('../models/expense');
const User = require('../models/user');
const DownloadFile = require('../models/downloadFile');
const sequelize = require('../utils/database');
const S3Services = require('../services/s3Services');

exports.getExpense = async (req, res, next) => {
  try {
    const itemsPerPage = +req.query.rows;
    const page = +req.query.page;
    const response = await Expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    });
    const totalItems = await Expense.count({ where: { userId: req.user.id } });
    console.log(`My Total Items=${totalItems}`);
    return res.status(200).json({
      response,
      name: req.user.name,
      currentPage: page,
      hasNextPage: itemsPerPage * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / itemsPerPage),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error while calling getExpense Api' });
  }
}

exports.addExpense = async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const userId = req.user.id;
    const t = await sequelize.transaction();
    const response = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userId: userId,
    }, { transaction: t });
    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    await User.update({ totalExpenses: totalExpense }, { where: { id: req.user.id }, transaction: t });
    await t.commit();
    res.status(201).json(response);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: 'Error while calling addExpense Api' });
  }
}

exports.editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await Expense.findByPk(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: "Error while calling editExpense Api" });
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedAmount = req.body.amount;
    const updatedCategory = req.body.category;
    const updatedDescription = req.body.description;

    const response = await Expense.findByPk(id);
    response.amount = updatedAmount;
    response.category = updatedCategory;
    response.description = updatedDescription;
    response.save({ where: { userId: req.user.id } });
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: "Error while calling updateExpense Api" });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const id = req.params.id;
    const response = await Expense.findByPk(id);
    const amount = response.amount;
    console.log('My Deleted Amount:', amount);
    console.log('My Id=',req.user.id);
    response.destroy({ where: { userId: req.user.id } });
    const totalExpense = Number(req.user.totalExpenses) - Number(amount);
    await User.update({ totalExpenses: totalExpense }, { where: { id: req.user.id }, transaction: t });
    await t.commit();
    res.status(200).json(response);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: "Error while calling deleteExpense Api" });
  }
}

exports.downloadExpenses = async (req, res, next) => {
  try {
    console.log('My Id=', req.user.id);
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    const stringifiedExpenses = JSON.stringify(expenses);

    // Filename should depend upon the usedId and Date
    const userId = req.user.id;
    const filename = `Expenses${userId}/${new Date()}.txt`;
    const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
    await DownloadFile.create({ url: fileURL,userId: userId});
    res.status(200).json({ fileURL:fileURL, success: true });
  } catch (error) {
    res.status(400).json(error);
  }
}