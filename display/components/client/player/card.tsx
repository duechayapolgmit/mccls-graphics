import { getNotes, getPlayerAvatar, getPlayerFullName, getPlayerWins } from '@/lib/client/playerInfo';
import { checkTeam, getCardBackground, getMemberStatus, getTeamFromMember } from '@/lib/client/teamInfo';

export default function Card({player, team}: {player: string, team: string}) {
    const isSmallName = player == "GoodTimesWithScar" || player == "vintage_applesauce"

    const getBackground = (player: string) => {
        let url = ""

        if (team && checkTeam(team)) url = getCardBackground(team)
        else url = getCardBackground(getTeamFromMember(player))

        return {"--bg-image": `url(${url})`} as React.CSSProperties
    }

    return (
        <div className="relative block w-125 h-137.5 
                        bg-(image:--bg-image)" style={getBackground(player)}>
            <div className="flex w-125 h-112.5 justify-end items-end 
                            bg-(image:--avatar-image)" style={{"--avatar-image": `url(${getPlayerAvatar(player)})`} as React.CSSProperties}>
                <PlayerStatus player={player}/>
                <Wins player={player}/>
            </div>
            <div className={`flex justify-center items-center
                             font-metropolis-black text-white uppercase h-25
                             ${isSmallName ? "card-name-small text-[40px]" : "card-name text-[45px]"}`}>
                <div>{getPlayerFullName(player)}</div>
            </div>
            <div className="font-metropolis text-white opacity-65 w-125 pl-[0.5em] text-[1.25em] -translate-y-[6.5em]">{getNotes(player)}</div>
        </div>
    )
}

function Wins({player} : {player: string}) {
    const wins = getPlayerWins(player)

    if (wins <= 0) return;
    else return (
        <div className="font-minecrafter flex items-end -mr-0.5 -mb-0.5">
            <div className="text-[#ffef00] text-shadow-[1px_2px_10px_black] text-[64pt] -mb-[10pt] -mr-1.25">
                <span className="card-x text-[40px] inline-block">X</span>{wins}
            </div>
            <img src={"/crown-shadow.png"}/>
        </div>
    )
}

function PlayerStatus({player}: {player:string}) {
    const status = getMemberStatus(player)

    if (status == "newcomer") return (
        <div className="bg-[#f1d232] h-9.5 w-125 flex items-center justify-center pt-[0.25em]">
            <div className="card-status-text font-metropolis-black text-[30px]">NEWCOMER</div>
        </div>
    )
    else return "";
}