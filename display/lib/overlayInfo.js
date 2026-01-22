import multipliers from '@/data/game_multipliers.json';
import gameLogos from '@/data/game_logos.json';

let data = {
    gameNumber: 1,
    multiplier: "x1.0",
    game: "DEFAULT",
    gameLogo: "/game_logos/Default.png"
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