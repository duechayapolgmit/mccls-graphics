import { getIconPath, getTeamName } from "@/lib/client/teamInfo";

export function TeamLabel({team, picSize = "32px"} : {team : string, picSize?: string}) {
    return (
        <div className="flex items-center 
                        font-metropolis-bold uppercase text-white">
            <img className="h-(--pic-size) px-[5px]" 
                 style={{"--pic-size": picSize} as React.CSSProperties}
                 src={getIconPath(team)}/>{getTeamName(team)}
        </div>
    )
}