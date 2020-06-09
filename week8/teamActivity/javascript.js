var next = null
var previous = null

window.onload = function () {
    makeRequest("https://swapi.dev/api/people/").then(data => {
        console.log(data)

        displayPersons(data)
    })
}

document.getElementById("previousButton").addEventListener("click", () => {
    let display = document.getElementById("people")

    if (previous != null) {
        makeRequest(previous).then(data => {
            display.innerHTML = ""

            displayPersons(data)
        })
    }
})

document.getElementById("nextButton").addEventListener("click", () => {
    let display = document.getElementById("people")

    if (next != null) {
        makeRequest(next).then(data => {
            display.innerHTML = ""

            displayPersons(data)
        })
    }
})


function displayPersons(people) {
    let display = document.querySelector("#people")

    if (people.next != null) {
        let url = new URL(people.next)
        url.protocol = "https:"
        next = url.toString()
    }

    if (people.previous != null) {
        let purl = new URL(people.previous)
        purl.protocol = "https:"
        previous = purl.toString()
    }

        people.results.forEach(person => {

            let newPerson = document.createElement("div")
            newPerson.className = 'person'
            newPerson.id = person.url
            newPerson.innerHTML += `<div class="personName">${person.name}</div>`

            newPerson.addEventListener("click", () => showMoreDetails(newPerson))

            display.appendChild(newPerson)
        })
    }



    async function showMoreDetails(person) {
        let element = document.getElementById(person.id)
        console.log(element.children.length)
        if (element.children.length > 1) {
            let removeMe = document.getElementById(`details${person.id}`)
            removeMe.remove()

            return
        }


        let url = new URL(person.id)

        url.protocol = 'https:'

        makeRequest(url.toString()).then(details => {
            console.log(details)
            element.innerHTML += `<div id='details${person.id}' class='details'> 
            <div>height = ${details.height}</div>
            <div>mass = ${details.mass}</div>
            <div>hair color = ${details.hair_color}</div>
            <div>skin color = ${details.skin_color}</div>
            <div>eye color = ${details.eye_color}</div>
            <div>birth year = ${details.birth_year}</div>
            <div>gender = ${details.gender}</div>
            </div>
        `
        })
    }










    async function makeRequest(url) {
        let response = await fetch(url)
        let data = response.json()

        return data
    }