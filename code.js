//import textData from "/text.json";

let file = await fetch("/text.json")
let content = await file.json()
console.log(content)
let language = "english"

document.getElementById("ravenPoem").innerHTML = content[language]["ravenPoem"].join("\n")