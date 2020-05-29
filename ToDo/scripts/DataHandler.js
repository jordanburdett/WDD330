import { Category } from './Category.js'
import { HelperMethods } from './HelperMethods.js'

export class DataHandler {
    // Data members
    categories = new Array()
    display = document.getElementById("To-Do")

    /******
     * addCategory
     * This will add a category to the data model
     */
    addCategory(categoryName) {
        let category = new Category(categoryName, this.categories.length)
        this.categories.push(category)
        console.log(`New category ${categoryName} created`)
    }

    /*******
     * addTask
     * This will add a task to the data model
     */
    addTask(taskName, categoryName, completed = false) {

        let category = this.categories.find((category) => {
            return category.name === categoryName
        })
        
        // If there is no category lets go ahead and create the category for the user
        if (category == null) {
            this.addCategory(categoryName)
            category = this.categories[this.categories.length - 1]
            category.addTask(taskName, completed)

        }
        else {

            category.addTask(taskName, completed)
        }

    }

    /*****
     * removeTask(id)    id: id of the task 
     * This will remove a task from the data model
     */
    removeTask(id) {

        var categoryName = ""
        for (let index in id) {
            if (Number.isInteger(Number.parseInt(id[index]))) {
                break
            }
            categoryName += id[index]
        }

        this.categories.forEach((category) => {

            if (category.name === categoryName) {
                category.removeTask(id)

            }
        })
    }

    toggleCompleted(categoryName, num) {

        let category = this.categories.find((category) => {
            return categoryName === category.name
        })
        let task = category.tasks[num]

        if (task.completed) {
            task.completed = false
        }
        else {
            task.completed = true
        }
    }


    /********
     * displayAll()
     * This wil display all the tasks stored in the dataModel
     */
    displayAll() {
        this.categories.forEach((category) => {
            this.displayAllTasksByCategory(category.name)
        })
    }

    /**********
     * removeAllTasks() 
     * this will remove all the tasks on the screen.
     */
    removeAllTasks() {
        this.display.innerHTML = ""
    }

    /*********
     * displayAllTasksByCategory()
     * This will display all of the tasks that belong to a specific category
     */
    displayAllTasksByCategory(categoryName) {
        let category = this.categories.find((category) => {
            return category.name === categoryName
        })

        // display the header
        let helperMethods = new HelperMethods()
        let HTML = helperMethods.createCategoryHTML(category.name, category.id)
        this.display.appendChild(HTML)


        // display the tasks for the category
        if (category.tasks.length > 0) {
            category.tasks.forEach((task) => {
                let taskHTML = helperMethods.createHTMLTask(task.name, task.id, task.completed)
                this.display.appendChild(taskHTML)
            })
        }
        else {
            let nothingToDisplayHTML = helperMethods.createHTMLTask("No Tasks Here!", 0, true)
            this.display.appendChild(nothingToDisplayHTML)
        }
    }

    /**
     * displayCompletedTasks()
     * This will display only the tasks that have been completed
     */
    displayCompletedTasks() {
        let helperMethods = new HelperMethods()

        this.categories.forEach((category) => {

            if (this.hasACompletedTask(category)) {

                let HTML = helperMethods.createCategoryHTML(category.name, category.id)
                this.display.appendChild(HTML)

                category.tasks.forEach((task) => {
                    if (task.completed) {
                        let taskHTML = helperMethods.createHTMLTask(task.name, task.id, task.completed)
                        this.display.appendChild(taskHTML)
                    }
                })
            }

        })
    }

    hasACompletedTask(category) {
        for (let index in category.tasks) {

            if (category.tasks[index].completed) {
                console.log(category.tasks[index].name)
                return true
            }
        }

        return false
    }

    hasNonCompletedTask(category) {
        for (let index in category.tasks) {
            if (!category.tasks[index].completed) {
                return true
            }
        }

        return false
    }

    displayNonCompletedTasks() {
        let helperMethods = new HelperMethods()

        this.categories.forEach((category) => {

            // only show those that have a non completed task
            if (this.hasNonCompletedTask(category)) {

                let HTML = helperMethods.createCategoryHTML(category.name, category.id)
                this.display.appendChild(HTML)

                category.tasks.forEach((task) => {
                    if (!task.completed) {
                        let taskHTML = helperMethods.createHTMLTask(task.name, task.id, false)
                        this.display.appendChild(taskHTML)
                    }
                })
            }
        })
    }

    getCategoryNames() {
        let names = []

        this.categories.forEach((category) => {
            names.push(category.name)
        })

        return names
    }
}