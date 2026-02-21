import multipliers from '@/data/game_multipliers.json';
import gameLogos from '@/data/game_logos.json';
import yaml from 'js-yaml';
import fs from 'fs';
import path from "path";

const statePath = path.join(process.cwd(), "state/overlay.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/overlay.json")

const config = yaml.load(fs.readFileSync("config/general.yaml", "utf8"));

// Pre-occupy the placement based on the config give
function setupPlacementsAfterLoad(placements, placementsCount) {
    for (let i = 1; i <= placementsCount; i++) {
        if (placements[i-1]) continue;
        else placements[i-1] = {place: i, score: -1};
    }
    return placements;
}

// Load from saved data
function load() {
    try {
        const raw = fs.readFileSync(statePath, "utf8");
        let obj = JSON.parse(raw);
        obj.config = config;

        // Setting up
        let placements = setupPlacementsAfterLoad(obj.placements, obj.config.overlay.placements)
        obj.placements = placements;

        return obj
    } catch (err) {
        console.error("Can't load overlay state, trying defaults");
        return loadDefaults();
    }
}

// Load from default state file
function loadDefaults() {
    try {
        const raw = fs.readFileSync(stateDefaultPath, "utf8");
        let obj = JSON.parse(raw);
        obj.config = config;
        
        // Setting up
        let placements = setupPlacementsAfterLoad(obj.placements, obj.config.overlay.placements)
        obj.placements = placements;

        return obj;
    } catch (err) {
        console.error("Can't load default overlay state.");
        return {}
    }
}

function save(state) {
    try {
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
    } catch (err) {
        console.error("Can't write overlay state", error);
    }
}

let data = load();

/* --------------
    GETTERS
----------------- */ 
export const getOverlayData = () => data;

export const getGameNumber = () => data.gameNumber;
export const getGame = () => data.game;

export const getPlacements = () => data.placements;
export const getPlacementInfo = (place) => data.placements[place] || {};

export const getStatusDisplayOptions = () => data.statusVisible;
export const getPlacementsDisplayOptions = () => data.placementsVisible;

/* --------------
    SETTERS
----------------- */ 
export function setGameNumber(gameNo) {
    data.gameNumber = gameNo
    // Check the multiplier associated and attach the multiplier with that (default x1.0)
    data.multiplier = multipliers[data.gameNumber] || "x1.0"; 
    save(data);
}

export function setGame(game) {
    data.game = game
    // Check the game logo associated
    data.gameLogo = gameLogos[data.game] || "/game_logos/Default.png";
    save(data);
}

export function setPlaceName(place, name) {
    if (typeof place != "number") return;
    if (place > data.config.overlay.placements || place < 0) return;

    // get the score
    let score = data.placements[place - 1].score;

    // save the thing
    data.placements[place - 1] = {
        place: place, name: name, score: score
    }

    save(data)
}

export function setPlaceScore(place, score) {
    if (typeof place != "number") {return};
    if (place > data.config.overlay.placements || place < 0) return;

    // get the name - if applicable
    let name = "NONE";
    if (data.placements[place - 1]) {
        name = data.placements[place - 1].name; 
    }

    // save the thing
    data.placements[place - 1] = {
        place: place, name: name, score: score
    }

    save(data)
}

export function setStatusDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.statusVisible = option;
        save(data);
    } 
}

export function setPlacementsDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.placementsVisible = option;
        save(data);
    }   
}

/* RESET */
export function resetOverlay() {
    data = loadDefaults();
    save(data);
}