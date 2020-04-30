
getPerson(1)

// This is the header where things will be added
var header = document.querySelector('header')

// Add the note header to the page
let noteHeader = document.createElement('h1')
noteHeader.textContent = "Notes:"
header.appendChild(noteHeader)

// add the notes to the page.
let text = document.createElement('p')
text.textContent = "These are my notes for the week. More of a coding example which I was able to do after class. I learned a lot about using javascrip to manipulate the DOM this week and decided this would be a funway to actually demonstrate what I had learned."
header.appendChild(text)

/*******
 * getPerson
 * Calls the starwars api for a specific number/person and adds them to the section on the page.
 */
function getPerson(number) {
    document.querySelector('section').innerHTML = "";

    fetch(`https://swapi.py4e.com/api/people/${number}/`)
        .then(result => result.json())
        .then(response => {

            // section that we will be adding everything to
            let section = document.querySelector('section')

            var input = document.querySelector("#number")
            input.value = number

            // little bit of error handling
            if (response.name == null) {
                let errorMsg = document.createElement('h3')
                errorMsg.className = "error"
                errorMsg.textContent = "Error with input or something wrong with API... Not gonna stress error handling that much...."
                section.appendChild(errorMsg)

                return
            }

            // add the name
            let h3 = document.createElement('h3')
            h3.innerHTML = `<a href='${response.url}'>${response.name}</a>`
            section.appendChild(h3)

            // add some person info
            let p = document.createElement('p')
            p.textContent = `height: ${response.height},
                         mass: ${response.mass},
                         gender: ${response.gender}`
            section.appendChild(p)

            
        })
}