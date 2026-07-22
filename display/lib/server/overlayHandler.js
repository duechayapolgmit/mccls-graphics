import path from "path";

import { load, save } from '../utils/localDataManager';
import { checkTeam } from '../client/teamInfo';
import { getConfig } from '../client/config';

const statePath = path.join(process.cwd(), "state/overlay.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/overlay.json")

const config = await getConfig();

// Pre-occupy the placement based on the config give
function setupPlacementsAfterLoad(placements, placementsCount) {
    for (let i = 1; i <= placementsCount; i++) {
        if (placements[i-1]) continue;
        else placements[i-1] = {place: i, score: -1};
    }
    return placements;
}

// Setup
let data = load(statePath);
if (!data) data = load(stateDefaultPath);

// Setup Placements
let placements = setupPlacementsAfterLoad(data.placements, config.overlay.placements)
data.placements = placements;

/* --------------
    GETTERS
----------------- */ 
export const getOverlayData = () => data;

export const getGameNumber = () => data.gameNumber;
export const getGame = () => data.game;

export const getPlacements = () => data.placements;
export const getPlacementInfo = (place) => data.placements[place] || {};

export const getForcedSideOptions = () => data.forcedSide;

export const getStatusDisplayOptions = () => data.statusVisible;
export const getPlacementsDisplayOptions = () => data.placementsVisible;

/* --------------
    SETTERS
----------------- */ 
export function setGameNumber(gameNo) {
    data.gameNumber = gameNo
    // Check the multiplier associated and attach the multiplier with that (default x1.0)
    data.multiplier = config.event.multipliers[data.gameNumber - 1] || "x1.0"; 
    save(statePath, data);
    return true;
}

export function setGame(game) {
    data.game = game
    save(statePath, data);

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

    save(statePath, data);

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

    save(statePath, data);
    return true;
}

export function setStatusDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.statusVisible = option;
        save(statePath, data);
        return true;
    }
    return false;
}

export function setPlacementsDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.placementsVisible = option;
        save(statePath, data);
        return true;
    }
    return false;
}

export function setForcedSideOptions(option) {
    if (option == "left" || option == "right") data.forcedSide = option;
    else data.forcedSide = "none";

    save(statePath, data);
    return true;
}

/* RESET */
export function resetOverlay() {
    data = load(stateDefaultPath);
    save(statePath, data);
    return true;
}