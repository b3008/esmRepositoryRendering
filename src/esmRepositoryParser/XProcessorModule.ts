const X1 = (val)=>{
   // console.log("val: ", val)
   let type;
   let [range, labels] = val.split("from");
   
   let [min, max] = range.trim().split("-");
   min = parseFloat(min.trim());
   max = parseFloat(max.trim());

   let [minLabel, maxLabel] = labels.trim().split("to")
   minLabel = minLabel.trim();
   maxLabel = maxLabel.trim();

   if(max>10) {
      type="slider"
   }
   return getHTML(type, {min, max, minLabel,maxLabel})
}


const responseScale = (val) => {

   val = val.trim();
   console.log("responseScale:", val);

   if(val=="open text field"){
      return getHTML("textfield")
   } else if( (val.toLowerCase().indexOf("checklist")!=-1)||(val.toLowerCase().indexOf("clist")!=-1)){
   
      let listItems=val.substr(val.indexOf("(dutch:")+7, val.length-1 - val.indexOf("(dutch:")-7);
      listItems = listItems.trim().split(",");

      for(let i=0; i<listItems.length; i++){
         listItems[i] = listItems[i].trim();
      }
      
      return getHTML("checkboxes", {items:listItems}) 
   } else if( (val==="yes-no") || (val==="yes - no")){
         return getHTML("multiple-choice", {items:['yes', "no"]}) 
         
      
   } else if(val.indexOf("-")!=-1){
      let [min, max] = val.split("-");
      min = parseFloat(min.trim());
      max = parseFloat(max.trim());
      if(max>10){
         return getHTML("slider", {min, max, maxLabel:"", minLabel:""})
      }
   } else {
   
      console.log(val);
      debugger;
   }
   
   
}




const getHTML = (type:string, params?:any)=>{
   
   let getListItems = (list) =>{
      console.log(list);
      let result ="";
      for(let i=0; i<list.length; i++){
         result += `\n\t<aa-choice-item>${list[i]}</aa-choice-item>`
      }
      return result
   }


   switch(type){
      case "slider":
         return `<aa-slider min="${params.min}" max="${params.max}" max-label="${params.maxLabel}" min-label="${params.minLabel}"></aa-slider>`

      case "multiple-choice":
         console.log(params);
         return `\n<aa-multiple-choice>${getListItems(params.items)}\n</aa-multiple-choice>`

      case "checkboxes":
         console.log(params);
         return `\n<aa-checkboxes>${getListItems(params.items)}\n</aa-checkboxes>`;

      case "textfield":
         return `\n<aa-text-answer></aa-text-answer>`
   }

}

export const xProcessor = { X1, responseScale }