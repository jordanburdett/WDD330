document.addEventListener('keydown', function (e) {
    console.log(e.which)

    let audioHTML = document.querySelectorAll("audio")

    audioHTML.forEach(element => {

        if(element.getAttribute("data-key") == e.which) {
            element.load()
            element.play()

            let keys = document.querySelectorAll(".key")

            keys.forEach(key => {
                if(key.getAttribute("data-key") == e.which) {
                    key.classList.add("playing")

                    let offset = (Number(key.getAttribute("data-offset")) + 10) % 100
                    key.style.transform = `translateY(${offset}px) rotate(360deg)`
                    key.setAttribute("data-offset", `${offset}`) 
                    console.log("offset: " + key.getAttribute("data-offset"))
                }
            })

            element.onended = function () {
                keys.forEach(key => {
                    if(key.getAttribute("data-key") == e.which) {
                        key.classList.remove("playing")
                    }
                })
            }
        }
    })
})