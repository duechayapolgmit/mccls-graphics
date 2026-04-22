import breakInfo from '@/data/break_screens';

import fs from 'fs';
import path from "path";

import { notify } from "@/lib/transmitter/listeners";

const statePath = path.join(process.cwd(), "state/break.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/break.json")

// Load from saved data
function load() {
    try {
        const raw = fs.readFileSync(statePath, "utf8");
        let obj = JSON.parse(raw);

        return obj
    } catch (err) {
        console.error("Can't load break screen state, trying defaults");
        return loadDefaults();
    }
}

// Load from default state file
function loadDefaults() {
    try {
        const raw = fs.readFileSync(stateDefaultPath, "utf8");
        let obj = JSON.parse(raw);

        return obj;
    } catch (err) {
        console.error("Can't load default break screen state.");
        return {}
    }
}

function save(state) {
    try {
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
    } catch (err) {
        console.error("Can't write voting state", error);
    }
}

let data = load();

/* --------------
    GETTERS
----------------- */ 
export const getData = () => data;

/* --------------
    SETTERS
----------------- */ 
export function setBreakScreen(key) {
    let breakData = breakInfo[key]

    if (breakData) {
        data.currentScreen = key;
        save(data)
        return true;
    }

    return false;
}

/* RESET */
export function resetBreakScreen() {
    data = loadDefaults();
    save(data);
    return true;
}