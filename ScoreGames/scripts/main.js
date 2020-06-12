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

var gameRef = database.ref('games/-M9dN_bbestYpAsWl7e7')
gameRef.on('value', (snapshot) => {

    if (snapshot.val() == null) {
        return
    }

    displayGame(snapshot.val())
})

function displayGame(game) {
    let display = document.querySelector("#game")
    display.innerHTML = ""

    display.innerHTML = `
         <h6>${game.name}</h6>
         <p>${game.date}</p>
         <p>${game.id}</p>
      `

    for (index in game.teams) {
        console.log("in for loop")
        let team = document.createElement("div")
        team.id = game.teams[index]

        team.innerHTML = `
        <div class='teamHeader'>
        ${game.teams[index]}
        </div>
        <div class='teamScore'>
        ${game.scores[index]}
        </div>
        `

        team.class = "team"

        display.appendChild(team)
    }
}

document.querySelector("main button").addEventListener("click", () => {
    var newPostKey = firebase.database().ref().child('games').push().key;

    console.log(newPostKey)
    database.ref('games/' + newPostKey).set({
        id: 1,
        name: "Jordan's game",
        teams: ["Team1", "Team2"],
        scores: [500, 200],
        date: Date.now()
    })
})

function update() {
    let nameField = document.querySelector("div input")
    let name = nameField.value

    let updates = {
        name: name
    }
    database.ref("games/").update(updates)

    nameField.value = ""
    return
}