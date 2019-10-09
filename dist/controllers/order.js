"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const halson = require("halson");
const _ = require("lodash");
const order_1 = require("../schemas/order");
const User_1 = require("../schemas/User");
const orderApiUtility_1 = require("../utility/orderApiUtility");
exports.getOrder = (req, res, next) => {
    const id = req.params.id;
    order_1.OrderModel.findById(id, (err, order) => {
        if (!order) {
            return res.status(404).send();
        }
        order = halson(order.toJSON()).addLink('self', `/store/orders/${order.id}`);
        return orderApiUtility_1.formatOutput(res, order, 200, 'order');
    });
};
exports.getAllOrders = (req, res, next) => {
    const limit = Number(req.query.limit) || 0;
    const offset = Number(req.query.offset) || 0;
    order_1.OrderModel.find({}, null, { skip: offset, limit: limit }).then(orders => {
        if (orders) {
            orders = orders.map(order => {
                return halson(order.toJSON())
                    .addLink('self', `/store/orders/${order.id}`)
                    .addLink('user', {
                    href: `/users/${order.userId}`,
                });
            });
        }
        return orderApiUtility_1.formatOutput(res, orders, 200, 'order');
    });
};
exports.addOrder = (req, res, next) => {
    const userId = req.body.userId;
    User_1.UserModel.findById(userId, (err, user) => {
        if (!user) {
            return res.status(404).send();
        }
        const newOrder = new order_1.OrderModel(req.body);
        newOrder.save((error, order) => {
            order = halson(order.toJSON())
                .addLink('self', `/store/orders/${order._id}`)
                .addLink('user', {
                href: `/users/${order.userId}`,
            });
            return orderApiUtility_1.formatOutput(res, order, 201, 'order');
        });
    });
};
exports.removeOrder = (req, res, next) => {
    const id = req.params.id;
    order_1.OrderModel.findById(id, (err, order) => {
        if (!order) {
            return res.status(404).send();
        }
        order.remove(error => {
            res.status(204).send();
        });
    });
};
exports.getInventory = (req, res, next) => {
    const status = req.query.status;
    order_1.OrderModel.find({ status: status }, (err, orders) => {
        // orders = _.groupBy(orders, 'userId')
        return orderApiUtility_1.formatOutput(res, _.groupBy(orders, 'userId'), 200, 'inventory');
    });
};
