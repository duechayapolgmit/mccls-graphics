const res = await fetch("./items.json")
const itemsJSON = await res.json()

const TIMER = 181

// Query Handling
const searchParams = new URLSearchParams(window.location.search);

// QH - Get time
var time = searchParams.get('time');
if (time == null) time = 60; // default is 60

// Initialise with Event Format
document.getElementById("title").innerText = await itemsJSON[0].title;
document.getElementById("picture").src = await itemsJSON[0].picture;

var screenRotate = setInterval(rotate, 15080)

let prev = 0
async function rotate() {
    changeOpacity(0)

    let randSlide = Math.floor(Math.random() * (itemsJSON.length-1)) + 1
    if (prev == randSlide) randSlide = randSlide + 1;

    prev = randSlide

    document.getElementById("title").innerText = await itemsJSON[randSlide].title;
    document.getElementById("picture").src = await itemsJSON[randSlide].picture;
    
    changeOpacity(1)
}

function changeOpacity(percent) {
    document.getElementById("top-bar").style.opacity = percent
    document.getElementById("middle-content").style.opacity = percent
}

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