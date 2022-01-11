let points = $("div.points")
let grade1=$("span.grade")
let weigth2=$("div.label")
let weigth1=$("div.list-item")
let arrt=$("div.labels-set")
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
            arr.push(arrt[n].innerText.split("\n")[1].replaceAll(" ","").replaceAll("%",""))
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
        if (grades.hasOwnProperty(arr[i])){
            grades[arr[i]].push(gradefin)
        }else{
            grades[arr[i]]=[gradefin]
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
if (Math.round(gradeavg/maxnum)<=100){
    gradeavg=Math.round(gradeavg/maxnum)
}else{
    gradeavg=100
}
