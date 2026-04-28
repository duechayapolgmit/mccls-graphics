import styles from './card.module.css'

import { getNotes, getPlayerAvatar, getPlayerFullName, getPlayerWins } from '@/lib/client/playerInfo';
import { checkTeam, getCardBackground, getMemberStatus, getTeamFromMember } from '@/lib/client/teamInfo';

export default function Card({player, team}: {player: string, team: string}) {

    const getBackground = (player: string) => {
        let url = ""

        if (team && checkTeam(team)) url = getCardBackground(team)
        else url = getCardBackground(getTeamFromMember(player))

        return {"--bg-image": `url(${url})`} as React.CSSProperties
    }

    return (
        <div className={styles.main} style={getBackground(player)}>
            <div className={styles.avatar} style={{"--avatar-image": `url(${getPlayerAvatar(player)})`} as React.CSSProperties}>
                <PlayerStatus player={player}/>
                <Wins player={player}/>
            </div>
            <div className={player == "GoodTimesWithScar" ? `${styles.name} ${styles.name_small}` : `${styles.name}`}>
                <div>{getPlayerFullName(player)}</div>
            </div>
            <div className={styles.notes}>{getNotes(player)}</div>
        </div>
    )
}

function Wins({player} : {player:string}) {
    const wins = getPlayerWins(player)

    if (wins <= 0) return;
    else return (
        <div className={styles.wins_box}>
            <div className={styles.wins}><span className={styles.x}>X</span>{wins}</div>
            <img src={"/crown-shadow.png"}/>
        </div>
    )
}

function PlayerStatus({player}: {player:string}) {
    const status = getMemberStatus(player)

    if (status == "newcomer") return (
        <div className={styles.status}>
            <div className={styles.status_text}>NEWCOMER</div>
        </div>
    )
    else return "";
}