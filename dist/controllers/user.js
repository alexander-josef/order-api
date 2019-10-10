"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const halson = require("halson");
const user_1 = require("../schemas/user");
const orderApiUtility_1 = require("../utility/orderApiUtility");
// not needed after DB
// let users: Array<User> = []
exports.getUser = (req, res, next) => {
    const username = req.params.username;
    user_1.UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
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
    newUser.save((error, user) => {
        user = halson(user.toJSON().addLink('self', `/users/{user._id}`));
        return orderApiUtility_1.formatOutput(res, user, 201, 'user');
    });
};
exports.updateUser = (req, res, next) => {
    const username = req.params.username;
    user_1.UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            res.status(404).send();
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
    user_1.UserModel.findOne({ username: username }, (error, user) => {
        if (!user) {
            return res.status(404).send();
        }
        user.remove(err => {
            return res.status(204).send();
        });
    });
};
