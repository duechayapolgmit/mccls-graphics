import path from "path";

import { load, save } from '../utils/localDataManager';
import { checkTeam } from '../client/teamInfo';
import { getConfig } from '../client/config';

const statePath = path.join(process.cwd(), "state/event.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/event.json")

const config = await getConfig();

// Pre-occupy the placement based on the config give
function setupPlacementsAfterLoad(placements, placementsCount) {
    if (!placements) placements = []

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
let placements = setupPlacementsAfterLoad(data.placements, config.info.teams)
data.placements = placements;
save(statePath, data)

/* --------------
    GETTERS
----------------- */ 
export const getStateData = () => data;

export const getPlacements = () => data.placements;
export const getPlacementInfo = (place) => data.placements[place] || {};

/* --------------
    SETTERS
----------------- */ 
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

/* RESET */
export function resetEvent() {
    data = load(stateDefaultPath);
    let placements = setupPlacementsAfterLoad(data.placements, config.info.teams)
    data.placements = placements;
    
    save(statePath, data);
    return true;
}