"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.getBib = void 0;
const https = __importStar(require("https"));
const bib2json = require('bib2json');
exports.getBib = (doi) => __awaiter(void 0, void 0, void 0, function* () {
    let id = doi.substr("https://doi.org/".length);
    let url = `https://www.doi2bib.org/2/doi2bib?id=${id}`;
    let result = yield exports.get(url, { headers: { Accept: "application/x-bibtex" } });
    return bib2json(result);
});
exports.get = (url, options) => {
    console.log("making request:", url);
    return new Promise((resolve, reject) => {
        let nRequest = https.get(url, options, (nRes) => {
            let result = '';
            nRes.on('data', (chunk) => {
                result += chunk;
            });
            nRes.on('end', (chunk) => {
                console.log(result);
                resolve(result);
            });
            nRes.on("error", (e) => {
                console.log("error at nRes", e);
            });
        });
        nRequest.on("error", (e) => {
            console.log("error at nRequest for " + url, e);
        });
    });
};
//# sourceMappingURL=clientModule.js.map