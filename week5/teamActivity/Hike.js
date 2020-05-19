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

    constructor(name, imgSrc, imgAlt, distance, difficulty, description, directions) {
        this.name = name
        this.imgSrc = imgSrc
        this.imgAlt = imgAlt
        this.distance = distance
        this.difficulty = difficulty
        this.description = description
        this.directions = directions
        
        this.showingDetails = false
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

       
        return details
    }

}