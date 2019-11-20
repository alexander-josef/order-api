"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const expressWinston = require("express-winston");
const mongoose = require("mongoose");
const winston = require("winston");
const api_1 = require("./routes/api");
const order_1 = require("./routes/order");
const user_1 = require("./routes/user");
const errorHandler = require("./utility/errorHandler");
const logger_1 = require("./utility/logger");
class App {
    // public mongoUrl: string = 'mongodb://localhost/order-api' -> use env variables instead
    constructor() {
        this.userRoutes = new user_1.UserRoute();
        this.apiRoutes = new api_1.APIRoute();
        this.orderRoutes = new order_1.OrderRoute();
        const path = `${__dirname}/../.env.${process.env.NODE_ENV}`;
        dotenv.config({ path: path }); // -> this creates env variables according to the . file of the active environment the process is running in?
        /*     this.mongoUrl = `mongodb://${process.env.MONGODB_URL_PORT}/${
              process.env.MONGODB_DATABASE
            }`
        */
        this.mongoUrl = `${process.env.MONGODB_URL_PORT}/${process.env.MONGODB_DATABASE}`;
        this.mongoUser = `${process.env.MONGODB_USER}`;
        this.mongoPass = `${process.env.MONGODB_PASS}`;
        logger_1.OrderAPILogger.logger.info(`using URL: ${this.mongoUrl} - user: ${this.mongoUser} - pass: ${this.mongoPass}`);
        this.app = express();
        this.app.use(bodyParser.json());
        this.userRoutes.routes(this.app);
        this.apiRoutes.routes(this.app);
        this.orderRoutes.routes(this.app);
        this.mongoSetup();
        this.app.use(expressWinston.errorLogger({
            transports: [new winston.transports.Console()],
        }));
        this.app.use(errorHandler.logging);
        this.app.use(errorHandler.clientErrorHandler);
        this.app.use(errorHandler.errorHandler);
    }
    mongoSetup() {
        let options;
        if (process.env.NODE_ENV !== 'prod') {
            options = {
                useNewUrlParser: true,
            };
        }
        else {
            options = {
                user: this.mongoUser,
                pass: this.mongoPass,
                useNewUrlParser: true,
            };
        }
        mongoose.connect(this.mongoUrl, options);
    }
}
exports.default = new App().app;
