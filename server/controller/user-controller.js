const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const DownloadFiles = require('../models/downloadFile');

const Secret_Key = process.env.TOKEN_SECRET_KEY;

const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, Secret_Key);
}

exports.signUp = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            let response = await User.create({
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            res.status(201).json({ message: "User Created Successfully" });
        })
    } catch (error) {
        res.status(500).json({ error: 'Email Already Exists' });
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const users = await User.findOne({ where: { email: email } });
        bcrypt.compare(password, users.password, (err, response) => {
            if (response == true) {
                res.status(200).json({ message: "Logged In Successfully..!", token: generateAccessToken(users.id, users.name) });
            } else {
                res.status(400).json({ error: "Invalid Email or Password" });
            }
        })
    } catch (error) {
        res.status(404).json({ error: 'User Not Found' });
    }
}

exports.allUsers = async (req, res, next) => {
    try {
        const response = await User.findOne({ where: { id: req.user.id } });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: 'Error while calling All User Api' });
    }
}

exports.totalExpenses = async (req, res, next) => {
    try {
        const response = await User.findOne({ where: { id: req.user.id } });
        console.log('User Id=',req.user.id);
        console.log('User Total Expense=',response.totalExpenses);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: 'Error while calling Total Expense Api' });
    }
}

exports.downloadFiles = async (req, res, next) => {
    try {
        const response = await DownloadFiles.findAll({ where: { userId: req.user.id } });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}