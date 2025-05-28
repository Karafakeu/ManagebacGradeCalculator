const saveBtn=document.getElementById("save-btn")
const gradeCalculation=document.getElementById("gradeCalculation")
const gradeStyle=document.getElementById("gradeStyle")
const finalColor=document.getElementById("finalColor")
const predictionTable=document.getElementById("predictionTable")


async function saveSetts(gradeCalculation,gradeStyle,finalColor, predictionTable){
    await chrome.storage.sync.set({
        "gradeCalculation": gradeCalculation, 
        "gradeStyle": gradeStyle,
        "finalColor": finalColor,
        "predictionTable": predictionTable
    })

    saveBtn.style.backgroundColor="#072175"
    saveBtn.style.color="#FFFFFF"
    saveBtn.innerHTML="Saved"

    setTimeout(()=>{
        saveBtn.style.backgroundColor="#2A5CFF"
        saveBtn.style.color="#E5E5E5"
        saveBtn.innerHTML="Save"
    },1000)
}

saveBtn.addEventListener("click",()=>{
    saveSetts(gradeCalculation.checked, gradeStyle.checked, finalColor.value, predictionTable.checked);
})