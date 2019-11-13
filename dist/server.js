"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// no HTTPS configuration when run in google cloud env
// import * as fs from 'fs'
// import * as https from 'https'
const app_1 = require("./app");
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT);
/* const httpsOptions = {
    key: fs.readFileSync('./config/key.pem'),
    cert: fs.readFileSync('./config/cert.pem'),
}

https.createServer(httpsOptions,app).listen(PORT)

 */ 
