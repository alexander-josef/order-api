"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const expressWinston = require("express-winston");
const mongoose = require("mongoose");
const winston = require("winston");
const api_1 = require("../src/routes/api");
const order_1 = require("../src/routes/order");
const user_1 = require("../src/routes/user");
const errorHandler = require("../src/utility/errorHandler");
class App {
    constructor() {
        this.userRoutes = new user_1.UserRoute();
        this.orderRoutes = new order_1.OrderRoute();
        this.apiRoutes = new api_1.APIRoute();
        this.mongoUrl = 'mongodb://localhost/order-api';
        this.app = express();
        this.app.use(bodyParser.json());
        this.apiRoutes.routes(this.app);
        this.userRoutes.routes(this.app);
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
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
}
exports.default = new App().app;
