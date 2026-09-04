import { load, save } from '../utils/localDataManager';
import { checkTeam } from '../client/teamInfo';

const statePath = "state/event.json"
const stateDefaultPath = "state/defaults/event.json"

import config from '@/config/general.json' // temporary fix since it's almost event day

/*-------------
 * SETUP
 --------------*/ 
async function getData(reset) {
    let rawData = await load(statePath);
    if (!rawData || reset) rawData = await load(stateDefaultPath);

    rawData.placements = setupPlacementsAfterLoad(rawData.placements, config.info.teams)
    rawData.games = setupEventRundownAfterLoad(rawData.games, config.info.game_amount)

    save(statePath, rawData)
    return rawData;
}

// Pre-occupy the placement based on the config give
function setupPlacementsAfterLoad(placements, placementsCount) {
    if (!placements) placements = []

    for (let i = 1; i <= placementsCount; i++) {
        if (placements[i-1]) continue;
        else placements[i-1] = {place: i, score: -1};
    }
    return placements;
}

// Pre-occupy the event rundown based on the config
function setupEventRundownAfterLoad(games, rundownSlots) {
    if (!games) games = []

    for (let i = 1; i <= rundownSlots; i++) {
        if (games[i-1]) continue;
        else games[i-1] = "";
    }
    return games;
}

let data = await getData(false);

/* --------------
    GETTERS
----------------- */ 
export const getStateData = () => data;

export const getEventStatus = () => data.status;
export const getGameNumber = () => data.status.game_number;
export const getGameMultiplier = () => data.status.current_multiplier;

export const getGames = () => data.games;

export const getPlacements = () => data.placements;
export const getPlacementInfo = (place) => data.placements[place] || {};

/* --------------
    SETTERS
----------------- */ 
// Handle game number and multiplier
export function setGameNumber(gameNo) {
    data.status.game_number = gameNo
    // Check the multiplier associated and attach the multiplier with that (default x1.0)
    data.status.current_multiplier = config.event.multipliers[data.status.game_number - 1] || "x1.0"; 
    save(statePath, data);
    return true;
}

export function setPlaceName(place, name) {
    if (typeof place != "number") return false;
    if (place > config.info.teams || place < 0) return false;

    // Check if name is in the team_info.json - if not, return
    if (!checkTeam(name) && name != "NONE") return false;
    if (name == "NONE") name = "";

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
    if (place > config.info.teams || place < 0) return false;

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

// Handle event's rundown progress bar
export function addGameToHistory(game) {
    if (data.status.game_number < 1) return false;

    data.games[data.status.game_number - 1] = game
    save(statePath, data);
    return true;
}

/* RESET */
export async function resetEvent() {
    data = await getData(true);
    return true;
}