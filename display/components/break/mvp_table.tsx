import styles from './mvp_table.module.css'

import { getPlayerAvatar } from '@/lib/client/playerInfo';
import { getTitle, getSubtitle, getColumnKeys, getPlayerData, getPlayers } from '@/lib/client/breakMVPInfo';
import { formatValue, hexToRGBA, sortPlayerAndData } from '@/lib/utils/utils';
import { getConfigColours } from '@/lib/client/config';
import { ListEntry } from '../list';

const colours = await getConfigColours();

// there's some hardcoded values, but will be sorted out later on.
export default function MVPTable ({screen}: {screen: string}) {
    const headings = getColumnKeys(screen)

    const getHeadings = () => {
        let divList = headings.map((col: string) => {
            return <Heading key={col} col={col}/>
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
            <div className={styles.grid} style={{"--columns": headings.length + 1} as React.CSSProperties}>
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
        if (col == "weighted") return hexToRGBA(colours.highlight, 0.75);
        else return hexToRGBA(colours.black, 0.75)
    }

    const getTextColour = () => {
        if (col == "weighted") return "black"
        else return "white"
    }

    return (
        <div className={`${styles.heading} bg-colour text-colour`} 
            style={{"--bg-colour": getBgColour(), "--text-colour": getTextColour()} as React.CSSProperties}>
            <div className={styles.heading_text}>
                <span className={styles.heading_title}>{getTitle(col)}</span><br/>
                <span className={styles.heading_subtitle}>{getSubtitle(col)}</span>
            </div>
        </div>
    )
}

function PlayerMvpEntry({rank, player, screen, headings}: {rank: number, player: string, screen: string, headings: string[]}) {
    const getData = (player: string) => {
        let columnData = [];
        for (let col of headings) {
            columnData.push(col);
        }

        let divList = columnData.map((col) => {
            const getBgColour = () => {
                if (col == "weighted") return hexToRGBA(colours.highlight, 0.75);
                else return hexToRGBA(colours.black, 0.75)
            }
            const getTextColour = () => {
                if (col == "weighted") return "black"
                else return "white"
            }

            return (
                <div key={col} className={`h-[70px] ${styles.entry_data} self-end bg-colour text-colour`} 
                    style={{"--bg-colour": getBgColour(), "--text-colour": getTextColour()} as React.CSSProperties}>
                    <div className={styles.entry_data_text}>{formatData(getPlayerData(player, screen, col))}</div>
                </div>
            )
        })

        return divList
    };

    const formatData = (data: string) => {
        if (screen == "mvp_event") return formatValue(data) + "%";
        return formatValue(data)
    }

    return (
        <div className={`${styles.grid} ${styles.body}`} style={{"--columns": headings.length + 1} as React.CSSProperties}>
            <ListEntry rank={rank} body={
                <div className={`w-[700px] ${styles.entry_name}`}>
                    <img src={getPlayerAvatar(player)}/><span className={styles.entry_name_text}>{player}</span>
                </div>}/>
            {getData(player)}
        </div>
    )
}