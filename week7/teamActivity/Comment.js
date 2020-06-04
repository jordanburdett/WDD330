export class Comment {
    name = ""
    date = new Date()
    content = ""
    hikeId = 0
    type = ""


    constructor(name, date, content, hikeId, type = "hike") {
        this.name = name
        this.date = date
        this.content = content
        this.hikeId = hikeId
        this.type = type
    }

}