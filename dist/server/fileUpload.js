"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var multer = require("multer");
const { exec } = require("child_process");
const execSync = require('child_process').execSync;
const uploadFolder = "./uploads";
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("destination");
        callback(null, uploadFolder);
    },
    filename: function (req, file, callback) {
        console.log(file);
        //console.log("filename", file.fieldname)
        console.log("filename", file.originalname);
        callback(null, file.originalname);
    },
});
var upload = multer({
    storage: storage,
    onError: function (error, next) {
        console.log("------------ error");
        console.log(error);
    }
}).any();
module.exports = (app) => {
    app.post("/imageUpload", function (req, res, next) {
        console.log("/imageUpload");
        upload(req, res, function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Transfer-Encoding', 'chunked');
                if (err) {
                    console.log("error", err);
                    return res.end("error uploading file");
                }
                res.end();
            });
        });
    });
};
//# sourceMappingURL=fileUpload.js.map