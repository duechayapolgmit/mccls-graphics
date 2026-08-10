import path from "path";

import { load, save } from '../utils/localDataManager';
import { getData } from '../utils/dataHelper';

const statePath = "state/break.json"
const stateDefaultPath = "state/defaults/break.json"

let data = await load(statePath);
if (!data) data = await load(stateDefaultPath);

/* --------------
    GETTERS
----------------- */ 
export const getStateData = () => data;

/* --------------
    SETTERS
----------------- */ 
export async function setBreakScreen(key) {
    // get information from break screens first
    const breakInfo = await getData('/api/break_data/screens')
    let breakData = breakInfo[key]

    if (breakData) {
        data.currentScreen = key;
        save(statePath, data);
        return true;
    }

    return false;
}

export function setBreakTimeRemaining(time) {
    data.time = time;

    if (time > 0) data.timeVisible = true;
    else data.timeVisible = false;

    return true;
}

export function setTimeVisible(visible) {
    if (visible) {
        data.timeVisible = true;
    } else {
        data.timeVisible = false;
        data.time = 0; // since it's not visible, set it to zero
    }

    return true;
}

export function setRotating(option) {
    if (option) data.rotating = true;
    else data.rotating = false

    return true;
}

/* RESET */
export function resetBreakScreen() {
    data = load(stateDefaultPath);
    save(statePath, data);
    return true;
}