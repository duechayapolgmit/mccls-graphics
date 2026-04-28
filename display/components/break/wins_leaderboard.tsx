import config from '@/config/general.json'
import styles from './wins_leaderboard.module.css'

import Card from "../player/card";

import { getTeamFromMember } from '@/lib/client/teamInfo';
import { hexToRGBA } from '@/lib/utils/utils';
import { getGridColumnFormatFromMap } from '@/lib/utils/winsLeaderboardUtils';

const ROWS = 3;
export default function WinsLeaderboard({playersWins}: {playersWins: Map<number, string[]>}){

    let wins: any[] = playersWins.keys().toArray();
    wins.sort((a,b) => b - a);
    let divList = wins.map((key: number) => {return <WinsGridItem key={key} amount={key} players={playersWins.get(key) || []}/>})

    return (
        <div className={styles.grid} style={{"--column-format": getGridColumnFormatFromMap(playersWins, ROWS)} as React.CSSProperties}>
            {divList}
        </div> 
    )
}

function WinsGridItem({amount, players}: {amount: number, players: string[]}){

    const getColumns = () => {
        return Math.ceil(players.length / ROWS)
    }

    const getHeader = () => {
        if (config.break_screen.highlight_wins_amounts.find((ele) => amount == ele)) { // if it's marked to be highlighted
            return <div className={`${styles.header} bg-colour text-colour`} 
                        style={{"--bg-colour": hexToRGBA(config.colours.highlight, 0.75), "--text-colour:": "black"} as React.CSSProperties}>
                        {amount} WINS</div>
        }
        return <div className={styles.header}>{amount} WINS</div>
    }

    const getItems = () => {
        let divList = players.map((player: string) => {
                return (<div key={player}><Card player={player} team={getTeamFromMember(player)}/></div>)
            })
        if (config.break_screen.highlight_wins_amounts.find((ele) => amount == ele)) { // if it's marked to be highlighted
            return (<div className={`${styles.items} bg-colour`} 
                        style={{"--columns": getColumns(), "--bg-colour": hexToRGBA(config.colours.highlight, 0.75)} as React.CSSProperties}>
                        {divList}
                    </div>)
        }
        return <div className={`${styles.items}`} 
                        style={{"--columns": getColumns()} as React.CSSProperties}>
                       {divList} 
                </div>
    }
    return (
        <div className={styles.entry}>
            {getHeader()}
            {getItems()}
        </div>
    )
}