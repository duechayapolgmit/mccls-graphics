import gameInfo from '@/data/game_logos.json'

import yaml from 'js-yaml';
import fs from 'fs';
import path from "path";

import { notify } from "@/lib/transmitter/listeners";

const statePath = path.join(process.cwd(), "state/voting.json");
const stateDefaultPath = path.join(process.cwd(), "state/defaults/voting.json")

const config = yaml.load(fs.readFileSync("config/general.yaml", "utf8"));

// Pre-occupy the slots based on the config give
function setupSlotsAfterLoad(slots, slotsCount) {
    for (let i = 1; i <= slotsCount; i++) {
        if (slots[i-1]) continue;
        else slots[i-1] = {slot: i, game: "NONE", chosen: false};
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
// Set game in the next available slot
export function setGame(game) {
    if (!gameInfo[game]) return false; // if game not exists, return

    data.slots.some(slot => {
        if (slot.game == "NONE") {
            slot.game = game;
            return true;
        }
    });
    
    save(data);
    return true;
}

// Set game in a specified slot
export function setGameInSlot(slot, game) {
    if (typeof slot != "number") return false;
    if (!gameInfo[game] && !(game=="NONE")) return false; // if game not exists, return
    if (!data.slots[slot-1]) return false; // if slot doesn't exist, return

    data.slots[slot-1].game = game;
    save(data);
    return true;
}

export function setDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.visible = option;
        save(data);
        return true;
    } 
    return false;
}

/* --------------
    MISC
----------------- */ 
// Choose the game in specified slot
export function chooseGame(slot) {
    if (typeof slot != "number") return false;
    if (!data.slots[slot-1]) return false; // if slot doesn't exist, return
    if (data.slots[slot-1].game == "" || data.slots[slot-1].game == "NONE") return false; // if slot doesn't contain games, return

    // Set that chosen slot to be true
    data.slots[slot-1].chosen = true;
    let game = data.slots[slot-1].game;

    // After 30 seconds, set that chosen slot to be false, clear the slot, and set the game on the overlay to the specified game
    setTimeout(() => {
        data.slots[slot-1].chosen = false;
        setGameInSlot(slot, "NONE");
        notify(data); // notify that there's a change
        fetch('http://localhost:3000/api/overlay?game='+game) // hard-coding the local URL for now.....
    }, 30000)


    save(data);
    return true;
}

/* RESET */
export function resetVoting() {
    data = loadDefaults();
    save(data);
    return true;
}