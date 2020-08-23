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
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.sendFile("index.html", { root: "./files" })
})

app.get("/citations", (req, res) => {
    // console.log("citations: ", citations);
    res.send(citations);
})

app.get("/citationKeys", (req, res) => {
    // console.log("citations: ", citations);
    let result:any = [];
    for(let i=0; i<citationKeys.length; i++){
        result.push({
            key: citationKeys[i],
            errorCount : citations[citationKeys[i]].errorCount,
            itemCount: citations[citationKeys[i]].items.length,
            doi : citations[citationKeys[i]].doi || ""
        })
    }
    res.send(result);
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

app.get("/esmItemCSV", (req, res)=>{
    res.sendFile("DATA_ESM_Item_Repository.csv", {root:"./"});
});