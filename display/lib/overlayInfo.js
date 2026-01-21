import multipliers from '@/data/gameMultipliers.json';

let data = {
    gameNumber: 1,
    multiplier: "x1.0"
}

export function getOverlayData() {
    return data
}

export function getGameNumber() {
    return data.gameNumber;
}

export function setGameNumber(gameNo) {
    data.gameNumber = gameNo

    // Check the multiplier associated and attach the multiplier with that (default x1.0)
    data.multiplier = multipliers[data.gameNumber] || "x1.0";
}