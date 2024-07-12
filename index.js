const res = await fetch("./items.json")
const itemsJSON = await res.json()

// Initialise with Event Format
document.getElementById("title").innerText = await itemsJSON[0].title;
document.getElementById("picture").src = await itemsJSON[0].picture;

var screenRotate = setInterval(rotate, 15000)

async function rotate() {
    let randSlide = Math.floor(Math.random() * (itemsJSON.length-1)) + 1

    document.getElementById("title").innerText = await itemsJSON[randSlide].title;
    document.getElementById("picture").src = await itemsJSON[randSlide].picture;
}