const res = await fetch("./items.json")
const itemsJSON = await res.json()

const TIMER = 17

// Initialise with Event Format
document.getElementById("title").innerText = await itemsJSON[0].title;
document.getElementById("picture").src = await itemsJSON[0].picture;

var screenRotate = setInterval(rotate, 15080)

let prev = 0
async function rotate() {
    let randSlide = Math.floor(Math.random() * (itemsJSON.length-1)) + 1
    if (prev == randSlide) randSlide = randSlide + 1;

    prev = randSlide

    document.getElementById("title").innerText = await itemsJSON[randSlide].title;
    document.getElementById("picture").src = await itemsJSON[randSlide].picture;
}

var time = TIMER;
var countdown = setInterval(minusTime, 1000)
var countdownSound = document.getElementById("sound");

function minusTime() {
    if (time > 0) time--;

    if (time <= 15 && time > 0) {
        countdownSound.load()
        countdownSound.play()
    }

    document.getElementById("countdown").innerText = new Date(time * 1000).toISOString().substring(15, 19);
}