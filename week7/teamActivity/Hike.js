import { Comment } from './Comment.js'

export class Hike {
    name = ""
    imgSrc = ""
    imgAlt = ""
    distance = ""
    difficulty = ""
    description = ""
    directions = ""
    imgBasePath = "//byui-cit.github.io/cit261/examples/"
    showingDetails = false
    id = 0
    commentsList = []

    constructor(name, imgSrc, imgAlt, distance, difficulty, description, directions, id) {
        this.name = name
        this.imgSrc = imgSrc
        this.imgAlt = imgAlt
        this.distance = distance
        this.difficulty = difficulty
        this.description = description
        this.directions = directions
        
        this.showingDetails = false
        this.id = id
    }

    renderHike() {
        const item = document.createElement("div");

        item.innerHTML = ` <div class="hike">
                <h2 class="hikeName">${this.name}</h2>
                <div class="hikeImage"><img src="${this.imgBasePath}${this.imgSrc}" alt="${this.imgAlt}"></div>
                <div class="hikeContent">
                    <div>
                        <h3>Distance</h3>
                        <p>${this.distance}</p>
                    </div>
                    <div>
                        <h3>Difficulty</h3>
                        <p>${this.difficulty}</p>
                    </div>
                </div>
            </div>`;

        return item;
    }

    renderDetailedHike() {
        const details = document.createElement("div")

        details.classList.add("hikeMoreInfo")

        details.innerHTML = `<h2>${this.name}</h2>
        <h6>Description</h6>
        <p>${this.description}</p>
        <h6>Directions</h6>
        <p>${this.directions}</p>`

        let addNewComment = document.createElement("div")
        addNewComment.id = `comments${this.id}`
        
        let input = document.createElement("input")
        input.type = "text"
        input.textContent = "Comment"

        addNewComment.appendChild(input)

        
        let button = document.createElement("button")
        button.type = "submit"
        button.textContent = "Submit"
        button.addEventListener("click", () => {
            this.addComment("Local User", input.value)

            let newComment = document.createElement("div")
            newComment.class = "comments"
            newComment.innerHTML = `
            <h6>Local User</h6>
            <p>${input.value}</p>
            `
            
            addNewComment.appendChild(newComment)
        })

        addNewComment.appendChild(button)

        details.appendChild(addNewComment)
        
        let comments = document.createElement("div")
        comments.id = "comments"
        comments.class = "comments"

        // if (this.getAllComments() == null) {
        //     return details
        // }
        
        this.commentsList.forEach(comment => {
            let newComment = document.createElement("div")
            newComment.class = "comments"
            newComment.innerHTML = `
            <h6>${comment.name}</h6>
            <p>${comment.content}</p>
            `
            comments.appendChild(newComment)
        })

        details.appendChild(comments)
       
        return details
    }

    // returns an array of Comment objects from localStorage
    getAllComments() {
        let jsonComments = JSON.parse(localStorage.getItem('comments'))

        if (jsonComments == null) {
            return []
        }

        jsonComments.forEach(jsonComment => {
            let comment = new Comment()
            Object.assign(comment, jsonComment)
            this.commentsList.push(comment)
        })

        this.commentsList = this.commentsList.filter((comment) => {
            return comment.hikeId = this.id
        })
    }


    filterCommentsByName(name) {
        let commentsByName = commentsList.filter((comment) => {
            return comment.name = name
        })
        return commentsByName
    }

    addComment(name, content, type = "hike") {
        const newComment = new Comment(name, Date.now(), content, Date.now(), type)
        this.commentsList.push(newComment)
        console.log(this.commentsList)

        //add the comment to local storage array
        let allComments = new Array()
        let jsonComments = JSON.parse(localStorage.getItem('comments'))
            if (jsonComments != null) {
                jsonComments.forEach(jsonComment => {
                let comment = new Comment()
                Object.assign(comment, jsonComment)
                allComments.push(comment)
            })
        }        
        allComments.push(newComment)
        localStorage.setItem('comments', JSON.stringify(allComments))

    }   

    showCommentsList() {
        console.log('showCommentsList')
        console.table(this.commentsList)
    }

}