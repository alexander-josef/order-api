"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const api_1 = require("../src/routes/api");
const order_1 = require("../src/routes/order");
const user_1 = require("../src/routes/user");
class App {
    constructor() {
        this.userRoutes = new user_1.UserRoute();
        this.orderRoutes = new order_1.OrderRoute();
        this.apiRoutes = new api_1.APIRoute();
        this.app = express();
        this.app.use(bodyParser.json());
        this.apiRoutes.routes(this.app);
        this.userRoutes.routes(this.app);
        this.orderRoutes.routes(this.app);
    }
}
exports.default = new App().app;
