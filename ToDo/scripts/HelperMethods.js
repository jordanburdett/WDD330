export class HelperMethods {
    createHTMLTask(taskName, id, completed) {
        let newTask = document.createElement("div")
        newTask.classList.add("task")
        newTask.id = id
        newTask.textContent = taskName
        
        return newTask
    }

    createCategoryHTML(categoryName, id) {
        // create the div
        let newCategory = document.createElement("div")
        newCategory.classList.add("category")
        newCategory.id = id

        // create the h3 in the div
        let header = document.createElement("h3")
        header.textContent = categoryName

        // add the header to the div
        newCategory.appendChild(header)

        return newCategory
    }
}