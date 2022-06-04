import {saveSetts} from './saveHandle.js'
const saveBtn=document.getElementById("save-btn")
const grade=document.getElementById("grade")
const gradeStyle=document.getElementById("gradeStyle")
const finalColor=document.getElementById("finalColor")
saveBtn.addEventListener("click",()=>{
    saveSetts(grade.checked, gradeStyle.checked, finalColor.value);
})