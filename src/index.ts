import { allowedNodeEnvironmentFlags } from "process";

let app = require("./server/serverModule").app;

import { citations, citationKeys,  generateCitationSource } from "./esmRepositoryParser/esmRepositoryParser";
import { getBib } from "./client/clientModule";

// doParsing();



// getBib("https://www.doi2bib.org/2/doi2bib?id=10.1037/abn0000229").then((result) => {
//     console.log(result)
//     debugger;
// })


app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./files" })
})

app.get("/citations", (req, res) => {
    // console.log("citations: ", citations);
    res.send(citations);
})

app.get("/citations/:index", (req, res) => {

    res.send(citations[citationKeys[req.params.index]]);
})


app.get('/citations/:index/bib', async(req, res) => {
    let result = await getBib(citations[citationKeys[req.params.index]].doi)
    console.log(result);
    res.send(result);
})

app.get('/citations/:index/html', (req, res) => {
    console.log(citations);
    let source = generateCitationSource(citationKeys[req.params.index])
    console.log(source);

    res.send({ html: source })
})