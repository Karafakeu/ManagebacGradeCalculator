const grade=document.getElementById("grade")
const gradeStyle=document.getElementById("gradeStyle")
const finalColor=document.getElementById("finalColor")
chrome.storage.sync.get(["grade","gradeStyle","finalColor"],(res)=>{
    grade.checked=res.grade
    gradeStyle.checked=res.gradeStyle
    finalColor.value=res.finalColor
})