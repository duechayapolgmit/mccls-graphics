import { load, save } from '../utils/localDataManager';
import { checkGame } from '../client/gameInfo';
import { notifyState } from "@/lib/transmitter/listeners";
import { getConfig } from '@/lib/server/config'

const statePath = "state/voting.json"
const stateDefaultPath = "state/defaults/voting.json"

let data: any = null;
let currentSelectedSlot: number | null = null;
let currentSelectedTimeout: NodeJS.Timeout | null = null;

// Pre-occupy the slots based on the config give
function setupSlotsAfterLoad(slots: any[], slotsCount: number) {
    const res = slots ? [...slots] : [];
    for (let i = 1; i <= slotsCount; i++) {
        if (res[i-1]) continue;
        else res[i-1] = {slot: i, game: "NONE", chosen: false};
    }
    return res;
}

export async function initData() {
    if (data) return data;

    const config = await getConfig("general");

    let loadedData = await load(statePath);
    if (!loadedData) loadedData = await load(stateDefaultPath);

    loadedData.slots = setupSlotsAfterLoad(loadedData.slots, config.voting.slots)

    data = loadedData;
    return data;
}


/* --------------
    GETTERS
----------------- */ 
export const getVotingData = async () => await initData();

/* --------------
    SETTERS
----------------- */ 
// Set game in the next available slot
export async function setGame(game: string) {
    const currData = await initData();
    if (!checkGame(game)) return false; // if game not exists, return

    currData.slots.some( (slot: any) => {
        if (slot.game == "NONE") {
            slot.game = game;
            return true;
        }
    });
    
    save(statePath, currData);
    return true;
}

// Set game in a specified slot
export async function setGameInSlot(slot: number, game: string) {
    const currData = await initData();

    if (typeof slot != "number") return false;
    if (!checkGame(game)) return false; // if game not exists, return
    if (!currData.slots[slot-1]) return false; // if slot doesn't exist, return

    currData.slots[slot-1].game = game;
    save(statePath, currData);
    return true;
}

export async function setDisplayOptions(option: boolean) {
    const currData = await initData();

    if (typeof option == "boolean") {
        currData.visible = option;
        save(statePath, currData);
        return true;
    } 
    return false;
}

export async function setGameNumber(gameNumber: number) {
    const currData = await initData();

    currData.voting_game_number = gameNumber;
    return true;
}

export async function setBelowScreen(key: string) {
    const currData = await initData();

    currData.below_screen = key;
    return true;
}

/* --------------
    MISC
----------------- */ 
// Choose the game in specified slot
export async function chooseGame(slot: number) {
    const currData = await initData();

    if (typeof slot != "number") return false;
    if (!currData.slots[slot-1]) return false; // if slot doesn't exist, return
    if (currData.slots[slot-1].game == "" || currData.slots[slot-1].game == "NONE") return false; // if slot doesn't contain games, return

    // Unselect and clear the timeout of the game that was selected, if accidentally select another one.
    if (currentSelectedSlot && currentSelectedTimeout) {
        currData.slots[currentSelectedSlot-1].chosen = false;
        clearTimeout(currentSelectedTimeout);
        notifyState();
    }

    // Set that chosen slot to be true
    currData.slots[slot-1].chosen = true;
    let game = currData.slots[slot-1].game;
    currentSelectedSlot = slot

    // After 30 seconds, set that chosen slot to be false, clear the slot, and set the game on the overlay to the specified game
    currentSelectedTimeout = setTimeout(() => {
        currData.slots[slot-1].chosen = false;
        console.log()
        setGameInSlot(slot, "NONE");

        currentSelectedSlot = null;
        currentSelectedTimeout = null;

        notifyState();
        // hard-coding the local URLs for now.....
        fetch('http://localhost:3000/api/overlay?game='+game)
        fetch('http://localhost:3000/api/event/games?game='+game)
    }, 30000)


    save(statePath, currData);
    return true;
}

/* RESET */
export async function resetVoting() {
    const config = await getConfig("general");

    data = await load(stateDefaultPath)
    let slot = setupSlotsAfterLoad(data.slots, config.voting.slots)
    data.slots = slot;
    save(statePath, data);
    return true;
}