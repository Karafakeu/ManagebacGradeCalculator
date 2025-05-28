chrome.storage.sync.get(["gradeCalculation","gradeStyle","finalColor"],(res)=>{
    gradeCalculation.checked=res.gradeCalculation
    gradeStyle.checked=res.gradeStyle
    finalColor.value=res.finalColor
    predictionTable.checked=res.predictionTable
})