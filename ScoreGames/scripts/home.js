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

// Workaround for gamees not loading
var newGame = false

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
    gsap.from(".gameContainer", {
        duration: 0.8,
        scale: 0.9,
        stagger: 0.1,
        skewX: 15,
        y: 510,
        x: 200,
        ease: "expo"
    })
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
        } else {
            hours = hours - 12
            timeString += ` ${hours}:`
        }

        timeString += `${date.getMinutes()}.${date.getSeconds()} PM`

    } else {
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
    } else {

        document.getElementById("addGameButton").hidden = true;
        games.forEach(game => {

            let trashCan = document.createElement("div")
            trashCan.classList.add("trashContainer")
            trashCan.id = game.id
            trashCan.innerHTML = '<i class="fas fa-trash"></i>'

            // What happens when the delete button is clicked.
            trashCan.addEventListener("click", (event) => {
                event.stopPropagation();
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
    let backButton = document.createElement("div")
    backButton.className = "backButton"
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>'

    document.querySelector("body").insertBefore(backButton, document.querySelector("body").firstChild)

    // Button for add game by code
    let addGameByCode = document.createElement("div")
    addGameByCode.className = "editButton smallButton"
    addGameByCode.id = "addGameByCodeButton"
    addGameByCode.textContent = "Add by Game Code"

    document.querySelector("main").insertBefore(addGameByCode, document.querySelector(".myGamesAndsettContainer"))

    /* What happens when the add by game code button is pressed */
    addGameByCode.addEventListener("click", () => {
        // remove everything
        form.className = "hidden"
        pageHeader.textContent = "Add by Code"
        addGameByCode.remove()

        // add everything!
        let display = document.querySelector("main")

        // Error display
        let errorText = document.createElement("div")
        errorText.className = "errorText"

        display.appendChild(errorText)

        // add Label
        let label = document.createElement("label")
        label.for = "inputCode"
        label.className = "gameCodeInputLabel"
        label.textContent = "Game Code: "

        display.appendChild(label)

        // add input
        let inputCode = document.createElement("input")
        inputCode.name = "inputCode"
        inputCode.id = "inputCode"

        display.appendChild(inputCode)

        // add add button
        let addGameButton = document.createElement("div")
        addGameButton.className = "editButton smallButton"
        addGameButton.id="addGameByCodeButton"
        addGameButton.textContent = "Add Game"

        display.appendChild(addGameButton)

        /* What happens when the add game button is pressed */
        addGameButton.addEventListener("click", () => {
            // add game to account and start playing

            database.ref("GameCodes/").orderByChild("code")
                .equalTo(inputCode.value)
                .on("value", snapshot => {
                    console.log(snapshot.val())

                    if (snapshot.val()) {
                        // Hey there is something here!
                        let data = snapshot.val()
                        let key = snapshot.node_.children_.root_.key
                        
                        getGameFromFirebase(key).then(game => {

                            // display the game
                            displayPlayGame(game)

                            // remove anything that needs removing!

                            // remove the back button
                            backButton.remove()

                            errorText.remove()
                            label.remove()
                            inputCode.remove()
                            addGameButton.remove()

                            // work around
                            newGame = true


                            // add the game id to user account
                            let userInfo = getUserInfo()

                            let addGame = {}
                             addGame[key] = true
                            database.ref(`Users/${userInfo.uid}/games`).update(addGame, () => {
                                console.log("game added to account")
                            })



                        })

                        
                    } else {
                        // Nothing here....
                        errorText.textContent = "Invalid Code..."
                    }
                })
        })
    })



    /********
     * What happens when the back button is clicked
     */
    backButton.addEventListener("click", () => {

        // fix some things
        pageHeader.textContent = "My Games"
        editButton.hidden = false
        addGameButton.hidden = false
        gamesContainer.hidden = false

        // remove add game by code button
        addGameByCode.remove()

        form.className = "hidden"

        // remove the back button
        backButton.remove()

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

    document.querySelector("#addGameByCodeButton").remove()

    /***************************
     * ERROR HANDLING
     */
    if (gameName.length < 1) {
        console.log("GameName is required")

        document.getElementById("gameNameInput").style.setProperty("border", "1px solid red")
        return
    } else {
        document.getElementById("gameNameInput").style.setProperty("border", "1px solid lightgreen")
    }

    if (document.getElementById("newTeamDisplay").children.length < 1) {
        console.log("At least 1 team is required")

        document.getElementById("newTeamInput").style.setProperty("border", "1px solid red")
        return
    } else {
        document.getElementById("newTeamInput").style.setProperty("border", "1px solid lightgreen")
    }




    /* End of error handling */

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
        history: []
    })

    let addGame = {}
    addGame[newPostKey] = true
    database.ref(`Users/${userInfo.uid}/games`).update(addGame, () => {


        // New Game workaround
        newGame = true

        document.querySelector(".backButton").remove()
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
 * This will accept a game and display it all ready to play.
 */
function displayPlayGame(game) {

    let myGamesHeader = document.querySelector(".myGames")
    let pageHeader = document.querySelector(".pageHeader")
    let editButton = document.getElementById("editButton")
    let addGameButton = document.getElementById("addGameButton")
    let gamesContainer = document.getElementById("game")
    let display = document.getElementById("playGame")
    let topBar = document.getElementById("topBar")

    ///////////
    // let themeToggle = document.querySelector(".themeToggle")
    // themeToggle.remove()
    ///////////

    // Hide Everything on the screen
    display.innerHTML = ""
    gamesContainer.innerHTML = ""

    editButton.hidden = true
    addGameButton.hidden = true
    pageHeader.hidden = true
    myGamesHeader.hidden = true
    topBar.innerHTML = ""

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

                console.log("length: " + teamScoreContainer.children.length)

                if (teamScoreContainer.children.length === 6) {
                    teamScoreContainer.lastChild.remove()
                    teamScoreContainer.lastChild.remove()
                }
                teamScoreContainer.lastChild.remove()

            } else {
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



                        } else {
                            input.setAttribute("data-showingButton", "true")
                            let addButton = document.createElement("div")
                            addButton.className = "addButton"
                            addButton.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>'

                            // What happens when add button is clicked
                            addButton.addEventListener("click", () => {

                                let teamsUpdate = createMap(game.teams)
                                teamsUpdate.set(key, Number(value) + Number(input.value))

                                console.log(Object.fromEntries(teamsUpdate))
                                let updates = {
                                    date: Date.now(),
                                    teams: Object.fromEntries(teamsUpdate)
                                }

                                database.ref("games/" + game.id).update(updates)

                            })

                            let subButton = document.createElement("div")
                            subButton.className = "subButton"
                            subButton.innerHTML = '<i class="fa fa-minus" aria-hidden="true"></i>'

                            // What happens when the subtract button is clicked
                            subButton.addEventListener("click", () => {
                                let teamsUpdate = createMap(game.teams)
                                teamsUpdate.set(key, Number(value) - Number(input.value))

                                console.log(Object.fromEntries(teamsUpdate))
                                let updates = {
                                    date: Date.now(),
                                    teams: Object.fromEntries(teamsUpdate)
                                }

                                database.ref("games/" + game.id).update(updates)
                            })


                            teamScoreContainer.appendChild(subButton)
                            teamScoreContainer.appendChild(addButton)
                        }

                    } else {
                        // Ensure that the add button is gone
                        if (input.getAttribute("data-showingButton") === "true") {
                            if (teamScoreContainer.children.length === 6) {
                                teamScoreContainer.lastChild.remove()
                                teamScoreContainer.lastChild.remove()
                            }

                            input.setAttribute("data-showingButton", "false")
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


    /*************************************************
     * TOP BAR
     */


    // add the backbutton
    let backButton = document.createElement("div")
    backButton.className = "backButton"
    backButton.id = "backButton"
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>'
    backButton.addEventListener("click", () => {

        // New Game workarounds
        if (newGame) {

            // refresh the page
            location.reload()
        }


        // fix some things
        display.innerHTML = ""
        editButton.hidden = false
        addGameButton.hidden = false
        pageHeader.hidden = false
        myGamesHeader.hidden = false

        // remove the back button
        backButton.innerHTML = ""

        // remove the top bar
        topBar.innerHTML = ""

        // remove the settings if its there
        document.getElementById("settingsContainer").innerHTML = ""

        // reload the games
        loadGames()
    })


    topBar.appendChild(backButton)

    // Text for top bar
    let headerText = document.createElement("div")
    headerText.classList.add("topBarHeaderText")
    headerText.id = "topBarHeaderText"
    headerText.textContent = "Score Games"

    // Add text to top bar
    topBar.appendChild(headerText)


    // settings icon
    let settingsButton = document.createElement("div")
    settingsButton.classList.add("settingsButton")
    settingsButton.id = "settingsButton"
    settingsButton.innerHTML = '<i class="fas fa-cog"></i>'

    settingsButton.addEventListener("click", () => {
        // get my settings
        let settingsContainer = document.getElementById("settingsContainer")

        // check if its already up, if so remove
        if (settingsContainer.innerHTML != "") {
            console.log("LEAVE ME TRANSITION")
            gsap.to('#settingsContainer', {
                duration: 0.5,
                x: "100%",
                onComplete: () => {
                    settingsContainer.innerHTML = ""
                    settingsContainer.style = ""

                }
            })

            return
        }
        settingsContainer.innerHTMl = ""
        settingsContainer.appendChild(createThemeToggle())

        // animate the settings in
        gsap.fromTo('#settingsContainer', {
            duration: 0.5,
            x: "100%"
        }, {
            x: "0%"
        })
    })

    // Add the settings to top bar
    topBar.appendChild(settingsButton)


    // Game code option for the bottom
    let gameCode = document.createElement("div")
    gameCode.id = "gameCode"


    // Last thing we want to check to see if the game has a gamecode
    database.ref('GameCodes/' + game.id).once("value").then(snapshot => {

        if (snapshot.val()) {

            let value = snapshot.val()
            console.log(value)

            console.log("code for this game")
            gameCode.className = "gameCode"

            gameCode.innerHTML = "Game code is &quot" + value.code + "&quot"


        } else {


            console.log("No code for this game.....")
            gameCode.textContent = "Add Game Code?"
            gameCode.className = "gameCode editButton gameCodeButton"

            gameCode.addEventListener("click", () => {
                // remove button
                display.lastChild.remove()

                // create an element explaining what the game code does
                let gameCodeExplain = document.createElement("p")
                gameCodeExplain.className = "gameCodeText"
                gameCodeExplain.textContent = "Adding a game code allows others to easily add this game."

                // add the element
                display.appendChild(gameCodeExplain)

                // create a field for errors to be displayed
                let gameCodeError = document.createElement("div")
                gameCodeError.className = "errorText"
                gameCodeError.id = "gameCodeError"

                // add the element
                display.appendChild(gameCodeError)

                // create label for input
                let gameCodeInputLabel = document.createElement("label")
                gameCodeInputLabel.for = "gameCodeInput"
                gameCodeInputLabel.className = "gameCodeInputLabel"
                gameCodeInputLabel.textContent = "Game Code:"

                // add label
                display.appendChild(gameCodeInputLabel)

                // create an input field to enter in the game code
                let gameCodeInput = document.createElement("input")
                gameCodeInput.className = "formTextInput"
                gameCodeInput.id = "gameCodeInput"
                gameCodeInput.name = "gameCodeInput"
                gameCodeInput.placeholder = "add game code here"

                // When the input changes lets see if its valid
                gameCodeInput.addEventListener("input", () => {
                    console.log(gameCodeInput.value)

                    database.ref("GameCodes/").orderByChild("code")
                        .equalTo(gameCodeInput.value)
                        .on("value", snapshot => {
                            console.log(snapshot.val())

                            if (snapshot.val()) {
                                // sorry taken
                                gameCodeError.textContent = "Code Unavailable"
                                gameCodeInput.style.setProperty("border", "solid red 2px")
                            } else {
                                // Good to go
                                gameCodeError.textContent = ""
                                gameCodeInput.style.setProperty("border", "solid green 2px")
                            }
                        })
                })

                // add the game code input
                display.appendChild(gameCodeInput)

                // create a save button with event listener to add the game code
                let gameCodeSaveButton = document.createElement("div")
                gameCodeSaveButton.className = "editButton gameCodeButton gameCodeSaveButton"
                gameCodeSaveButton.textContent = "Add Code"
                gameCodeSaveButton.addEventListener("click", () => {
                    // check that the code hasn't been taken
                    database.ref("GameCodes/").orderByChild("code")
                        .equalTo(gameCodeInput.value)
                        .on("value", snapshot => {
                            console.log(snapshot.val())

                            if (snapshot.val()) {
                                // sorry taken

                                gameCodeError.textContent = "Code Unavailable"
                                gameCodeInput.style.setProperty("border", "solid red 3px")
                                return
                            } else {
                                // Good to go
                                gameCodeInput.style.setProperty("border", "solid green 2px")
                                // add gamecode to the database
                                database.ref('GameCodes/' + game.id).set({
                                    code: gameCodeInput.value
                                })

                                // reload game calling displayPlayGame(game)
                                displayPlayGame(game)
                            }
                        })


                })

                // add game code save button
                display.appendChild(gameCodeSaveButton)
            })
        }



        display.appendChild(gameCode)
    })

}


function createThemeToggle() {



    let toggle = document.createElement("div")
    toggle.className = "themeToggle"
    toggle.dataset.theme = "light"

    // toggle.innerHTML = `
    // <label class="switch">
    //     <input type="checkbox" id="themeToggle" data-theme="light">
    //     <span class="slider round"></span>
    // </label>
    // <label class="themeToggleLabel">Dark Mode</label>
    // `

    // Add the first label
    let label = document.createElement("label")
    label.className = "switch"

    toggle.appendChild(label)

    // checkBox
    let checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.id = "themeToggle"

    if (getComputedStyle(document.documentElement).getPropertyValue('--dark-bg-color') === getComputedStyle(document.documentElement).getPropertyValue('--bg-color')) {
        toggle.dataset.theme = "dark"
        checkBox.checked = true
    }

    label.appendChild(checkBox)

    // Span
    let span = document.createElement("span")
    span.classList.add("slider", "round")

    label.appendChild(span)

    // darkMode label
    let darkModeLabel = document.createElement("label")
    darkModeLabel.classList.add("themeToggleLabel")
    darkModeLabel.textContent = "Dark Mode"

    toggle.appendChild(darkModeLabel)

    checkBox.addEventListener("click", () => {

        console.log("IN THEME TOGGLE")
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

    return toggle
}