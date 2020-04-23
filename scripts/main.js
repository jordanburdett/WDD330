/* Ways to write functions in Javascript */
/* function decleration */
// function toggleMenu() {

// }

// /* function expression */
// const toggle = function() {

// }

/* arrow syntax */
const toggleMenu = () => {
    document.querySelector('#navigation').classList.toggle('show')
}

document.querySelector('#menu').addEventListener('click', toggleMenu);