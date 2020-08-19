"use strict";
console.log("yo!");
var csv = require("csvtojson/v2");
csv().fromFile('./DATA_ESM_Item_Repository.csv').then(function (jsonResult) {
    console.log(jsonResult);
});
