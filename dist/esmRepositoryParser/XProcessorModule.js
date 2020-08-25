"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xProcessor = void 0;
const X1 = (val) => {
    // console.log("val: ", val)
    // if(val=='2d grid: x-axis 0-100 (onplezierig-plezierig); y-axis 0-100 (passief-actief)'){
    //    return getHTML("boxgrid", {x:100, y:100, xlabel:"onplezierig-plezierig", ylabel:"passief-actief"})
    // }
    if ((val === `slider ranging from "unhappy" (0; unzufrieden) over "neutral" (5; neutral) to very happy (10; sehr zufrieden)`) ||
        (val == `slider from very unhappy (0; sehr unzufrieden) over "neutral" (5; neutral) to "very happy" (10; sehr zufrieden)`)) {
        return getHTML("slider", { minLabel: "unzufrieden", maxLabel: "zufrieden", min: 0, max: 10 });
    }
    try {
        // console.log(val);
        let type;
        let [range, labels] = val.split("from");
        let [min, max] = range.trim().split("-");
        min = parseFloat(min.trim());
        max = parseFloat(max.trim());
        let [minLabel, maxLabel] = labels.trim().split("to");
        minLabel = minLabel.trim();
        maxLabel = maxLabel.trim();
        if (max > 10) {
            type = "slider";
        }
        return getHTML(type, { min, max, minLabel, maxLabel });
    }
    catch (e) {
        return;
    }
};
const responseScale = (val) => {
    val = val.trim();
    // console.log("responseScale:", val);
    if (val.match(/categorical \([0-9]+-[0-9]+\)/)) {
        val = val.replace(/categorical \([0-9]+-[0-9]+\)/, '');
        if (val.indexOf("categorical (") != -1) {
            //string is repeating
            val = val.substr(0, val.indexOf("categorical ("));
        }
        let items = val.split(';');
        return getHTML("multiple-choice", { items });
    }
    if ((val.indexOf("1)") != -1) && (val.indexOf("2)") != -1)) {
        let items = val.split(/.?\)/g);
        items.shift();
        let values = Array.from(Array(items.length + 1).keys());
        values.shift();
        return getHTML("multiple-choice", { items, values });
    }
    // if(val=="1) schoolwerk 2) huishouden, boodschappen 3) zelfverzorging 4) roken 5) sporten 6) gamen, internetten 7) tv kijken 8) rusten, chillen 9) praten 10) eten, drinken, 11) iets anders 12) niets"){
    //    return getHTML("multiple-choice", { items: ['schoolwerk', 'huishouden, boodschappen', 'zelfverzorging', 'roken', 'sporten', 'gamen, internetten', 'tv kijken', 'rusten, chillen', 'praten',  'eten, drinken', 'iets anders', 'niets'], values:[1,2,3,4,5,6,7,8,9,10,11,12] })
    // }
    if (val == "1 2 3 4 5 6 >6 (self not included)") {
        return getHTML("multiple-choice", { items: ["1", "2", "3", "4", "5", "6", ">6"] });
    }
    // if(val=='1) thuis 2) bij familie, vrienden 3) op werk, school 4) gezondheidszorg 5) openbare gelegenheid 6) onderweg 7) ergens anders'){
    //    return getHTML("multiple-choice", { items: ['thuis', 'bij familie, vrienden', 'op werk, school', 'gezondheidszorg', 'openbare gelegenheid', 'onderweg', 'ergens anders'], values:[1,2,3,4,5,6,7] })
    // }
    if (val == "binomial yes/no") {
        return getHTML("multiple-choice", { items: ['yes', 'no'] });
    }
    if (val == "niet 1 2 3 4 5 6 7  zeer") {
        return getHTML("likert-scale", { items: 7, startLabel: "niet", endLabel: "zeer" });
    }
    if (val == "1 (not at all) - 7 (very much)") {
        return getHTML("likert-scale", { items: 7, startLabel: "(not at all)", endLabel: "(very much)" });
    }
    if (val == "ok") {
        return getHTML("button", { label: "ok" });
    }
    if (val == "open text field") {
        return getHTML("textfield");
    }
    if ((val.toLowerCase().indexOf("checklist") != -1) || (val.toLowerCase().indexOf("clist") != -1)) {
        let listItems = val.substr(val.indexOf("(dutch:") + 7, val.length - 1 - val.indexOf("(dutch:") - 7);
        listItems = listItems.trim().split(",");
        for (let i = 0; i < listItems.length; i++) {
            listItems[i] = listItems[i].trim();
        }
        return getHTML("checkboxes", { items: listItems });
    }
    if ((val === "yes-no") || (val === "yes - no")) {
        return getHTML("multiple-choice", { items: ['yes', "no"] });
    }
    if (val.indexOf("yes/no") != -1) {
        return getHTML("multiple-choice", { items: ['yes', "no"] });
    }
    if (val.indexOf("-") != -1) {
        let [min, max] = val.split("-");
        min = parseFloat(min.trim());
        max = parseFloat(max.trim());
        if (max > 10) {
            return getHTML("slider", { min, max, maxLabel: "", minLabel: "" });
        }
    }
    return undefined;
};
const getHTML = (type, params) => {
    let getListItems = (params) => {
        // console.log(list);
        let result = "";
        let v = params.values || [];
        for (let i = 0; i < params.items.length; i++) {
            if (v[i]) {
                result += `\n\t<aa-choice-item value="${v[i]}">${params.items[i]}</aa-choice-item>`;
            }
            else {
                result += `\n\t<aa-choice-item>${params.items[i]}</aa-choice-item>`;
            }
        }
        return result;
    };
    switch (type) {
        case "slider":
            return `<aa-slider class="aa-item" min="${params.min}" max="${params.max}" max-label="${params.maxLabel}" min-label="${params.minLabel}"></aa-slider>`;
        case "multiple-choice":
            // console.log(params);
            return `\n<aa-multiple-choice class="aa-item" horizontal="${params.horizontal || false}">${getListItems(params)}\n</aa-multiple-choice>`;
        case "checkboxes":
            // console.log(params);
            return `\n<aa-checkboxes class="aa-item">${getListItems(params)}\n</aa-checkboxes>`;
        case "textfield":
            return `\n<aa-text-answer class="aa-item"></aa-text-answer>`;
        case "likert-scale":
            return `\n<aa-likert-scale class="aa-item" items="${params.items}" start-label="${params.startLabel || ''}" end-label="${params.endLabel || ''}" middle-label="${params.middleLabel || ''}"></aa-likert-scale>`;
        case "button":
            return `\n<div><paper-button>${params.label}</paper-button></div>`;
    }
};
exports.xProcessor = { X1, responseScale };
//# sourceMappingURL=XProcessorModule.js.map