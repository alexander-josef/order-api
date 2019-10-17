"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const https = require("https");
const app_1 = require("./app");
const PORT = process.env.PORT;
// app.listen(PORT)
const httpsOptions = {
    key: fs.readFileSync('./config/key.pem'),
    cert: fs.readFileSync('./config/cert.pem'),
};
https.createServer(httpsOptions, app_1.default).listen(PORT);
