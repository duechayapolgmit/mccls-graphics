import { getPlayerAvatar } from '@/lib/client/playerInfo';
import styles from './mvp_table.module.css'

import { getTitle, getSubtitle, getColumnKeys, getPlayerData, getPlayers } from '@/lib/client/breakMVPInfo';
import { sortPlayerAndData } from '@/lib/utils/utils';

export default function MVPTable ({screen}: {screen: string}) {

    const headings = getColumnKeys(screen)

    const getHeadings = () => {
        let divList = headings.map((col: string) => {
            return <Heading col={col}/>
        })

        return divList;
    }

    const getBody = () => {
        let players = getPlayers(screen)

        // get the data for the ranks
        let playerData = []
        for (let player of players) {
            if (screen == "mvp_event") playerData.push({player: player, data1: getPlayerData(player, screen, "weighted")})
            else if (screen == "mvp_season") playerData.push({player: player, data1: getPlayerData(player, screen, "average")})
        }
        playerData = sortPlayerAndData(playerData, "descending")

        let divList = players.map((player: string) => {
            // get rank position
            let rank = 1;
            let prev = {player: "", data1: 0};
            for (let data of playerData) {
                if (data.player == player) {
                    if (prev.data1 == data.data1) rank--;
                    break;
                }
                rank++;
                prev = data;
            }
            return <PlayerMvpEntry key={player} rank={rank} player={player} screen={screen} headings={headings}/>
        })

        return divList;
    }

    return (
        <div className={styles.main}>
            <div className={styles.grid} style={{"--columns": headings.length} as React.CSSProperties}>
                <div className={styles.heading_padding}/>{getHeadings()}
            </div>
            <div className={`${styles.body}`}>
                {getBody()}
            </div>
        </div>
    )
}

function Heading({col}: {col:string}) {
    return (
        <div className={styles.heading}>
            <span className={styles.heading_title}>{getTitle(col)}</span><br/>
            <span className={styles.heading_subtitle}>{getSubtitle(col)}</span>
        </div>
    )
}

function PlayerMvpEntry({rank, player, screen, headings}: {rank: number, player: string, screen: string, headings: string[]}) {
    const getData = (player: string) => {
        let columnData = [];
        for (let col of headings) {
            columnData.push(col);
        }

        let divList = columnData.map((col) => { // hardcoded mvp_event for now
            return <div className={styles.entry_data}>{getPlayerData(player, screen, col)}{screen == "mvp_event" ? "%": ""}</div>
        })

        return divList
    };

    return (
        <div className={`${styles.grid} ${styles.body}`} style={{"--columns": headings.length} as React.CSSProperties}>
            <div className={styles.position}>{rank}</div>
            <div className={styles.entry_name}>
                <img src={getPlayerAvatar(player)}/>{player}
            </div>
            {getData(player)}
        </div>
    )
}