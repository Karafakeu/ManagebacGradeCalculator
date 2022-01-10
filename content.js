let points = $("div.points")
let grade1=$("span.grade")
let weigth2=$("div.label")
let weigth1=$("div.list-item")
let arrt=$("div.labels-set")
let arr=[]
let arlen=arrt.length
let weights={}
let grades={}
for (let u = 1; u < weigth1.length ; u++){
    let temp=weigth1[u].innerText.replaceAll(" ","").replace("\n"," ").replace("%","").split(" ");
    weights[temp[0]]=temp[1]
}
for(let n=0;n<arlen;n++){
    try{
        if(arrt[n].className!=arrt[n+1].className && arrt[n].className=="labels-set flex flex-start flex-wrap"){
            arr.push(arrt[n].innerText.split("\n")[1].replaceAll(" ",""))
        }
    }catch (error){

    }
}
let regex = /[0-9]{1,3}/g;
for(i=points.length-1;i>-1;i--){
    let pointst=points[i].innerHTML.replace("/ ","").replace(" pts","").split(" ")
    let grade = pointst[0]
    let max = pointst[1]
    let gradefin=Math.round((100/max)*grade)
    grade1[i].innerHTML=gradefin+"%"
    $("div.points")[i].replaceWith("")
    if (grades.hasOwnProperty(weights[arr[i]])){
        grades[weights[arr[i]]].push(gradefin)
    }else{
        grades[weights[arr[i]]]=[gradefin]
    } 
}
for(let key in grades){
    let w=0
    let temp=0
    if(grades.hasOwnProperty(key)){
        // key                 = keys,  left of the ":"
        // driversCounter[key] = value, right of the ":"
        w=parseInt(key)
        for(let key1 in grades[key]){
            temp=temp+parseInt(grades[key][key1])
        }
    }
}