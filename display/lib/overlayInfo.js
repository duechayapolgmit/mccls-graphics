import multipliers from '@/data/game_multipliers.json';
import gameLogos from '@/data/game_logos.json';
import teamLabels from '@/data/team_labels.json';

let data = {
    gameNumber: 1,
    multiplier: "x1.0",
    game: "DEFAULT",
    gameLogo: "/game_logos/Default.png",
    first: "",
    firstLabel: "/team_labels/Blank.png",
    firstDB: -1,
    second: "",
    secondLabel: "/team_labels/Blank.png",
    secondDB: -1,
    statusVisible: true,
    placementsVisible: true
}

export function getOverlayData() {
    return data
}

/* Controls Game Numbers */
export function getGameNumber() {
    return data.gameNumber;
}

export function setGameNumber(gameNo) {
    data.gameNumber = gameNo

    // Check the multiplier associated and attach the multiplier with that (default x1.0)
    data.multiplier = multipliers[data.gameNumber] || "x1.0";
}

/* Controls Game Logos */
export function getGame() {
    return data.game;
}

export function setGame(game) {
    data.game = game

    // Check the game logo associated
    data.gameLogo = gameLogos[data.game] || "/game_logos/Default.png";
}

/* Controls Standings */
export function getFirstPlace() {
    return data.first
}

export function getSecondPlace() {
    return data.second
}

export function setFirstPlace(team) {
    data.first = team;

    // Check the label
    data.firstLabel = teamLabels[data.first] || "/team_labels/Blank.png";
}

export function setSecondPlace(team) {
    data.second = team;

    // Check the label
    data.secondLabel = teamLabels[data.second] || "/team_labels/Blank.png";
}

/* Controls DB score */
export function getFirstDBPoints() {
    return data.firstDB;
}

export function getSecondDBPoints() {
    return data.secondDB;
}

export function setFirstDBPoints(points) {
    data.firstDB = points
}

export function setSecondDBPoints(points) {
    data.secondDB = points
}

/* Controls animations */
export function getStatusDisplayOptions() {
    return data.statusVisible;
}

export function getPlacementsDisplayOptions() {
    return data.placementsVisible;
}

export function setStatusDisplayOptions(option) {
    if (typeof option != "boolean") return;

    data.statusVisible = option;
}

export function setPlacementsDisplayOptions(option) {
    if (typeof option != "boolean") return;

    data.placementsVisible = option;
}