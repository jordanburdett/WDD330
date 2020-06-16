
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
            console.table(games)

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

    display.innerHTML = ""

    games.forEach(game => {
        displayGame(game)
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

    })

    let date = new Date(game.date)

    let hours = date.getHours()
    let timeString = ""

    // Change my time stamp to understandable numbers.
    if (hours >= 12) {
        // PM

        // check for 12
        if (hours == 12) {
            timeString += `${hours}:`
        }
        else {
            hours = hours - 12
            timeString += `${hours}:`
        }

        timeString += `${date.getMinutes()}.${date.getSeconds()} PM`

    }
    else {
        // AM

        timeString += `${date.getHours()}:${date.getMinutes()}.${date.getSeconds()} AM`
    }


    console.log(date)
    gameDiv.innerHTML += `<div class='nameDateContainer'>
         <div class='gameName'>${game.name}</div>
         <div class='gameDate'>${timeString}</div>
         </div>`

    let teamContainer = document.createElement("div")
    teamContainer.classList.add("teamContainer")

    for (index in game.teams) {
        if (index < 4) {
            let team = document.createElement("div")
            team.id = game.teams[index]
            team.classList.add("team")

            team.innerHTML = `
            ${game.teams[index]}: ${game.scores[index]}
        `
            team.classList.add("team")

            teamContainer.appendChild(team)
        }
    }

    gameDiv.appendChild(teamContainer)
    display.appendChild(gameDiv)
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

    // HIde Games
    gamesContainer.hidden = true

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

    teams = []
    scores = []
    teamsHTML.forEach(team => {
        teams.push(team.textContent)
        scores.push(0)
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
        scores: scores
    })

    let addGame = {}
    addGame[newPostKey] = true
    database.ref(`Users/${userInfo.uid}/games`).update(addGame)

    /********************
     * *****************
     * *****************
     * NEXT WE NEED TO CREATE A FUNCTION TO DISPLAY THE CURRENT GAME. 
     * THAT FUNCTION NEEDS TO BE CALLED RIGHT HERE.
     *  PASSING IN THE NEW ID THAT WAS JUST CREATED ON FIREBASE
     */
})

/**********
 * This will attach a event listener to a button to test database inserts
 */
// document.querySelector("main button").addEventListener("click", () => {
//     var newPostKey = firebase.database().ref().child('games').push().key;

//     console.log(newPostKey)
//     database.ref('games/' + newPostKey).set({
//         id: newPostKey,
//         name: "Jordan's game",
//         teams: ["Team1", "Team2"],
//         scores: [500, 200],
//         date: Date.now(),
//         history: [[0, 200], [1, 500]]
//     })
// })

// EXAMPLE OF HOW TO UPDATE DATA IN FIREBASE
// function update() {
//     let nameField = document.querySelector("div input")
//     let name = nameField.value

//     let updates = {
//         name: name
//     }
//     database.ref("games/-M9dN_bbestYpAsWl7e7").update(updates)

//     nameField.value = ""
//     return
// }

// EXAMPLE OF HOW TO ATTACH A LISTENER TO FIREBASE DATA
// var gameRef = database.ref('games/-M9dN_bbestYpAsWl7e7')
// gameRef.on('value', (snapshot) => {

//     if (snapshot.val() == null) {
//         return
//     }

//     displayGame(snapshot.val())
// })