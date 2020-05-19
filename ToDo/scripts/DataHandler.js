import { Category } from './Category.js'

export class DataHandler {
    categories = new Array()

    constructor() {
        // attempt to load data



        // For now we are going to add a category
        let category = new Category("School", this.categories.length)
        this.categories.push(category)
        console.log(`New category School created`)
    }

    addCategory(categoryName) {
        let category = new Category(categoryName, this.categories.length)
        this.categories.push(category)
        console.log(`New category ${categoryName} created`)
    }

    addTask(taskName, categoryName) {
        this.categories.forEach((category) => {
            if (category.name === categoryName) {
                category.addTask(taskName)
            }
        })
    }

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
}