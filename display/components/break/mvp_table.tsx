import config from '@/config/general.json'

import { getPlayerAvatar } from '@/lib/client/playerInfo';
import styles from './mvp_table.module.css'

import { getTitle, getSubtitle, getColumnKeys, getPlayerData, getPlayers } from '@/lib/client/breakMVPInfo';
import { hexToRGBA, sortPlayerAndData } from '@/lib/utils/utils';

// there's some hardcoded values, but will be sorted out later on.
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

        let divList = playerData.map((ele: {player: string, data1: number}) => {
            // get rank position
            let rank = 1;
            let prev = {player: "", data1: 0};
            for (let data of playerData) {
                if (data.player == ele.player) {
                    if (prev.data1 == data.data1) rank--;
                    break;
                }
                rank++;
                prev = data;
            }
            return <PlayerMvpEntry key={ele.player} rank={rank} player={ele.player} screen={screen} headings={headings}/>
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
    const getBgColour = () => {
        if (col == "weighted") return hexToRGBA(config.colours.highlight, 0.75);
        else return hexToRGBA(config.colours.black, 0.75)
    }

    const getTextColour = () => {
        if (col == "weighted") return "black"
        else return "white"
    }

    return (
        <div className={`${styles.heading} bg-colour text-colour`} 
            style={{"--bg-colour": getBgColour(), "--text-colour": getTextColour()} as React.CSSProperties}>
            <span className={styles.heading_title}>{getTitle(col)}</span><br/>
            <span className={styles.heading_subtitle}>{getSubtitle(col)}</span>
        </div>
    )
}

function PlayerMvpEntry({rank, player, screen, headings}: {rank: number, player: string, screen: string, headings: string[]}) {
    const getRank = (rank: number) => {
        const getColour = () => {
            switch(rank) {
                case 1: return hexToRGBA(config.colours.gold, 0.75)
                case 2: return hexToRGBA(config.colours.silver, 0.75)
                case 3: return hexToRGBA(config.colours.bronze, 0.75)
                default: return hexToRGBA(config.colours.black, 0.75)
            }
        }
        
        return <div className={`${styles.position} bg-colour`} style={{'--bg-colour': getColour()} as React.CSSProperties}>{rank}</div>
    };

    const getData = (player: string) => {
        let columnData = [];
        for (let col of headings) {
            columnData.push(col);
        }

        let divList = columnData.map((col) => {
            const getBgColour = () => {
                if (col == "weighted") return hexToRGBA(config.colours.highlight, 0.75);
                else return hexToRGBA(config.colours.black, 0.75)
            }
            const getTextColour = () => {
                if (col == "weighted") return "black"
                else return "white"
            }

            return (
                <div className={`${styles.entry_data} bg-colour text-colour`} 
                    style={{"--bg-colour": getBgColour(), "--text-colour": getTextColour()} as React.CSSProperties}>
                    {getPlayerData(player, screen, col)}{screen == "mvp_event" ? "%": ""}
                </div>
            )
        })

        return divList
    };

    return (
        <div className={`${styles.grid} ${styles.body}`} style={{"--columns": headings.length} as React.CSSProperties}>
            {getRank(rank)}
            <div className={styles.entry_name}>
                <img src={getPlayerAvatar(player)}/>{player}
            </div>
            {getData(player)}
        </div>
    )
}