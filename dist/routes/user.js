"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController = require("../controllers/user");
class UserRoute {
    routes(app) {
        app.route('/users').post(userController.addUser);
        app.route('/users/:username').patch(userController.updateUser);
        app.route('/users/:username').delete(userController.removeUser);
        app.route('/users/:username').get(userController.getUser);
    }
}
exports.UserRoute = UserRoute;
