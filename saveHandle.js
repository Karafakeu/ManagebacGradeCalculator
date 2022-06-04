function saveSetts(grade,gradeStyle,finalColor){
    chrome.storage.sync.set({
        "grade": grade, 
        "gradeStyle": gradeStyle,
        "finalColor": finalColor
    })
}
export {saveSetts};