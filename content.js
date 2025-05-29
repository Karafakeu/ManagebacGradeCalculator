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

// add grade to the prediction table
function addGrade(category){
    let inputs = document.getElementById(category + "-inputs").getElementsByClassName("inputs")[0]
    inputs.innerHTML += `<input class="grade-input" style="width: 60px;" value=""/>`
}

// calculate final grade using categories and grades passed
function calculateFinalGrade(categories, grades){
    let finalGrade = 0
    let finalGradeWeight = 0
    for (gradeGroup in grades) {
        // weight
        let gradeWeight = categories[gradeGroup]
        finalGradeWeight += gradeWeight

        // grade
        let sum = 0
        let count = 0
        for (let grade of grades[gradeGroup]) {
            sum += grade
                count++
            }
            let avg = sum / count
            finalGrade += avg * gradeWeight
        }
        finalGrade = finalGrade / finalGradeWeight
        finalGrade = (Math.round((finalGrade + Number.EPSILON) * 100) / 100).toString() + "%"
        return finalGrade
}

// predict final grade from predicted grade table
function predictGrade(){
    let categories = fetchCategories()
    let predictedGrades = {}
    predictedTable = document.getElementById("grade-table")
    Array.from(predictedTable.rows).slice(1).forEach(row => {
        let category = row.cells[0].innerHTML
        let grade = Array.from(row.cells[2].getElementsByClassName("grade-input")).map(input => parseFloat(input.value) == "" ? 0 : parseFloat(input.value)).filter(grade => !isNaN(grade))
        if (grade.length == 0) {return}
        predictedGrades[category] = grade
    })

    const finalGrade = calculateFinalGrade(categories, predictedGrades)
    document.getElementById("finalPredictionText").innerHTML = "Predicted Final Grade: " + finalGrade
}

// fetch categories
function fetchCategories(){
    let categories = {}
    Array.from(document.getElementById("categories-table").children).slice(1).forEach(category => {
        let categoryName = category.getElementsByClassName("cell")[0].getElementsByClassName("label")[0].innerHTML.trim().split("\n")[0]
        let categoryWeight = parseInt(category.getElementsByClassName("cell")[1].innerHTML.replace("%", ""))
        categories[categoryName] = categoryWeight
    });
    return categories
}

function createPredictionTable(categories, grades){
    let gradeTable = document.createElement("table")
    gradeTable.id = "grade-table"
    gradeTable.innerHTML = 
    `
        <thead>
            <tr>
                <th>Category</th>
                <th>Weight</th>
                <th>Grades</th>
            </tr>
        </thead>
        <tbody>
            ${Object.keys(categories).map(category => `
                <tr>
                    <td style="text-align: left; width: 30%">${category}</td>
                    <td style="text-align: left; width: 10%">${categories[category]}%</td>
                    <td style="text-align: left; width: 60%;">
                        <div id="${category}-inputs" style="display: flex; align-items: center; flex-wrap: nowrap; overflow-x: auto;">
                            <div class="inputs" style="display: flex; flex-wrap: nowrap; gap: 10px;">
                            ${grades[category] ? grades[category].map(grade =>
                                `<input class="grade-input" style="width: 60px;" value="${grade}"/>`
                            ).join("") : ""}
                            </div>
                            <button class="add-grade-btn" data-category="${category}" 
                                style="background: #2A5CFF; border: none; border-radius: 5px; padding: 5px 10px; color: white; font-size: 1.2em; cursor: pointer; margin-left: 10px;">
                            +
                            </button>
                        </div>
                        </td>

                </tr>
            `).join("")}
        </tbody>
    `
    gradeTable.style.width = "100%"
    gradeTable.style.marginTop = "20px"
    Array.from(gradeTable.rows).forEach(row => {
        row.style.borderBottom = "1px solid #ddd"
    })

    return gradeTable
}

// hint for reading: follow the class names
async function main(){
    let categories = fetchCategories()
    let grades = {}
    const settings = await getSettings()
    let finalGradeObjects = document.getElementsByClassName("page-head-tile")

    // Fetch grades
    Array.from(document.getElementsByClassName("tasks-list-container")[0].getElementsByClassName("fusion-card-item")).forEach(taskCard => {
        let gradeCategory = Array.from(taskCard.getElementsByClassName("flex")[0].getElementsByClassName("stretch")[0]
            .getElementsByClassName("label-and-due")[0].getElementsByClassName("labels-set")[0].getElementsByClassName("label"))
            // Find the label with the category
            .find(label => Object.keys(categories).includes(label.innerHTML.trim().split("\n")[0]))?.innerHTML.trim().split("\n")[0]
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
        console.log(grades)
        let finalGrade = calculateFinalGrade(categories,grades)

        Array.from(finalGradeObjects).forEach(finalGradeObject => {
            finalGradeObject.getElementsByTagName("h3")[0].innerHTML = "Semester Grade: " + finalGrade
            finalGradeObject.getElementsByTagName("h3")[0].style.color = settings.finalColor
        })
    }

    //grade table
    if (settings.predictionTable || settings.predictionTable == undefined) {
        // line
        const line = document.createElement("hr");
        line.style.marginTop = "20px";
        document.body.getElementsByClassName("content-block")[0].appendChild(line);

        // heading
        const heading = document.createElement("h3");
        heading.innerHTML = "Prediction Table";
        document.body.getElementsByClassName("content-block")[0].appendChild(heading);

        // table
        document.body.getElementsByClassName("content-block")[0].appendChild(createPredictionTable(categories,grades))

        // final prediction button
        const finalPrediction = document.createElement("button");
        finalPrediction.id = "finalPredictionButton";
        finalPrediction.style.background = "#2A5CFF";
        finalPrediction.style.marginTop = "20px";
        finalPrediction.style.border = "none";
        finalPrediction.style.borderRadius = "5px";
        finalPrediction.style.padding = "5px";
        finalPrediction.style.color = "white";
        finalPrediction.style.fontSize = "1.2em";
        finalPrediction.style.cursor = "pointer";
        finalPrediction.innerHTML = "Predict Final Grade";
        document.body.getElementsByClassName("content-block")[0].appendChild(finalPrediction);

        // final prediction text
        const finalPredictionText = document.createElement("p");
        finalPredictionText.style.marginTop = "10px";
        finalPredictionText.id = "finalPredictionText";
        finalPredictionText.innerHTML = "Predicted Final Grade: " + calculateFinalGrade(categories,grades);
        document.body.getElementsByClassName("content-block")[0].appendChild(finalPredictionText);

        // final prediction
        let finalPredictionButton = document.getElementById("finalPredictionButton")
        finalPredictionButton.addEventListener("click", () => {
            predictGrade()

            finalPredictionButton.style.backgroundColor="#072175"
            finalPredictionButton.style.color="#FFFFFF"

            setTimeout(()=>{
                finalPredictionButton.style.backgroundColor="#2A5CFF"
                finalPredictionButton.style.color="#E5E5E5"
            },1000)
        })

        document.querySelectorAll('.add-grade-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const category = event.target.getAttribute('data-category');
                addGrade(category);
            });
        });
    }
}

main()