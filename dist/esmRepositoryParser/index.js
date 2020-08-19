"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv = require("csvtojson/v2");
const XProcessorModule_1 = require("./XProcessorModule");
let citationKey = "Citation.s..for.each.item.group.of.items";
let citationGroups = [
    "snippe, e., helmich, m., kunkels, y. k., riese, h., smit, a., & wichers, m. (2019). esm item documentation.",
    "matcham, f., di san pietro, c. b., bulgari, v., de girolamo, g., dobson, r., eriksson, h., ... & li, q. (2019). remote assessment of disease and relapse in major depressive disorder (radar-mdd): a multi-centre prospective cohort study protocol. bmc psychiatry, 19(1), 72.",
    "zygar-hoffmann, caroline, and felix d sch�nbrodt. �experience sampling study 1 on motivational dynamics in couples.� osf, 16 july 2019. web." //5 items
];
let citations = {};
csv().fromFile('./DATA_ESM_Item_Repository.csv').then((items) => {
    // console.log(jsonResult);
    let knownCitations = [];
    for (let i = 0; i < items.length; i++) {
        // let source = generateItemSource(items[i]);
        let citation = items[i][citationKey].split('doi')[0].split("retrieved from osf.io")[0].trim();
        // console.log(citation.split('doi'))
        if (!citation)
            continue;
        // debugger;
        if (citations[citation]) {
            // add to current citation items
            citations[citation].items.push(items[i]);
        }
        else {
            // create new citation object
            citations[citation] = { items: [items[i]] };
            // console.log(citation);
        }
    }
    console.log(citations);
    console.log(citations[citationGroups[1]]);
    let source = generateGroupSource(citations[citationGroups[0]]);
    // console.log(source);
    debugger;
});
let generateGroupSource = (group) => {
    let source = "";
    for (let i = 0; i < group.items.length; i++) {
        let item = group.items[i];
        source += `\n${generateItemSource(item)}\n`;
    }
    return source;
};
let generateItemSource = (config) => {
    let source = "";
    // console.log(config);
    if (config.Item.label) {
        console.log("FOUND X1: ", config);
        source += `${config.Item.label}\n`;
    }
    if (config.X[1]) {
        source += `${XProcessorModule_1.xProcessor.X1(config.X[1])}`;
    }
    else if (config['Response.scale....anchoring']) {
        console.log(config);
        let result = `${XProcessorModule_1.xProcessor.responseScale(config['Response.scale....anchoring'])}`;
        if (!result) {
            debugger;
        }
        if (result == "undefined") {
            debugger;
        }
        source += result;
    }
    else {
        console.log(config);
        debugger;
    }
    console.log("NO X1: ", config);
    console.log(source);
    return source;
};
//# sourceMappingURL=index.js.map