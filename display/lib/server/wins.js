import { getRoster } from '../client/teamInfo';
import { getPlayerWins } from '../client/playerInfo';

import { sortNoCase } from '../utils';

let playerWinsMap = initWinsLeaderboard();

export const getWinsLeaderboard = () => playerWinsMap;
export const getNoWins = () => playerWinsMap.get(0);

export function getWinsLeaderboardFromAmount(min) {
    let result = new Map();
    for (let winKey of playerWinsMap.keys()) {
        if (winKey >= min) result.set(winKey, playerWinsMap.get(winKey))
    }
    return result;
}

function initWinsLeaderboard() {
    const roster = getRoster();
    let map = new Map();

    // get wins for each player and insert to a map of wins key and values of players
    for (let player of roster) {
        let win = getPlayerWins(player);
        let entry = map.get(win);
        if (!entry) {
            map.set(win, [player])
            continue;
        }

        entry.push(player)
        map.set(win, entry)
    }

    // sort each row
    for (let winKey of map.keys()) {
        map.set(winKey,sortNoCase(map.get(winKey)));
    }

    return map;
}