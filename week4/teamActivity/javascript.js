const board = document.querySelector("#board")
let cells = board.children
let turn = 'X'
let winner = false
let numTurns = 0

for (i = 0; i < cells.length; i++) {
    cells[i].addEventListener("touchend", buttonClicked)
    cells[i].addEventListener("click", buttonClicked)
}

function buttonClicked() {
    if (document.getElementById(this.id).textContent.length < 1 && winner == false) {

        document.getElementById(this.id).textContent = turn;
        numTurns += 1
        checkForWin(this.id)

        if (numTurns >= 9 && winner == false) {
            document.querySelector("h1").textContent = "You all lost....."
        } else {
            toggleTurn()
        }


    }
}

function toggleTurn() {
    if (turn == 'X') {
        turn = 'O'
    } else {
        turn = 'X'
    }
}

document.getElementById("reset").addEventListener("touchend", reset)
document.getElementById("reset").addEventListener("click", reset)

function reset() {
    for (i = 0; i < cells.length; i++) {
        cells[i].textContent = ""
    }
    turn = 'X'
    winner = false

    document.querySelector("h1").textContent = `Tic-Tac-Toe`
    numTurns = 0
}

function checkForWin(id) {
    let classList = document.getElementById(id).classList

    for (i = 0; i < classList.length; i++) {

        if (classList[i] == 'item') {
            continue;
        }

        let items = document.getElementsByClassName(classList[i])

        for (x = 0; x < items.length; x++) {
            if (items[x].textContent != turn) {
                break;
            }
            if (x == 2) {
                console.log(turn + " has won")

                document.querySelector("h1").textContent = `${turn} has won`

                winner = true

            }
        }
    }
}