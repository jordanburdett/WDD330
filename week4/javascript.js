

document.querySelector("header button").addEventListener("click", () => {

    const notes = document.querySelectorAll("main ul li")

    notes.forEach((note) => {
        note.classList.toggle("show")
    })
})
