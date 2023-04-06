const express = require('express');
const router = express.Router();

const expenseController = require('../controller/expense-controller');
const userAuthenticate = require('../middleware/auth');

router.get("/expense", userAuthenticate.authenticate, expenseController.getExpense);
router.post("/expense", userAuthenticate.authenticate, expenseController.addExpense);
router.get("/expense/:id", userAuthenticate.authenticate, expenseController.editExpense);
router.put("/expense/:id", userAuthenticate.authenticate, expenseController.updateExpense);
router.delete("/expense/:id", userAuthenticate.authenticate, expenseController.deleteExpense);
router.get("/download", userAuthenticate.authenticate, expenseController.downloadExpenses);


module.exports = router;