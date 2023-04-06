const RazorPay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const dotenv = require('dotenv').config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

exports.purchasePremium = async (req, res, next) => {
    try {
        const rzp = new RazorPay({
            key_id: keyId,
            key_secret: keySecret,
        })
        const amount = 50000;

        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
            return res.status(201).json({ order, key_id: rzp.key_id });
        })
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Something went Wrong', error: error.message });
    }
}

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        const promise2 = req.user.update({ ispremiumuser: true });

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ success: true, message: 'Transaction Successful' });
        }).catch((err) => {
            throw new Error(err);
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.paymentFailed = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        await order.update({
          paymentid: payment_id,
          status: "FAIL",
        });
        res.status(200).json({ success: false, message: 'Transcation Failed' });
    } catch (error) {
        res.status(400).json({ error: 'Error while calling paymentFailed Api' });
    }
}