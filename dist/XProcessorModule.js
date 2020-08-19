"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xProcessor = void 0;
const X1 = (val) => {
    // console.log("val: ", val)
    let type;
    let [range, labels] = val.split("from");
    let [minRange, maxRange] = range.trim().split("-");
    minRange = parseFloat(minRange.trim());
    maxRange = parseFloat(maxRange.trim());
    let [minLabel, maxLabel] = labels.trim().split("to");
    minLabel = minLabel.trim();
    maxLabel = maxLabel.trim();
    if (maxRange > 10) {
        type = "slider";
    }
    return getHTML(type, { minRange, maxRange, minLabel, maxLabel });
};
const responseScale = (val) => {
    val = val.trim();
    console.log("responseScale:", val);
    if (val == "open text field") {
        return getHTML("textfield");
    }
    else if ((val.toLowerCase().indexOf("checklist") != -1) || (val.toLowerCase().indexOf("clist") != -1)) {
        let listItems = val.substr(val.indexOf("(dutch:") + 7, val.length - 1 - val.indexOf("(dutch:") - 7);
        listItems = listItems.trim().split(",");
        for (let i = 0; i < listItems.length; i++) {
            listItems[i] = listItems[i].trim();
        }
        return getHTML("checkboxes", { items: listItems });
    }
    else if ((val === "yes-no") || (val === "yes - no")) {
        return getHTML("multiple-choice", { items: ['yes', "no"] });
    }
    else if (val.indexOf("-") != -1) {
        let [minRange, maxRange] = val.split("-");
        minRange = parseFloat(minRange.trim());
        maxRange = parseFloat(maxRange.trim());
        if (maxRange > 10) {
            return getHTML("slider", { minRange, maxRange, maxLabel: "", minLabel: "" });
        }
    }
    else {
        console.log(val);
        debugger;
    }
};
const getHTML = (type, params) => {
    let getListItems = (list) => {
        console.log(list);
        let result = "";
        for (let i = 0; i < list.length; i++) {
            result += `\n\t<aa-choice-item>${list[i]}</aa-choice-item>`;
        }
        return result;
    };
    switch (type) {
        case "slider":
            return `<aa-slider min="${params.minRange}" max="${params.maxRange}" max-label="${params.maxLabel}" min-label="${params.minLabel}"></aa-slider>`;
        case "multiple-choice":
            console.log(params);
            return `\n<aa-multiple-choice>${getListItems(params.items)}\n</aa-multiple-choice>`;
        case "checkboxes":
            console.log(params);
            return `\n<aa-checkboxes>${getListItems(params.items)}\n</aa-checkboxes>`;
        case "textfield":
            return `\n<aa-text-answer></aa-text-answer>`;
    }
};
exports.xProcessor = { X1, responseScale };
//# sourceMappingURL=XProcessorModule.js.map