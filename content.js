let points = $("div.points")
let grade1=$("span.grade")
let weigth2=$("div.label")
let weigth1=$("div.list-item")
let weights={}
let grades={} 
for (let u = 1; u < weigth1.length ; u++){
    let temp=weigth1[u].innerText.replaceAll(" ","").replace("\n"," ").replace("%","").split(" ");
    weights[temp[0]]=temp[1]
}
let i = points.length
i=i-1
let regex = /[0-9]{1,3}/g;
while (i > -1) {
    let pointst=points[i].innerHTML.replace("/ ","").replace(" pts","").split(" ")
    let grade = pointst[0]
    let max = pointst[1]
    let gradefin=Math.round((100/max)*grade)
    grade1[i].innerHTML=gradefin+"%"
    $("div.points")[i].replaceWith("")
    console.log($("div.labels-set"));
    /* console.log($("div.labels-set")[0].innerText,$("div.labels-set")[0+2].innerText); */
    i=i-1
}