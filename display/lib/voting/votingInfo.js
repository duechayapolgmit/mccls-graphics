import yaml from 'js-yaml';
import fs from 'fs';
import path from "path";

const statePath = path.join(process.cwd(), "state/voting.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/voting.json")

const config = yaml.load(fs.readFileSync("config/general.yaml", "utf8"));

// Pre-occupy the slots based on the config give
function setupSlotsAfterLoad(slots, slotsCount) {
    for (let i = 1; i <= slotsCount; i++) {
        if (slots[i-1]) continue;
        else slots[i-1] = {slot: i, game: ""};
    }
    return slots;
}

// Load from saved data
function load() {
    try {
        const raw = fs.readFileSync(statePath, "utf8");
        let obj = JSON.parse(raw);
        obj.config = config;

        // Setting up
        let slots = setupSlotsAfterLoad(obj.slots, obj.config.voting.slots)
        obj.slots = slots;

        return obj
    } catch (err) {
        console.error("Can't load voting state, trying defaults");
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
        let slots = setupSlotsAfterLoad(obj.slots, obj.config.voting.slots)
        obj.slots = slots;

        return obj;
    } catch (err) {
        console.error("Can't load default voting state.");
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