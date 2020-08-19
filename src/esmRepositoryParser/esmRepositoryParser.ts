

const csv = require("csvtojson/v2");

import { xProcessor } from "./XProcessorModule";

let citationKey = "Citation.s..for.each.item.group.of.items";




let citationGroups = [
    "snippe, e., helmich, m., kunkels, y. k., riese, h., smit, a., & wichers, m. (2019). esm item documentation.", //33 items
    "matcham, f., di san pietro, c. b., bulgari, v., de girolamo, g., dobson, r., eriksson, h., ... & li, q. (2019). remote assessment of disease and relapse in major depressive disorder (radar-mdd): a multi-centre prospective cohort study protocol. bmc psychiatry, 19(1), 72.",
    "zygar-hoffmann, caroline, and felix d sch�nbrodt. �experience sampling study 1 on motivational dynamics in couples.� osf, 16 july 2019. web." //5 items
]







export var citations: any = {};
export var citationKeys:any = [];
export var dois: any = {};

// export const doParsing = () => {

    // return new Promise((resolve, reject)=> {
    csv().fromFile('./DATA_ESM_Item_Repository.csv').then((items: Array<any>) => {

        // console.log(jsonResult);

        let knownCitations: any = [];

        for (let i = 0; i < items.length; i++) {




            // let source = generateItemSource(items[i]);
            let citation = items[i][citationKey].split('doi')[0].split("retrieved from osf.io")[0].trim();
            let doi = items[i][citationKey].split('doi')[1];
            // console.log(citation.split('doi'))

            if (!citation) continue;


            // debugger;
            if (citations[citation]) {
                // add to current citation items
                citations[citation].items.push(items[i])
            } else {
                // create new citation object
                
                let l = Object.keys(citations).length;
                if(l==5) debugger;
                let finalDoi;
                if(doi){
                    finalDoi = `https://doi${cleanupDoi(doi)}`
                } else{
                    finalDoi = undefined;
                }
                citations[citation] = { items: [items[i]], doi: finalDoi};
                // console.log(citation);
                // console.log(doi);
            }
        }

        console.log(citations);
        // console.log(citations[citationGroups[1]]);

        // let source = generateGroupSource(citations[citationGroups[0]])

        citationKeys = Object.keys(citations);
        // console.log(source);

        // resolve();

    // });
})
// }

let cleanupDoi = (doi)=>{
    let result =  doi.replace(/\uFFA0/g, '').trim();
  
    if(result[0]==':'){ 
        result = result.replace(/:/g, '').trim();
        result = '.org/' + result;
    }
    

    console.log(doi.length, result.length);
    return result;
}


export let generateCitationSource = (citationKey) =>{
    return generateGroupSource(citations[citationKey]);
}

let generateGroupSource = (group) => {
    let source = "";
    for (let i = 0; i < group.items.length; i++) {
        let item = group.items[i];
        source += `\n${generateItemSource(item)}\n`;
    }

    return source;

}

let generateItemSource = (config) => {
    let source = "";
    // console.log(config);

    if (config.Item.label) {
        console.log("FOUND X1: ", config);
        source += `${config.Item.label}\n`;
    }
    if (config.X[1]) {
        source += `${xProcessor.X1(config.X[1])}`;
    } else if (config['Response.scale....anchoring']) {
        console.log(config);
        let result = `${xProcessor.responseScale(config['Response.scale....anchoring'])}`
        if (!result) {
            debugger;
        }
        if (result == "undefined") {
            debugger;
        }
        source += result;

    } else {
        console.log(config);

        debugger;
    }


    console.log("NO X1: ", config);


    console.log(source);

    return source;
}