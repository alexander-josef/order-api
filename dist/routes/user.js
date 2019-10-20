"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const userController = require("../controllers/user");
const passportConfiguration_1 = require("../utility/passportConfiguration");
class UserRoute extends passportConfiguration_1.PassportConfiguration {
    routes(app) {
        app.route('/users/login').get(userController.login);
        app.route('/users').post(passport.authenticate('jwt', { session: false }), userController.addUser);
        app.route('/users/:username').patch(passport.authenticate('jwt', { session: false }), userController.updateUser);
        app.route('/users/:username').delete(passport.authenticate('jwt', { session: false }), userController.removeUser);
        app.route('/users/:username').get(passport.authenticate('jwt', { session: false }), userController.getUser);
    }
}
exports.UserRoute = UserRoute;
