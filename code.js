let file = await fetch("/text.json")
let content = await file.json()

let language = "english"

const idArray = ["ravenPoem"]


document.getElementById("ravenPoem").innerHTML = content[language]["ravenPoem"].join("")
