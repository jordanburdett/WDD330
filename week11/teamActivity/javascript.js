import { makeRequest } from "../teamActivity/authHelpers.js"
import { Auth } from "../teamActivity/auth.js"



let auth = new Auth()


gsap.from('#login', { scale: 0, duration: 3, rotate: 900, ease: "elastic" })
gsap.from('#button', { duration: 2, y: 1000, ease: "bounce" })
gsap.from('#username', { duration: 5, skewX: 45, opacity: 0, rotate: 360, ease: "bounce" })

document.getElementById("button").addEventListener("click", () => {
    console.log("BUTTON")

    let token = auth.login()
    console.log(token)
})