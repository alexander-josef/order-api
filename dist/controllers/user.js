"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const halson = require("halson");
const jwt = require("jsonwebtoken");
const user_1 = require("../schemas/user");
const logger_1 = require("../utility/logger");
const orderApiUtility_1 = require("../utility/orderApiUtility");
// not needed after DB
// let users: Array<User> = []
exports.getUser = (req, res, next) => {
    const username = req.params.username;
    logger_1.OrderAPILogger.logger.info(`[Get][/users] ${username}`);
    user_1.UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            logger_1.OrderAPILogger.logger.info(`[GET] [/users/:{username}] user with username ${username} not found.`);
            return res.status(404).send();
        }
        user = user.toJSON();
        user._id = user._id.toString(); // why?
        // before DB
        // let user = users.find(obj => obj.username === username)
        // const httpStatusCode = user ? 200 : 404
        // halson : create resource links automatically
        user = halson(user).addLink('self', `/users/${user._id}`); // user id from DB ?
        return orderApiUtility_1.formatOutput(res, user, 200, 'user');
    });
};
exports.addUser = (req, res, next) => {
    const newUser = new user_1.UserModel(req.body);
    logger_1.OrderAPILogger.logger.info(`[POST][/users] ${newUser}`);
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    newUser.save((error, user) => {
        if (error) {
            return res.status(500).send(error); // in case someone signs up with a already existing email address
        }
        user = halson(user.toJSON()).addLink('self', `/users/${user._id}`);
        return orderApiUtility_1.formatOutput(res, user, 201, 'user');
    });
};
exports.updateUser = (req, res, next) => {
    const username = req.params.username;
    logger_1.OrderAPILogger.logger.info(`[PATCH][/users] ${username}`);
    user_1.UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            logger_1.OrderAPILogger.logger.info(`[PATCH] [/users/:{username}] user with ${username} not found.`);
            return res.status(404).send();
        }
        // todo: beautify with prettier? spaces
        user.username = req.body.username || user.username;
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.phone = req.body.phone || user.phone;
        user.userStatus = req.body.userStatus || user.userStatus;
        user.save(error => {
            res.status(204).send();
        });
    });
};
exports.removeUser = (req, res, next) => {
    const username = req.params.username;
    logger_1.OrderAPILogger.logger.warn(`[DELETE][/users] ${username}`);
    user_1.UserModel.findOne({ username: username }, (error, user) => {
        if (!user) {
            logger_1.OrderAPILogger.logger.info(`[DELETE] [/users/:{username}] user with username ${username} not found.`);
            return res.status(404).send();
        }
        user.remove(err => {
            return res.status(204).send();
        });
    });
};
exports.login = (req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;
    user_1.UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            // tslint:disable-next-line: no-console
            console.log('not found');
            logger_1.OrderAPILogger.logger.info(`[GET][/users/login] no user found with username ${username}`);
            return res.status(404).send();
        }
        const validate = bcrypt.compareSync(password, user.password.valueOf());
        if (validate) {
            const body = { _id: user._id, email: user.email };
            const token = jwt.sign({ user: body }, 'top_secret');
            return res.json({ token: token });
        }
        else {
            logger_1.OrderAPILogger.logger.info(`[GET][/users/login] user not authorized ${username}`);
            return res.status(401).send();
        }
    });
};
