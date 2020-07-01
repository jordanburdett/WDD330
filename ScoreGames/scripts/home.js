var firebaseConfig = {
    apiKey: "AIzaSyB2aJwBVVsCSVzX_MnSHAbO5gXgn59CeXs",
    authDomain: "scoregames-c0233.firebaseapp.com",
    databaseURL: "https://scoregames-c0233.firebaseio.com",
    projectId: "scoregames-c0233",
    storageBucket: "scoregames-c0233.appspot.com",
    messagingSenderId: "475132375224",
    appId: "1:475132375224:web:206d8be3fc01e8faa6044d",
    measurementId: "G-RQT21T265Y"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database()
var auth = firebase.auth()

// References to database... Active watches basically.
var references = []

/***************
 * This function will make sure I am logged in and then update some settings
 * and start to load the games from firebase
 */
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("WE ARE LOGGED IN OHHHHH YAAAAA")
        let userInfo = getUserInfo()

        // Ensure all my google account settings are updated
        database.ref('Users/' + userInfo.uid).update({
            name: userInfo.name,
            email: userInfo.email,
            emailVerified: userInfo.emailVerified,
            uid: userInfo.uid,
            imageUrl: userInfo.photoUrl
        })


        loadGames()
    } else {
        // User is signed out.
        // ...

        console.log("we got some issues boi.... back to login!")
        window.location.href = "/ScoreGames/"
    }
});

/***************************
 * Event listener for dark mode toggle
 */
