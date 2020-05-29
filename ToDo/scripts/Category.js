import { Task } from './Task.js'
import { HelperMethods } from './HelperMethods.js'


export class Category {
    name = ""
    tasks = []
    id = 0

    constructor(name, id, task = new Array()) {
        this.name = name  // name of Category
        this.tasks = task  // array of tasks
        this.id = id      // just incase I need it
    }

    /****
     * Adds a task to the current category
     */
    addTask(taskName, completed) {

        // Create a new task
        let newTask = new Task(completed, taskName, `${this.name}${this.tasks.length}`)

        // add the task to self.tasks
        this.tasks.push(newTask)

        // // Get the category
        // let category = document.getElementById(this.id)
        
        // // Create new HTML Element
        // const helperMethods = new HelperMethods()
        // let element = helperMethods.createHTMLTask(taskName, `${this.name}${this.tasks.length - 1}`, false)

        // // Add element to the screen
        // category.appendChild(element)
    }

    /******
     * Removes a task in the current Category
     */
    removeTask(taskid) {
        console.log("Before deletion")
        console.table(this.tasks)
        for (let index in this.tasks) {
            if (this.tasks[index].id == taskid) {
                
                
                this.tasks.splice(index, 1)
            }
        }
        console.log("After")
        console.table(this.tasks)
    }
}