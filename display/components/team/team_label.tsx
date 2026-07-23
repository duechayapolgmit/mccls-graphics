import { getIconPath, getTeamName } from "@/lib/client/teamInfo";

export function TeamLabel({team} : {team : string}) {
    return (
        <div className="flex items-center font-metropolis-bold">
            <img className="h-[32px] px-[5px]" src={getIconPath(team)}/>{getTeamName(team)}
        </div>
    )
}