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
Object.defineProperty(exports, "__esModule", { value: true });
let app = require("./server/serverModule").app;
const esmRepositoryParser_1 = require("./esmRepositoryParser/esmRepositoryParser");
const clientModule_1 = require("./client/clientModule");
// doParsing();
// getBib("https://www.doi2bib.org/2/doi2bib?id=10.1037/abn0000229").then((result) => {
//     console.log(result)
//     debugger;
// })
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./files" });
});
app.get("/citations", (req, res) => {
    // console.log("citations: ", citations);
    res.send(esmRepositoryParser_1.citations);
});
app.get("/citations/:index", (req, res) => {
    res.send(esmRepositoryParser_1.citations[esmRepositoryParser_1.citationKeys[req.params.index]]);
});
app.get('/citations/:index/bib', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield clientModule_1.getBib(esmRepositoryParser_1.citations[esmRepositoryParser_1.citationKeys[req.params.index]].doi);
    console.log(result);
    res.send(result);
}));
app.get('/citations/:index/html', (req, res) => {
    console.log(esmRepositoryParser_1.citations);
    let source = esmRepositoryParser_1.generateCitationSource(esmRepositoryParser_1.citationKeys[req.params.index]);
    console.log(source);
    res.send({ html: source });
});
app.get("/esmItemCSV", (req, res) => {
    res.sendFile("DATA_ESM_Item_Repository.csv", { root: "./" });
});
//# sourceMappingURL=index.js.map