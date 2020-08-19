import * as https from 'https';

const bib2json = require('bib2json');

export const getBib = async (doi) => {
    let id = doi.substr("https://doi.org/".length);
    let url = `https://www.doi2bib.org/2/doi2bib?id=${id}`
    let result = await get(url, { headers: { Accept: "application/x-bibtex" } })
    return bib2json(result);
}

export const get = (url, options?) => {



    console.log("making request:", url);
    return new Promise((resolve, reject) => {
        let nRequest = https.get(url, options, (nRes: any) => {
            let result = '';
            nRes.on('data', (chunk: any) => {

                result += chunk
            })
            nRes.on('end', (chunk: any) => {
                console.log(result);
                resolve(result);
            })

            nRes.on("error", (e) => {
                console.log("error at nRes", e);
            })
        })

        nRequest.on("error", (e) => {
            console.log("error at nRequest for " + url, e);

        })
    })



}