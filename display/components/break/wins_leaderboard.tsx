import styles from './wins_leaderboard.module.css'

import config from '@/config/break-card_list.json'

import Card from "../player/card";
import { getTeamFromMember } from '@/lib/client/teamInfo';
import { resolveRule } from '@/lib/utils';
import { getWinsLeaderboard } from '@/lib/server/wins';

const ROWS = 3;
export default function WinsLeaderboard({playersWins} : {playersWins: Map<number, string[]>}){

    const getColumnFormat = () => {
        // sort the keys in decreasing order first
        let keys = playersWins.keys().toArray();
        keys.sort((a, b) => b - a);

        // for each key, get the number of players in each array
        let playerAmount = [];
        for (let key of keys) {
            playerAmount.push(playersWins.get(key)?.length || 0)
        }

        // determine columns needed by divide them by 3 (CONCRETE) then ceiling them, and then fraction them
        let columns = [];
        for (let amount of playerAmount) {
            columns.push(`${Math.ceil(amount / ROWS)}fr`)
        }

        return columns.join(" ")
    }


    return (
        <div className={styles.grid} style={{"--column-format": getColumnFormat()} as React.CSSProperties}>
            <div>1232323232323</div>
            <div>2232323232323</div>
            <div>32323232323</div>
            <div>42323232323</div>
        </div>
    )
}