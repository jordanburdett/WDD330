console.log("WORK")
import { DataHandler } from './DataHandler.js'

let dataHandler = new DataHandler()
console.log("hello")

dataHandler.addCategory("Personal")
dataHandler.addTask("Homework", "School")
dataHandler.addTask("clean kitchen", "Personal")


dataHandler.removeTask("Personal0")

dataHandler.addTask("clean", "Personal")
dataHandler.addTask("Drive Home", "Personal")
dataHandler.addTask("clean", "Personal")
dataHandler.addTask("Drive Home", "Personal")
dataHandler.addTask("clean", "Personal")
dataHandler.addTask("Drive Home", "Personal")
dataHandler.addTask("clean", "Personal")
dataHandler.addTask("Drive Home", "Personal")
dataHandler.addTask("clean", "Personal")
dataHandler.addTask("Drive Home", "Personal")
dataHandler.addTask("clean", "Personal")
dataHandler.addTask("Drive Home", "Personal")

dataHandler.removeTask("Personal9")