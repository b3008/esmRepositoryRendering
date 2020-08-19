"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require('querystring');
const fs = require("fs");
var cors = require('cors');
const { exec } = require("child_process");
const execSync = require('child_process').execSync;
// const options = {
//     key: fs.readFileSync("./.sshkeys/privkey.pem"),
//     cert: fs.readFileSync("./.sshkeys/fullchain.pem")
// };
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
const port = 8200;
const portHttps = 8300;
// do this for http
app.listen(port, () => { console.log(`http listening at ${port}`); });
// app.use(cors);
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
// set up a proxy for ionic serve, while developing the ionic app
const proxy = require('express-http-proxy');
app.use('/app', proxy('http://localhost:8100/', {
    proxyReqPathResolver: (req) => {
        console.log("url is", req.url);
        return req.url;
    }
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, NibeToken");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    next();
});
//  const fileUpload = require('./fileUpload')(app);
app.get("/test", (req, res) => {
    console.log("test");
    res.send("test!");
});
app.get("files/.*", (req, res) => {
    debugger;
    console.log("at get /drawing", req.params, req.body);
    console.log(req);
    let drawing = req.query.drawing;
    // res.sendFile(drawing, { root: "./" });
    res.send();
});
module.exports = { app, fileUpload };
//# sourceMappingURL=serverModule.js.map