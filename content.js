let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});

function onUrlChange() {
    setTimeout(function(){
    let points = $("div.points")
    let grade1=$("span.grade")
    let weigth1=$("div.list-item")
    let arrt=$("div.labels-set")
    let tempt=$("h3")
    let arr=[]
    let arlen=arrt.length
    let weights={}
    let gradeavg=0
    let grades={}
    for (let u = 1; u < weigth1.length ; u++){
        let temp=weigth1[u].innerText.replaceAll(" ","").replace("\n"," ").replace("%","").replaceAll("%","").split(" ");
        weights[temp[0]]=temp[1]
    }
    for(let n=0;n<arlen;n++){
        try{ 
            if(arrt[n+1].innerText!="N/A" && arrt[n].className!=arrt[n+1].className && arrt[n].className=="labels-set flex flex-start flex-wrap"){
                if (arrt[n].innerText.includes("HL\nSL")){
                    arr.push(arrt[n].innerText.split("\n")[3].replaceAll(" ","").replaceAll("%",""))
                }else{
                    arr.push(arrt[n].innerText.split("\n")[1].replaceAll(" ","").replaceAll("%",""))
                }
            }
        }catch (error){
    
        }
    }
    for (i=points.length-1;i>-1;i--){
        let pointstt=points[i].innerHTML.replace("/ ","").replace(" pts","").split(" ")
        if (pointstt[0]==""){
            points.splice(i,1)
        }
    }
    let regex = /[0-9]{1,3}/g;
    for(i=points.length-1;i>-1;i--){
        let pointst=points[i].innerHTML.replace("/ ","").replace(" pts","").split(" ")
        let grade = pointst[0]
        let max = pointst[1]
        let gradefin=Math.round((100/max)*grade)
        if (grade1[i]!==undefined){
            grade1[i].innerHTML=gradefin+"%"
            points[i].replaceWith("")
            if (grades.hasOwnProperty(arr[i])){
                grades[arr[i]].push(gradefin)
            }else{
                grades[arr[i]]=[gradefin]
            }
        }
    }
    for(let key in grades){
        let w=0
        let temp=0
        if(grades.hasOwnProperty(key)){
            w=weights[key]
            for(let key1 in grades[key]){
                temp=temp+parseInt(grades[key][key1])
            }
            temp=temp/grades[key].length
            gradeavg=gradeavg+temp*w
        }
    }
    let maxnum=0
    for(let b=0;b<Object.keys(grades).length;b++){
        maxnum=maxnum+parseInt(weights[Object.keys(grades)[b]])
    }
    if (gradeavg/maxnum<=100){
        gradeavg=gradeavg/maxnum
        gradeavg=gradeavg.toFixed(2)
    }else{
        gradeavg=100
    }
    let gradeavgstr=("")
    gradeavgstr=gradeavg.toString()
    gradeavgstr=gradeavgstr+"%"
    for(let l=0;l<tempt.length;l++){
        if(tempt[l].innerText=="Progress Chart"){
            tempt[l].innerText="Final Grade: "+gradeavgstr
        }else{}
    }
    },2500)
}
let points = $("div.points")
let grade1=$("span.grade")
let weigth1=$("div.list-item")
let arrt=$("div.labels-set")
let tempt=$("h3")
let arr=[]
let arlen=arrt.length
let weights={}
let gradeavg=0
let grades={}
for (let u = 1; u < weigth1.length ; u++){
    let temp=weigth1[u].innerText.replaceAll(" ","").replace("\n"," ").replace("%","").replaceAll("%","").split(" ");
    weights[temp[0]]=temp[1]
}
for(let n=0;n<arlen;n++){
    try{ 
        if(arrt[n+1].innerText!="N/A" && arrt[n].className!=arrt[n+1].className && arrt[n].className=="labels-set flex flex-start flex-wrap"){
            if (arrt[n].innerText.includes("HL\nSL")){
                arr.push(arrt[n].innerText.split("\n")[3].replaceAll(" ","").replaceAll("%",""))
            }else{
                arr.push(arrt[n].innerText.split("\n")[1].replaceAll(" ","").replaceAll("%",""))
            }
        }
    }catch (error){

    }
}
for (i=points.length-1;i>-1;i--){
    let pointstt=points[i].innerHTML.replace("/ ","").replace(" pts","").split(" ")
    if (pointstt[0]==""){
        points.splice(i,1)
    }
}
let regex = /[0-9]{1,3}/g;
for(i=points.length-1;i>-1;i--){
    let pointst=points[i].innerHTML.replace("/ ","").replace(" pts","").split(" ")
    let grade = pointst[0]
    let max = pointst[1]
    let gradefin=Math.round((100/max)*grade)
    if (grade1[i]!==undefined){
        grade1[i].innerHTML=gradefin+"%"
        points[i].replaceWith("")
        if (grades.hasOwnProperty(arr[i])){
            grades[arr[i]].push(gradefin)
        }else{
            grades[arr[i]]=[gradefin]
        }
    }
}
for(let key in grades){
    let w=0
    let temp=0
    if(grades.hasOwnProperty(key)){
        w=weights[key]
        for(let key1 in grades[key]){
            temp=temp+parseInt(grades[key][key1])
        }
        temp=temp/grades[key].length
        gradeavg=gradeavg+temp*w
    }
}
let maxnum=0
for(let b=0;b<Object.keys(grades).length;b++){
    maxnum=maxnum+parseInt(weights[Object.keys(grades)[b]])
}
if (gradeavg/maxnum<=100){
    gradeavg=gradeavg/maxnum
    gradeavg=gradeavg.toFixed(2)
}else{
    gradeavg=100
}
let gradeavgstr=("")
gradeavgstr=gradeavg.toString()
gradeavgstr=gradeavgstr+"%"
for(let l=0;l<tempt.length;l++){
    if(tempt[l].innerText=="Progress Chart"){
        tempt[l].innerText="Final Grade: "+gradeavgstr
    }else{}
}