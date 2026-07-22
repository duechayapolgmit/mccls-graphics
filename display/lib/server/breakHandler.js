import fs from 'fs';
import path from "path";

import { load, save } from '../utils/localDataManager';
import { getData } from '../utils/dataHelper';

const breakInfo = await getData('/api/break_data/screens')

const statePath = path.join(process.cwd(), "state/break.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/break.json")

let data = load(statePath);
if (!data) data = load(stateDefaultPath);

/* --------------
    GETTERS
----------------- */ 
export const getStateData = () => data;

/* --------------
    SETTERS
----------------- */ 
export function setBreakScreen(key) {
    let breakData = breakInfo[key]

    if (breakData) {
        data.currentScreen = key;
        save(statePath, data);
        return true;
    }

    return false;
}

/* RESET */
export function resetBreakScreen() {
    data = load(stateDefaultPath);
    save(statePath, data);
    return true;
}