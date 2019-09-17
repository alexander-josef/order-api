"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const index_1 = require("../src/routes/index");
class App {
    constructor() {
        this.indexRoutes = new index_1.Index();
        this.app = express();
        this.app.use(bodyParser.json());
        this.indexRoutes.routes(this.app);
    }
}
exports.default = new App().app;