document.getElementById("themeToggle").addEventListener("click", () => {
    console.log("IN DARK MODE TOGGLE")
    let toggle = document.getElementById("themeToggle")
    let currentTheme = toggle.dataset.theme

    let styles = new Map()

    if (currentTheme === "light") {
        toggle.dataset.theme = "dark"

        styles.set('--bg-color',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dark-bg-color'))

        styles.set('--text-color',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dark-text-color'))

        styles.set('--button-colors',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dark-button-colors'))

        styles.set('--crown-color',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dark-crown-color'))

        styles.set('--card-background',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--dark-card-background'))
    }

    if (currentTheme === "dark") {
        toggle.dataset.theme = "light"
        styles.set('--bg-color',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--light-bg-color'))

        styles.set('--text-color',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--light-text-color'))

        styles.set('--button-colors',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--light-button-colors'))

        styles.set('--crown-color',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--light-crown-color'))

        styles.set('--card-background',
            getComputedStyle(document.documentElement)
                .getPropertyValue('--light-card-background'))
    }

    let root = document.documentElement

    styles.forEach((value, key) => {
        root.style.setProperty(key, value)
    })
})

/***************************
 * This just grabs the user and formats the information to
 * make it easier to use
 */
function getUserInfo() {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        let userInfo = {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            emailVerified: user.emailVerified,
            uid: user.uid
        }

        return userInfo
    }

    return null
}

/************************
 * loadGames()
 * This is first going to get user information and 
 * will then load the games that the user created or has on his account
 */
function loadGames() {
    let userInfo = getUserInfo()

    // get a list of games from the user profile if no games return
    database.ref(`Users/${userInfo.uid}/games`).once('value').then(async (snapshot) => {
        if (snapshot) {


            let games = []
            let keys = []
            // get the games from firebase
            snapshot.forEach((id) => {
                keys.push(id.key)
            })

            for (key in keys) {
                let game = await getGameFromFirebase(keys[key])
                games.push(game)
            }

            //Display all the games
            displayGames(games)
        }
        /// WE HAVE NO GAMES TODO DISPLAY CREATE NEW GAME DIALOG OR ENTER GAME CODE
        return
    })
    // get game name and the game date 

    // display the list of games
}

/*******************
 * getGameFromFirebase
 * this will query a game from firebase
 * OHHH BABBBY good ole async and await at its finest
 */
async function getGameFromFirebase(gameId) {
    let snapshot = await database.ref("games/" + gameId).once("value")
    let game = snapshot.val()
    game.id = snapshot.key
    return game
}


/*********************
 * This will display an array of games
 */
function displayGames(games) {
    let display = document.querySelector("#game")

    display.innerHTML = "<div class='loading'>loading</div>"

    games.forEach(game => {
        console.log(game + "   HERE")
        displayGame(game)
    })
    display.firstChild.remove()
    gsap.from(".gameContainer", {duration: 0.5, scale: 0.9, stagger: 0.1, y: 600, ease: "expo", delay: 0.1})
}

/********************
 * This will display a single game
 */
function displayGame(game) {
    let display = document.querySelector("#game")
    let gameDiv = document.createElement("div")
    gameDiv.id = game.id
    gameDiv.classList.add("gameContainer")

    /*************************
     * What happens when a game is clicked??? This happens!:)
     */
    gameDiv.addEventListener("click", () => {
        playGame(game.id)
    })

    let date = new Date(game.date)

    let hours = date.getHours()
    let timeString = date.toDateString()

    // Change my time stamp to understandable numbers.
    if (hours >= 12) {
        // PM

        // check for 12
        if (hours == 12) {
            timeString += ` ${hours}:`
        }
        else {
            hours = hours - 12
            timeString += ` ${hours}:`
        }

        timeString += `${date.getMinutes()}.${date.getSeconds()} PM`

    }
    else {
        // AM

        timeString += ` ${date.getHours()}:${date.getMinutes()}.${date.getSeconds()} AM`
    }

    gameDiv.innerHTML +=
        `<div class='nameDateContainer'>
         <div class='gameName'>${game.name}</div>
     </div>`

    // Holds all the teams
    let teamContainer = document.createElement("div")
    teamContainer.classList.add("teamContainer")

    // Current winner
    let winner = document.createElement("div")
    winner.classList.add("team")
    winner.innerHTML = '<i class="fas fa-crown"></i>' + findWinner(createMap(game.teams))

    teamContainer.appendChild(winner)

    gameDiv.appendChild(teamContainer)
    gameDiv.innerHTML += `<div class='gameDate'>${timeString}</div>`

    display.appendChild(gameDiv)
}

/***********
 * Takes a map of teams and returns a the 
 * name of the team as a string of the highest score
 */
function findWinner(teams) {
    let score = 0
    let winnerName = "Winner"
    teams.forEach((value, key) => {
        console.log(value)
        console.log(key)

        if (value > score) {
            winnerName = key
            score = value
        }
    })

    return winnerName
}

/*********
 * Turns a object into a map
 */
function createMap(obj) { 
    let map = new Map() 
    Object.keys(obj).forEach(key => { 
        map.set(key, obj[key]) 
    })
    return map
} 

/**************************
 * Event listener for edit button
 */
document.getElementById("editButton").addEventListener("click", () => {
    // get the elements
    let games = document.querySelectorAll(".gameContainer")

    // Check if we have already added trash cans
    if (document.getElementsByClassName("trashContainer").length) {
        // remove the trashCan
        games.forEach(game => {
            game.removeChild(game.lastChild)
        })

        // display the add new game again.
        document.getElementById("addGameButton").hidden = false;
    }
    else {

        document.getElementById("addGameButton").hidden = true;
        games.forEach(game => {

            let trashCan = document.createElement("div")
            trashCan.classList.add("trashContainer")
            trashCan.id = game.id
            trashCan.innerHTML = '<i class="fas fa-trash"></i>'

            // What happens when the delete button is clicked.
            trashCan.addEventListener("click", () => {

                let gameId = game.id
                let userInfo = getUserInfo()

                let updates = {}
                updates[gameId] = null

                // delete from database
                database.ref(`Users/${userInfo.uid}/games`).update(updates)
                game.remove()
            })

            game.appendChild(trashCan)



        })
    }
})

/**************************
 * Event listener for Add New Game
 */
document.getElementById("addGameButton").addEventListener("click", () => {
    // Elements I'll need
    let pageHeader = document.querySelector(".myGames")
    let editButton = document.getElementById("editButton")
    let addGameButton = document.getElementById("addGameButton")
    let gamesContainer = document.getElementById("game")
    let form = document.getElementById("newGameForm")

    // change My Games to New Game:
    pageHeader.textContent = "New Game:"

    // Hide DeleteGames button
    editButton.hidden = true

    // Hide Add new Button
    addGameButton.hidden = true

    // Hide Games
    gamesContainer.hidden = true

    // back button
    let backButton = document.getElementById("backButton")
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>'
    backButton.addEventListener("click", () => {

        // fix some things
        pageHeader.textContent = "My Games"
        editButton.hidden = false
        addGameButton.hidden = false
        gamesContainer.hidden = false

        form.className = "hidden"

        // remove the back button
        backButton.innerHTML = ""

        // reload the games
        loadGames()
    })

    // show form for creating new Game
    form.classList.toggle("newGame")
    form.classList.toggle("hidden")
})


/**************************
 * Event listener for adding a new team
 */
document.getElementById("addTeamButton").addEventListener("click", () => {
    let inputField = document.getElementById("newTeamInput")
    let teamDisplay = document.getElementById("newTeamDisplay")


    let team = document.createElement("div")
    team.className = "teamNameDelContainer"
    team.innerHTML += `
        <div class='teamDisplayForm'>${inputField.value}</div>
    `

    let trashCan = document.createElement("div")
    trashCan.classList.add("teamTrashContainer")
    trashCan.id = team.id
    trashCan.innerHTML = '<i class="fas fa-trash"></i>'

    // What happens when the delete button is clicked.
    trashCan.addEventListener("click", () => {
        team.remove()
    })

    team.appendChild(trashCan)

    inputField.value = ""

    teamDisplay.appendChild(team)
})

/*****************************
 * Event listener for adding the new game
 */
document.getElementById("addNewGameFormButton").addEventListener("click", () => {
    let teamsHTML = document.querySelectorAll(".teamDisplayForm")
    let gameName = document.getElementById("gameNameInput").value
    let date = Date.now()
    let userInfo = getUserInfo()

    teams = {}
    teamsHTML.forEach(team => {
        teams[team.textContent] = 0
    })

    console.log(teams)

    // add To Database
    let newPostKey = firebase.database().ref().child('games').push().key
    database.ref('games/' + newPostKey).set({
        id: newPostKey,
        name: gameName,
        teams: teams,
        date: date,
        history: [],
    })

    let addGame = {}
    addGame[newPostKey] = true
    database.ref(`Users/${userInfo.uid}/games`).update(addGame, () => {
        playGame(newPostKey)

        let form = document.getElementById("newGameForm")
        form.classList.toggle("hidden")
        form.classList.toggle("newGame")
    })


})

/*****************************
 * playGame()
 * This will query the information and set the call back to displayPlayGame
 */
function playGame(gameId) {
    var gameRef = database.ref('games/' + gameId)
    references.push(gameRef)

    gameRef.on('value', game => {
        if (game.val() == null) {
            return
        }

        displayPlayGame(game.val())
    })
}

/******************************
 * displayPlayGame(game)
 * This will accept a game and display it.
 */
function displayPlayGame(game) {
    let pageHeader = document.querySelector(".myGames")
    let editButton = document.getElementById("editButton")
    let addGameButton = document.getElementById("addGameButton")
    let gamesContainer = document.getElementById("game")
    let display = document.getElementById("playGame")

    // Hide Everything on the screen
    display.innerHTML = ""
    gamesContainer.innerHTML = ""

    editButton.hidden = true
    addGameButton.hidden = true
    pageHeader.hidden = true

    // Grid Container
    let container = document.createElement("div")
    container.id = game.id
    container.className = "gridContainer"

    // Game name
    let gameName = document.createElement("div")
    gameName.id = "gridGameName"
    gameName.className = "gridGameName"

    gameName.textContent = game.name

    // Teams Container
    let teamContainer = document.createElement("div")
    teamContainer.id = "gridTeamsContainer"
    teamContainer.className = "gridTeamsContainer"

    let teams = createMap(game.teams)
    // Create the Teams in the container
    teams.forEach((value, key) => {

        // Container for each team
        let teamScoreContainer = document.createElement("div")
        teamScoreContainer.id = key
        teamScoreContainer.className = "gridTeamScoreContainer"

        // name of the team
        let newTeamName = document.createElement("div")
        newTeamName.className = "gridTeam"
        newTeamName.textContent = key

        // score for the team
        let score = document.createElement("div")
        score.className = "gridScore"

        score.textContent = value

        // manipulating Team buttons
        let expand = document.createElement("div")
        expand.className = "expandCardButton"
        expand.innerHTML = '<i class="fas fa-chevron-down"></i>'

        /**** Event listener for expanding a team */
        expand.addEventListener("click", () => {
            expand.classList.toggle("spin90")

            if (expand.getAttribute("data-expanded") === "true") {
                // remove everything
                expand.setAttribute("data-expanded", "false")
                teamScoreContainer.lastChild.remove()
            }
            else {
                expand.setAttribute("data-expanded", "true")
                // Add input
                let input = document.createElement("input")
                input.className = "teamInputScore"
                input.type = "number"
                input.pattern = "[0-9]*"
                input.placeholder = "0"
                

                /******* Event listener for check for changes in input field */
                input.addEventListener("input", () => {
                    if (input.value) {
                        // Ensure that the add button shows
                        if (input.getAttribute("data-showingButton") === "true") {

                        }
                        else {
                            input.setAttribute("data-showingButton", "true")
                            let saveButton = document.createElement("div")
                            saveButton.className = "editButton"
                            saveButton.textContent = "Save"

                            // What happens when the changes are saved
                            saveButton.addEventListener("click", () => {

                                let teamsUpdate = createMap(game.teams)
                                teamsUpdate.set(key, Number(value) + Number(input.value))

                                console.log(Object.fromEntries(teamsUpdate))
                                let updates = {
                                    date: Date.now(),
                                    teams: Object.fromEntries(teamsUpdate)
                                }

                                database.ref("games/" + game.id).update(updates)

                                /******************************** 
                                 * NEXT WE NEED TO CHANGE ADD GAME TO ADAPT TO THE NEW JSON STRUCTURE!:)
                                 */
                            })

                            teamScoreContainer.appendChild(saveButton)
                        }

                    }
                    else {
                        // Ensure that the add button is gone
                        if (input.getAttribute("data-showingButton") === "true") {
                            teamScoreContainer.lastChild.remove()
                        }

                    }
                })

                teamScoreContainer.appendChild(input)

                input.focus()
                // Add buttons text input for putting in the correct amount of points
            }

        })

        // put it all together
        teamScoreContainer.appendChild(newTeamName)
        teamScoreContainer.appendChild(score)
        teamScoreContainer.appendChild(expand)
        teamContainer.appendChild(teamScoreContainer)
    })

    // History Container
    let historyContainer = document.createElement("div")
    historyContainer.id = "gridHistoryContainer"
    historyContainer.className = "gridHistoryContainer"

    // Put them all together
    container.appendChild(gameName)
    container.appendChild(teamContainer)
    container.appendChild(historyContainer)
    display.appendChild(container)


    // add the backbutton
    let backButton = document.getElementById("backButton")
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>'
    backButton.addEventListener("click", () => {

        // fix some things
        display.innerHTML = ""
        editButton.hidden = false
        addGameButton.hidden = false
        pageHeader.hidden = false

        // remove the back button
        backButton.innerHTML = ""

        // reload the games
        loadGames()
    })
}