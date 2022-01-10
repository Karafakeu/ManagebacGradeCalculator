let points = $("div.points")
console.log(points)
let i = points.length
i=i-1
let regex = /[0-9]{1,3}/g;
while (i > -1) {
    let pointst=points[i].innerHTML.replace("/ ","").replace(" pts","").split(" ")
    let grade = pointst[0]
    let max = pointst[1]
    let gradefin=Math.round((100/max)*grade)
    console.log(gradefin);
    
    i = i-1
}