import { getRoster } from '../client/teamInfo';
import { getPlayerWins } from '../client/playerInfo';

import { sortNoCase } from '../utils';

let noWins = initNoWins();

export const getNoWins = () => noWins;

function initNoWins() {
    const roster = getRoster();
    let result = [];

    for (let player of roster) {
        let win = getPlayerWins(player);
        if (win == 0) result.push(player); 
    }

    return sortNoCase(result);
}