"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const orderController = require("../controllers/order");
const passportConfiguration_1 = require("../utility/passportConfiguration");
class OrderRoute extends passportConfiguration_1.PassportConfiguration {
    routes(app) {
        app.route('/store/inventory').get(passport.authenticate('jwt', { session: false }), orderController.getInventory);
        app.route('/store/orders').get(passport.authenticate('jwt', { session: false }), orderController.getAllOrders);
        app.route('/store/orders').post(passport.authenticate('jwt', { session: false }), orderController.addOrder);
        app.route('/store/orders/:id').get(passport.authenticate('jwt', { session: false }), orderController.getOrder);
        app.route('/store/orders/:id').delete(passport.authenticate('jwt', { session: false }), orderController.removeOrder);
    }
}
exports.OrderRoute = OrderRoute;
