import path from "path";

import { load, save } from '../utils/localDataManager';
import { checkGame } from '../client/gameInfo';
import { notify } from "@/lib/transmitter/listeners";
import { getConfig } from "./config";

const config = await getConfig();

const statePath = "state/voting.json"
const stateDefaultPath = "state/defaults/voting.json"

// Pre-occupy the slots based on the config give
function setupSlotsAfterLoad(slots, slotsCount) {
    for (let i = 1; i <= slotsCount; i++) {
        if (slots[i-1]) continue;
        else slots[i-1] = {slot: i, game: "NONE", chosen: false};
    }
    return slots;
}

// Setup
let data = await load(statePath);
if (!data) data = await load(stateDefaultPath);

// Setup
let slots = setupSlotsAfterLoad(data.slots, config.voting.slots)
data.slots = slots;

let currentSelectedSlot;
let currentSelectedTimeout;

/* --------------
    GETTERS
----------------- */ 
export const getData = () => data;

/* --------------
    SETTERS
----------------- */ 
// Set game in the next available slot
export function setGame(game) {
    if (!checkGame(game)) return false; // if game not exists, return

    data.slots.some(slot => {
        if (slot.game == "NONE") {
            slot.game = game;
            return true;
        }
    });
    
    save(statePath, data);
    return true;
}

// Set game in a specified slot
export function setGameInSlot(slot, game) {
    if (typeof slot != "number") return false;
    if (!checkGame(game)) return false; // if game not exists, return
    if (!data.slots[slot-1]) return false; // if slot doesn't exist, return

    data.slots[slot-1].game = game;
    save(statePath, data);
    return true;
}

export function setDisplayOptions(option) {
    if (typeof option == "boolean") {
        data.visible = option;
        save(statePath, data);
        return true;
    } 
    return false;
}

export function setGameNumber(gameNumber) {
    data.voting_game_number = gameNumber;
    return true;
}

export function setBelowScreen(key) {
    data.below_screen = key;
    return true;
}

/* --------------
    MISC
----------------- */ 
// Choose the game in specified slot
export function chooseGame(slot) {
    if (typeof slot != "number") return false;
    if (!data.slots[slot-1]) return false; // if slot doesn't exist, return
    if (data.slots[slot-1].game == "" || data.slots[slot-1].game == "NONE") return false; // if slot doesn't contain games, return

    // Unselect and clear the timeout of the game that was selected, if accidentally select another one.
    if (currentSelectedSlot) {
        data.slots[currentSelectedSlot-1].chosen = false;
        clearTimeout(currentSelectedTimeout);
        notify(data, "voting"); // notify that there's a change
    }

    // Set that chosen slot to be true
    data.slots[slot-1].chosen = true;
    let game = data.slots[slot-1].game;
    currentSelectedSlot = slot

    // After 30 seconds, set that chosen slot to be false, clear the slot, and set the game on the overlay to the specified game
    currentSelectedTimeout = setTimeout(() => {
        data.slots[slot-1].chosen = false;
        setGameInSlot(slot, "NONE");

        currentSelectedSlot = null;
        currentSelectedTimeout = null;
        notify(data, "voting"); // notify that there's a change
        // hard-coding the local URLs for now.....
        fetch('http://localhost:3000/api/overlay?game='+game)
        fetch('http://localhost:3000/api/event/games?game='+game)
    }, 30000)


    save(statePath, data);
    return true;
}

/* RESET */
export function resetVoting() {
    data = load(stateDefaultPath)
    let slot = setupSlotsAfterLoad(slots, config.voting.slots)
    data.slot = slot;
    save(statePath, data);
    return true;
}