import config from '@/config/general.json'

import fs from 'fs';
import path from "path";

import { checkTeam } from '../client/teamInfo';

const statePath = path.join(process.cwd(), "state/overlay.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/overlay.json")

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

        // Setting up
        let placements = setupPlacementsAfterLoad(obj.placements, config.overlay.placements)
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
        
        // Setting up
        let placements = setupPlacementsAfterLoad(obj.placements, config.overlay.placements)
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
    data.multiplier = config.event.multipliers[data.gameNumber] || "x1.0"; 
    save(data);
    return true;
}

export function setGame(game) {
    data.game = game
    save(data);

    return true;
}

export function setPlaceName(place, name) {
    if (typeof place != "number") return false;
    if (place > config.overlay.placements || place < 0) return false;

    // Check if name is in the team_info.json - if not, return
    if (!checkTeam(name)) return false;

    // get the score
    let score = data.placements[place - 1].score;

    // save the thing
    data.placements[place - 1] = {
        place: place, name: name, score: score
    }

    save(data)

    return true;
}

export function setPlaceScore(place, score) {
    if (typeof place != "number") return false;
    if (place > config.overlay.placements || place < 0) return false;

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
    return true;
}

export function setStatusDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.statusVisible = option;
        save(data);
        return true;
    }
    return false;
}

export function setPlacementsDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.placementsVisible = option;
        save(data);
        return true;
    }
    return false;
}

/* RESET */
export function resetOverlay() {
    data = loadDefaults();
    save(data);
    return true;
}