import path from "path";

import { load, save } from '../utils/localDataManager';

const statePath = path.join(process.cwd(), "state/overlay.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/overlay.json")

// Setup
let data = load(statePath);
if (!data) data = load(stateDefaultPath);

/* --------------
    GETTERS
----------------- */ 
export const getOverlayData = () => data;

export const getGame = () => data.game;

export const getForcedSideOptions = () => data.forcedSide;

export const getStatusDisplayOptions = () => data.statusVisible;
export const getPlacementsDisplayOptions = () => data.placementsVisible;

/* --------------
    SETTERS
----------------- */ 
export function setGame(game) {
    data.game = game
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