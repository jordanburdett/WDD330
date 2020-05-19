export class Task {
    completed = false
    name = ""
    id = ""

    constructor(completed, name, id) {
        this.completed = completed
        this.name = name
        this.id = id
    }

    displayTask() {
        console.log(`Task: ${this.completed}, Name: ${this.name} id: ${this.id}`)
    }
}