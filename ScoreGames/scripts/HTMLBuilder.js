/***************
 * HTMLBuilder
 * This class is dedicated to building out HTML objects
 */
export class HTMLBuilder {

    constructor() {

    }

    createTextElement(content, id="", className="text") {
        // create the element
        let element = document.createElement("div")

        // add class
        element.className = className

        // add id
        element.id = id

        // add content
        element.textContent = content

        // return 
        return element
    }


}