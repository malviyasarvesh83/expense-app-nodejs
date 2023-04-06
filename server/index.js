const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const sequelize = require("./utils/database");
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumFeatureRoutes = require('./routes/premiumFeatureRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotPassword');
const DownloadFile = require('./models/downloadFile');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan('combined', { stream: accessLogStream }));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is successfully running on PORT : http://localhost:${port}`);
})

// Relation between users and Expenses
User.hasMany(Expense);
Expense.belongsTo(User);

// Relation between users and Orders
User.hasMany(Order);
Order.belongsTo(User);

// Relation between Users and ForgotPassword
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

// Relation between Users and DownloadFiles
User.hasMany(DownloadFile);
DownloadFile.belongsTo(User);

// DataBase Connection
const database = async () => {
  try {
    await sequelize.sync();
    console.log("Database connected Successfully..!");
  } catch (error) {
    console.log("Error while Connecting Database : ", error);
  }
};
database();

// Routes

app.use('/user', userRoutes);

app.use('/', expenseRoutes);

app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);

app.use('/password', forgotPasswordRoutes);