import { DataHandler } from './DataHandler.js'
let dataHandler = new DataHandler()
let categories = []

if (localStorage.getItem("categories")) {
    let storage = JSON.parse(localStorage.getItem("categories"))
    storage.forEach((category) => {
        category.tasks.forEach((task) => {
            dataHandler.addTask(task.name, category.name, task.completed)
        })
    })

    console.log("data added from local storage")
}
else {
    console.log("we have no data")
    
}

dataHandler.displayAll()
displayButton()

window.addEventListener("beforeunload", () => {
    localStorage.setItem("categories", JSON.stringify(dataHandler.categories))
}, false)

let checkBoxes = document.querySelectorAll(".checkBox")
checkBoxes.forEach((box) => {
    box.addEventListener("click", () => {
        let id = box.parentNode.id

        var categoryName = ""
        for (let index in id) {
            if (Number.isInteger(Number.parseInt(id[index]))) {
                break
            }
            categoryName += id[index]
        }

        let num = id.slice(id.length - 1)
        dataHandler.toggleCompleted(categoryName, num)

    })
})

let selector = document.getElementById("categorySelector")
let formContainer = document.getElementById("addTaskContainer")

/**
 * This is what happens when the save new task button is clicked
 */
document.getElementById("saveNewTask").addEventListener("click", () => {

    // get the form data
    let taskName = document.getElementById("taskName").value
    let category = document.getElementById("categoryName").value

    // CHECK TO MAKE SURE THERE IS DATA HANDLE IT BETTER THAN RETURNIGN!
    if (taskName === "") {
        return
    }

    if (category === "") {
        return
    }

    dataHandler.addTask(taskName, category)

    // hide the form
    formContainer.classList.toggle("hide")

    // display everything again
    dataHandler.displayAll()
    setBackgroundColor()
    displayButton()
})

/**
 * This will change the form to have the item added to the category
 */
selector.addEventListener("change", () => {
    let selector = document.getElementById("categorySelector")
    document.getElementById("categoryName").value = selector.value
})


function displayButton() {
    let container = document.createElement("div")
    container.classList.add("gridContainer")
    container.id = "addButton"

    let button = document.createElement("button")
    button.id = "addNewTask"
    button.classList.add("addNewTask")
    button.textContent = "Add New Task"
    container.appendChild(button)

    /***
    * This is what happens when the add new task is clicked
    */
    button.addEventListener("click", () => {
        dataHandler.removeAllTasks()

        // add the options for the secret form
        let options = document.getElementById("categorySelector")
        options.innerHTML = ""

        let otherOption = document.createElement("option")
        otherOption.value = "Other"
        otherOption.textContent = "Other"

        options.appendChild(otherOption)

        dataHandler.getCategoryNames().forEach((name) => {
            let newOption = document.createElement("option")
            newOption.for = name
            newOption.textContent = name

            options.appendChild(newOption)
        })

        // unhide the secret form
        formContainer.classList.toggle("hide")
    })

    document.getElementById("To-Do").appendChild(container)
}


/**************
 * Event listeners for filter buttons
 */
let showCompletedButton = document.getElementById("showCompleted")
let showAllButton = document.getElementById("showAll")
let showIncompletedButton = document.getElementById("showIncomplete")

showCompletedButton.addEventListener("click", () => {
    if (document.getElementById("To-Do").innerHTML === "") {
        return
    }


    dataHandler.removeAllTasks()
    dataHandler.displayCompletedTasks()
    displayButton()
    setBackgroundColor()
    showCompletedButton.style.backgroundColor = "slateblue"
})

showAllButton.addEventListener("click", () => {
    if (document.getElementById("To-Do").innerHTML === "") {
        return
    }

    dataHandler.removeAllTasks()
    dataHandler.displayAll()
    displayButton()
    setBackgroundColor()
    showAllButton.style.backgroundColor = "slateblue"
})

showIncompletedButton.addEventListener("click", () => {
    if (document.getElementById("To-Do").innerHTML === "") {
        return
    }

    dataHandler.removeAllTasks()
    dataHandler.displayNonCompletedTasks()
    displayButton()
    setBackgroundColor()
    showIncompletedButton.style.backgroundColor = "slateblue"
})



function setBackgroundColor() {
    showCompletedButton.style.backgroundColor = "lightskyblue"
    showAllButton.style.backgroundColor = "lightskyblue"
    showIncompletedButton.style.backgroundColor = "lightskyblue"
}