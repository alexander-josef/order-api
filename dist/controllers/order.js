"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const halson = require("halson");
const _ = require("lodash");
const order_1 = require("../schemas/order");
const user_1 = require("../schemas/user");
const logger_1 = require("../utility/logger");
const orderApiUtility_1 = require("../utility/orderApiUtility");
exports.getOrder = (req, res, next) => {
    const id = req.params.id;
    logger_1.OrderAPILogger.logger.info(`[GET][/store/orders/]${id}`);
    order_1.OrderModel.findById(id, (err, order) => {
        if (!order) {
            logger_1.OrderAPILogger.logger.info(`[GET][/store/orders/:{orderId}] Order ${id} not found.`);
            return next(new Error(`Order ${id} not found.`));
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
    logger_1.OrderAPILogger.logger.info(`[POST][/store/orders/] ${userId}`);
    user_1.UserModel.findById(userId, (err, user) => {
        if (!user) {
            logger_1.OrderAPILogger.logger.info(`[POST][/store/orders/ There is no user with userId ${userId}.`);
            throw new Error(`There is no user with userId ${userId}.`);
        }
        const newOrder = new order_1.OrderModel(req.body);
        logger_1.OrderAPILogger.logger.info(`[POST][/store/orders/] ${newOrder}`);
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
    logger_1.OrderAPILogger.logger.info(`[DELETE][/store/orders/] ${id}`);
    order_1.OrderModel.findById(id, (err, order) => {
        if (!order) {
            logger_1.OrderAPILogger.logger.warn(`[DELETE][/store/orders/:{orderId}] OrderID with Id ${id} not found `);
            return res.status(404).send();
        }
        order.remove(error => {
            res.status(204).send();
        });
    });
};
exports.getInventory = (req, res, next) => {
    const status = req.query.status;
    logger_1.OrderAPILogger.logger.info(`[GET][/store/inventory/] ${status}`);
    order_1.OrderModel.find({ status: status }, (err, orders) => {
        const groupedOrders = _.groupBy(orders, 'userId');
        return orderApiUtility_1.formatOutput(res, groupedOrders, 200, 'inventory');
    });
};
