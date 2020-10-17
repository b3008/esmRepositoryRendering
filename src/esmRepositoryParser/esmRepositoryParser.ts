

const csv = require("csvtojson/v2");

import { xProcessor } from "./XProcessorModule";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

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


        /**
         * iterate over each row and group items per citation
         * the result is an object with citations as keys
         * 
         * each citation key contains items:[], which is an array of response items 
         * and doi:<string>, which is the paper's formatted as a url doi (if it exists)
         */

        let knownCitations: any = [];

        for (let i = 0; i < items.length; i++) {




            // let source = generateItemSource(items[i]);
            // debugger;
            let citation = items[i][citationKey].split('doi')[0].split("retrieved from osf.io")[0].trim();
            let doi = items[i][citationKey].split('doi')[1];
            citation = citation.split("https://");
            // console.log(citation.split('doi'))

            if (!citation) continue;


            // debugger;
            if (citations[citation]) {
                // add to current citation items
                citations[citation].items.push(items[i])
            } else {
                // create new citation object
                
                let l = Object.keys(citations).length;
                // if(l==5) debugger;
                let finalDoi;
                if(doi){
                    finalDoi = `https://doi${cleanupDoi(doi)}`
                } else{
                    finalDoi = undefined;
                }
                citations[citation] = { items: [items[i]], doi: finalDoi};
            }
        }

        /**
         * generate itemParseResults, which is an array of objects
         *  containing 
         *      html: the  original text for the repsonse item
         *      renderHtml : the majime components html source
         *      hasError: whether there was an error trying to produce renderHtml
         *      errorType: the type of error
         */

        citationKeys = Object.keys(citations);
        for(let i=0; i<citationKeys.length; i++){
            citations[citationKeys[i]].itemParseResults = generateCitationSource(citations[citationKeys[i]]); 
            let errorCount = 0; 
            for(let j=0; j< citations[citationKeys[i]].itemParseResults.length; j++){
                let parseResult = citations[citationKeys[i]].itemParseResults[j];
                // console.log(parseResult);
                if(parseResult.hasError){ errorCount++;}
            }
            citations[citationKeys[i]].errorCount = errorCount;

            console.log( citations[citationKeys[i]].itemParseResults )
        }

        console.log("ready");

})


let cleanupDoi = (doi)=>{
    let result =  doi.replace(/\uFFA0/g, '').trim();
  
    if(result[0]==':'){ 
        result = result.replace(/:/g, '').trim();
        result = '.org/' + result;
    }
    
    return result;
}




export var generateCitationSource = (citation) => {
    let source:any = [];
    for (let i = 0; i < citation.items.length; i++) {
        let item = citation.items[i];
        source.push(generateItemSource(item));
        // console.log("------------------------ done")
    }

    return source;

}

let generateItemSource = (config) => {

    // console.log(Object.keys(config));
    console.log(config.Conditional.branching)


    
    let source = "";
    // console.log(config);

    
    let errorType = "none";
    if (config.Item.label) {
        // console.log("FOUND X1: ", config);
        source += `${config.Item.label}\n`;
    }

    
    // if(config.Item.label=="wat ben ik aan het doen (voor de piep)?") debugger;
    // if(config.Item.label=="geef aan de hand van het affect rooster aan hoe je je nu voelt") debugger;
    // if(config.Item.label=="waar ben ik?") debugger;
    

    
    let result;
    let val;
    let hasError= false;

    
    // result stores comments about parsing that are displayed alongside the response item in HTML
    
    if ((config.X[1])&&(config.X[1]!='n.a.')) {
        
        result = `${xProcessor.X1(config.X[1])}`;
        val = config.X[1];
        if (!result) {
            result = `<div class="missingProcessorError">Missing processor for:<br>X.1 = "${config.X[1]}" </div>`
            hasError = true;
            errorType = "processing X.1 returned undefined"
        }
        if (result == "undefined") {
            result = `<div class="missingProcessorError"> Missing processor for:<br>X.1 = "${config.X[1]}"</div>`
            hasError = true;
            errorType = "missing processor for X.1"
        } else{
            result += `\n<div class="processedInput"> Processed input was:<br>"${config.X[1]}"</div>`
            hasError = false;
        }
        source +=result
    } else if (config['Response.scale....anchoring']) {
        // console.log(config);
        result = `${xProcessor.responseScale(config['Response.scale....anchoring'])}`
        val = config['Response.scale....anchoring'];
        if (!result) {
            result = `<div class="missingProcessorError">result was undefined</div>`
            hasError = true;
            errorType = "processing responseScale returned undefined"
        }
        if (result == "undefined") {
            result = `<div class="missingProcessorError"> Missing processor for:<br>responseScale = "${config['Response.scale....anchoring']}"</div>`
            hasError = true;
            errorType = "missing processor for response scale"
        } else{
            result += `\n<div class="processedInput"> Processed input was:<br>"${config['Response.scale....anchoring']}"</div>`
            hasError = false;
        }
        source += result;

    } else if(config.Conditional.branching) {
        // debugger;
        
    }
    
    else {
        // console.log(config);
        hasError=true;
        errorType = "could not identify response scale"
        source+= `\n<div class="missingScale"> Could not identify response scale</div>`
        // debugger;
    }


    // console.log("NO X1: ", config);


    // console.log(source);

    let renderHtml = `<div class="item"> ${source} </div>`
    return { html : source, renderHtml:renderHtml, hasError, errorType} ;
}