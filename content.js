let lastUrl = location.href; 
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl && url.match(/^https:\/\/opengate\.managebac\.com\/student\/classes\/[^\/]+\/core_tasks$/)) {
        lastUrl = url;
        setTimeout(() => {
            main();
        }, 2000);
    }
}).observe(document, {subtree: true, childList: true});

function getSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["gradeCalculation", "gradeStyle", "finalColor", "predictionTable"], resolve);
    });
}

// hint for reading: follow the class names
async function main(){
    let categories = {}
    let grades = {}
    const settings = await getSettings()
    let finalGradeObjects = document.getElementsByClassName("page-head-tile")

    console.log(settings)

    // Fetch categories from category table
    Array.from(document.getElementById("categories-table").children).slice(1).forEach(category => {
        let categoryName = category.getElementsByClassName("cell")[0].getElementsByClassName("label")[0].innerHTML.trim().split("\n")[0]
        let categoryWeight = parseInt(category.getElementsByClassName("cell")[1].innerHTML.replace("%", ""))
        categories[categoryName] = categoryWeight
    });

    // Fetch grades
    Array.from(document.getElementsByClassName("tasks-list-container")[0].getElementsByClassName("fusion-card-item")).forEach(taskCard => {
        let gradeCategory = Array.from(taskCard.getElementsByClassName("flex")[0].getElementsByClassName("stretch")[0]
            .getElementsByClassName("label-and-due")[0].getElementsByClassName("labels-set")[0].getElementsByClassName("label"))
            // Find the label with the category
            .find(label => Object.keys(categories).includes(label.innerHTML))?.innerHTML
        let grading = taskCard.getElementsByClassName("assessment")[0].getElementsByClassName("flex")[0].getElementsByClassName("cell")[0]
            ?.getElementsByClassName("points")[0]?.innerHTML.replace(" pts", "")
        if (!grading) {return}
        let grade = (parseFloat(grading.split("/")[0]) / parseFloat(grading.split("/")[1])) * 100
        grades[gradeCategory] = grades[gradeCategory] ? [...grades[gradeCategory], grade] : [grade]

        // gradeStyle logic
        if (settings.gradeStyle || settings.gradeStyle == undefined) {
            let gradeObject = taskCard.getElementsByClassName("assessment")[0].getElementsByClassName("flex")[0].getElementsByClassName("cell")[0]
                ?.getElementsByClassName("grade")[0]
            if (gradeObject) {
                // rounding is taken off https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary cuz i cant speak js
                gradeObject.innerHTML = (Math.round((grade + Number.EPSILON) * 100) / 100).toString() + "%"
            }
        }
    })

    // set default finalColor
    if (settings.finalColor == undefined){
        settings.finalColor = "#000000"
    }

    // Calculate final grade
    if (settings.gradeCalculation || settings.gradeCalculation == undefined) {
        let finalGrade = 0
        let finalGradeWeight = 0
        for (gradeGroup in grades) {
            // weight
            let gradeWeight = categories[gradeGroup]
            finalGradeWeight += gradeWeight

            // grade
            let sum = 0
            let count = 0
            for (grade of grades[gradeGroup]) {
                sum += grade
                count++
            }
            let avg = sum / count
            finalGrade += avg * gradeWeight
        }
        finalGrade = finalGrade / finalGradeWeight
        finalGrade = (Math.round((finalGrade + Number.EPSILON) * 100) / 100).toString() + "%"

        Array.from(finalGradeObjects).forEach(finalGradeObject => {
            finalGradeObject.getElementsByTagName("h3")[0].innerHTML = "Semester Grade: " + finalGrade
            finalGradeObject.getElementsByTagName("h3")[0].style.color = settings.finalColor
        })
    }
}

main()